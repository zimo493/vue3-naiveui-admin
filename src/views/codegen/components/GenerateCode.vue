<template>
  <n-drawer v-model:show="visible" width="80%" :on-after-leave="cancel">
    <n-drawer-content :title="`生成代码 - ${tableCode}`" closable>
      <n-spin :show="loading">
        <template v-if="active === 'basic'">
          <FormPro
            ref="formPro"
            v-model="modelValue"
            :form-config="formConfig"
            :form-props="{ rules, labelWidth: 90 }"
          >
            <template #parentMenuId>
              <n-tree-select
                v-model:value="modelValue.parentMenuId"
                filterable
                clearable
                placeholder="选择上级菜单"
                :options="menuOptions"
                key-field="value"
                label-field="label"
              />
            </template>
          </FormPro>

          <n-data-table size="small" :columns="columns" :data="modelValue.fieldConfigs" />
        </template>
        <template v-else>
          <n-flex vertical>
            <n-alert title="index.vue 中的代码在此不适用，仅用于演示！" type="warning" />
            <n-grid x-gap="12">
              <n-gi :span="6">
                <n-scrollbar style="height: calc(100vh - 205px)">
                  <n-spin :show="treeDataLoading">
                    <n-tree
                      :data="treeData"
                      :indent="16"
                      block-line
                      default-expand-all
                      :override-default-node-click-behavior="override"
                      :render-label="renderTreeLabel"
                    />
                  </n-spin>
                </n-scrollbar>
              </n-gi>
              <n-gi :span="18">
                <n-scrollbar style="height: calc(100vh - 205px)">
                  <n-float-button v-copy="code" :right="30" :top="120" shape="square">
                    <Icones icon="ep:document-copy" />
                    <template #description>复制</template>
                  </n-float-button>
                  <n-code :code="code" :language="language" show-line-numbers />
                </n-scrollbar>
              </n-gi>
            </n-grid>
          </n-flex>
        </template>
      </n-spin>
      <template #footer>
        <n-flex>
          <n-button v-if="active === 'basic'" type="primary" :loading="spin" @click="genCode">
            <template #icon>
              <Icones icon="ant-design:arrow-right-outlined" />
            </template>
            生成代码
          </n-button>
          <n-flex v-else>
            <n-button type="success" @click="active = 'basic'">
              <template #icon>
                <Icones icon="ant-design:arrow-left-outlined" />
              </template>
              配置预览
            </n-button>
            <n-button type="primary" :loading="downloadLoading" @click="handleExportCode">
              <template #icon>
                <Icones icon="ant-design:download-outlined" />
              </template>
              {{ downloadLoading ? "下载中..." : "下载代码" }}
            </n-button>
          </n-flex>

          <n-button strong secondary @click="cancel">
            <template #icon>
              <Icones icon="ant-design:close-outlined" />
            </template>
            取消
          </n-button>
        </n-flex>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
<script lang="tsx" setup>
import type { DataTableColumns, TreeOverrideNodeClickBehavior, TreeOption } from "naive-ui";

import GeneratorAPI from "@/api/codeGen";
import MenuAPI from "@/api/system/menu";
import DictAPI from "@/api/system/dict/type";

import { spin, startSpin, endSpin, exportFile } from "@/utils";
import { useLoading } from "@/hooks";
import { MIMETYPE } from "@/enums";
import { FormType, QueryType } from "./config";

import Selection from "./Selection";
import EditableCheckbox from "./EditableCheckbox";
import Icones from "@/components/common/Icones.vue";
import { NCheckbox, NFlex, NInput, NInputNumber, NText } from "naive-ui";

defineOptions({ name: "GenerateCode" });

type Active = "basic" | "preview";
type FieldConfigKey = "isShowInQuery" | "isShowInList" | "isShowInForm";
interface TreeNode {
  label: string;
  key: number;
  content?: string;
  children?: TreeNode[];
}

const { loading, startLoading, endLoading } = useLoading();

defineExpose({
  open: (tableName: string) => {
    startLoading();
    visible.value = true;
    tableCode.value = tableName;
    Promise.all([getConfigForm(), getMenuOptions(), getDictOptions()]).finally(() => endLoading());
  },
});

const visible = ref(false);
const tableCode = ref(""); // 表名

const active = ref<Active>("basic");

// 表单配置
const formConfig = ref<FormPro.FormItemConfig[]>([
  { name: "tableName", label: "表名", span: 8 },
  { name: "businessName", label: "业务名", span: 8 },
  { name: "packageName", label: "主包名", span: 8 },
  { name: "moduleName", label: "模块名", span: 6 },
  { name: "entityName", label: "实体名", span: 6 },
  { name: "author", label: "作者", span: 6 },
  {
    name: "parentMenuId",
    label: "上级菜单",
    span: 6,
    labelMessage: `选择上级菜单，生成代码后会自动创建对应菜单。<br />
        注意1: 生成菜单后需分配权限给角色，否则菜单将无法显示。<br />
        注意2: 演示环境默认不生成菜单，如需生成，请在本地部署数据库。`,
  },
]);

const rules = {
  tableName: [{ required: true, message: "请输入表名", trigger: "blur" }],
  businessName: [{ required: true, message: "请输入业务名", trigger: "blur" }],
  packageName: [{ required: true, message: "请输入主包名", trigger: "blur" }],
  moduleName: [{ required: true, message: "请输入模块名", trigger: "blur" }],
  entityName: [{ required: true, message: "请输入实体名", trigger: "blur" }],
};

const modelValue = ref<CodeGen.ConfigForm>({
  fieldConfigs: [],
});

// 获取基本信息表配置
const getConfigForm = async () => {
  modelValue.value = await GeneratorAPI.getGenConfig(tableCode.value);
  // 如果配置过则切换到预览页
  if (modelValue.value.id) {
    active.value = "preview";
    handlePreview(tableCode.value);
  }
  checkAllSelected("isShowInQuery", isCheckAllQuery);
  checkAllSelected("isShowInList", isCheckAllList);
  checkAllSelected("isShowInForm", isCheckAllForm);
};

// 菜单下拉选项
const menuOptions = ref<OptionType[]>([]);
const getMenuOptions = async () => {
  menuOptions.value = await MenuAPI.getOptions(true);
};
// 获取字典下拉选项
const dictOptions = ref<OptionType[]>([]);
const getDictOptions = async () => {
  dictOptions.value = await DictAPI.getList();
};

// 查询是否全选
const isCheckAllQuery = ref(false);
// 列表是否全选
const isCheckAllList = ref(false);
// 表单是否全选
const isCheckAllForm = ref(false);

// 表单类型
const formTypeOptions: OptionType[] = Object.values(FormType);
// 查询方式
const queryTypeOptions: OptionType[] = Object.values(QueryType);
// 字段信息表格配置
const columns = ref<DataTableColumns<CodeGen.FieldConfig>>([
  {
    title: "#",
    key: "index",
    align: "center",
    width: 60,
    render: (_, index) => `${index + 1}`,
  },
  { title: "列名", key: "columnName", align: "center" },
  { title: "列类型", key: "columnType", align: "center" },
  {
    title: "字段名",
    key: "fieldName",
    width: 120,
    render: (row) => <NInput v-model:value={row.fieldName} placeholder="请输入字段名" />,
  },
  { title: "字段类型", key: "fieldType", align: "center" },
  {
    title: "字段注释",
    key: "fieldComment",
    width: 120,
    render: (row) => <NInput v-model:value={row.fieldComment} placeholder="请输入字段注释" />,
  },
  {
    title: "最大长度",
    key: "maxLength",
    width: 120,
    render: (row) => <NInputNumber v-model:value={row.maxLength} placeholder="请输入最大长度" />,
  },
  {
    key: "isShowInQuery",
    align: "center",
    title: () => (
      <NFlex align="center" justify="center">
        <NText>查询</NText>
        <NCheckbox
          v-model:checked={isCheckAllQuery.value}
          onUpdateChecked={(v: boolean) => toggleCheckAll("isShowInQuery", v)}
        />
      </NFlex>
    ),
    render: (row) => <EditableCheckbox v-model={row.isShowInQuery} />,
  },
  {
    key: "isShowInList",
    align: "center",
    title: () => (
      <NFlex align="center" justify="center">
        <NText>列表</NText>
        <NCheckbox
          v-model:checked={isCheckAllList.value}
          onUpdateChecked={(v: boolean) => toggleCheckAll("isShowInList", v)}
        />
      </NFlex>
    ),
    render: (row) => <EditableCheckbox v-model={row.isShowInList} />,
  },
  {
    key: "isShowInForm",
    align: "center",
    title: () => (
      <NFlex align="center" justify="center">
        <NText>表单</NText>
        <NCheckbox
          v-model:checked={isCheckAllForm.value}
          onUpdateChecked={(v: boolean) => toggleCheckAll("isShowInForm", v)}
        />
      </NFlex>
    ),
    render: (row) => <EditableCheckbox v-model={row.isShowInForm} />,
  },
  {
    title: "必填",
    key: "isRequired",
    align: "center",
    render: (row) => {
      if (row.isShowInForm === 1) {
        return <EditableCheckbox v-model={row.isRequired} />;
      }
    },
  },
  {
    title: "查询方式",
    key: "queryType",
    align: "center",
    width: 120,
    render: (row) => {
      if (row.isShowInQuery === 1) {
        return <Selection v-model={row.queryType} options={queryTypeOptions} />;
      }
    },
  },
  {
    title: "表单类型",
    key: "formType",
    align: "center",
    width: 120,
    render: (row) => {
      if (row.isShowInQuery === 1 || row.isShowInForm === 1) {
        return <Selection v-model:value={row.formType} options={formTypeOptions} />;
      }
    },
  },
  {
    title: "字典类型",
    key: "dictType",
    align: "center",
    width: 120,
    render: (row) => {
      if (row.formType === FormType.SELECT.value) {
        return <Selection v-model={row.dictType} options={dictOptions.value} clearable={true} />;
      }
    },
  },
]);

/** 全选 */
const toggleCheckAll = (key: FieldConfigKey, value: boolean) => {
  const fieldConfigs = modelValue.value?.fieldConfigs;

  if (fieldConfigs) {
    fieldConfigs.forEach((row: CodeGen.FieldConfig) => {
      row[key] = value ? 1 : 0;
    });
  }
};

const checkAllSelected = (key: keyof CodeGen.FieldConfig, isCheckAllRef: Ref) => {
  const fieldConfigs = modelValue.value?.fieldConfigs || [];

  isCheckAllRef.value = fieldConfigs.every((row) => row[key] === 1);
};

// 保存配置
const formProRef = useTemplateRef("formPro");
const genCode = async () => {
  try {
    startSpin();
    await formProRef.value?.validate();
    await GeneratorAPI.saveGenConfig(tableCode.value, modelValue.value);

    await getConfigForm();

    active.value = "preview"; // 跳转到预览
  } catch (err) {
    console.error(err);
  } finally {
    endSpin();
  }
};

const treeData = ref<TreeNode[]>([]);
const code = ref<string>("");

/** 获取生成预览 */
const treeDataLoading = ref(false);
const handlePreview = (tableName: string) => {
  treeDataLoading.value = true;
  treeData.value = [];
  GeneratorAPI.getPreviewData(tableName)
    .then((data) => {
      // 组装树形结构完善代码
      treeData.value = buildTree(data);

      // 默认选中第一个叶子节点并设置 code 值
      if (treeData.value.length > 0) {
        const firstLeafNode = findFirstLeafNode(treeData.value[0]);

        if (firstLeafNode) {
          code.value = firstLeafNode.content || "";
        }
      }
    })
    .catch(() => (active.value = "basic"))
    .finally(() => (treeDataLoading.value = false));
};

/**
 * 递归构建树形结构
 *
 * @param data - 数据数组
 * @returns 树形结构节点数组
 */
function buildTree(data: { path: string; fileName: string; content: string }[]): TreeNode[] {
  // 创建一个临时根节点用于构建树结构
  const tempRoot: TreeNode = { label: "temp", key: 0, children: [] };

  // 用于生成唯一key的计数器
  let keyCounter = 1; // 从1开始计数

  // 为节点分配唯一key的函数
  const assignUniqueKey = (node: Partial<TreeNode>): TreeNode => {
    if (!node.key) {
      node.key = keyCounter++;
    }

    return node as TreeNode;
  };

  data.forEach((item) => {
    // 将路径分成数组
    const separator = item.path.includes("/") ? "/" : "\\";
    const parts = item.path.split(separator);

    // 定义特殊路径
    const specialPaths = [
      "src" + separator + "main",
      "java",
      modelValue.value.backendAppName,
      modelValue.value.frontendAppName,
      (modelValue.value.packageName + "." + modelValue.value.moduleName).replace(/\./g, separator),
    ];

    // 检查路径中的特殊部分并合并它们
    const mergedParts: string[] = [];
    let buffer: string[] = [];

    parts.forEach((part) => {
      buffer.push(part);
      const currentPath = buffer.join(separator);

      if (specialPaths.includes(currentPath)) {
        mergedParts.push(currentPath);
        buffer = [];
      }
    });

    // 将 mergedParts 路径中的分隔符\替换为/
    mergedParts.forEach((part, index) => {
      mergedParts[index] = part.replace(/\\/g, "/");
    });

    if (buffer.length > 0) {
      mergedParts.push(...buffer);
    }

    let currentNode = tempRoot;

    mergedParts.forEach((part) => {
      // 查找或创建当前部分的子节点
      let node = currentNode.children?.find((child) => child.label === part);

      if (!node) {
        node = assignUniqueKey({ label: part, children: [] });
        currentNode.children?.push(node);
      }
      currentNode = node;
    });

    // 添加文件节点
    currentNode.children?.push(
      assignUniqueKey({
        label: item.fileName,
        content: item?.content,
      })
    );
  });

  return tempRoot.children || [];
}

/**
 * 递归查找第一个叶子节点
 * @param node - 树形节点
 * @returns 第一个叶子节点
 */
function findFirstLeafNode(node: TreeNode): TreeNode | null {
  if (!node.children || node.children.length === 0) {
    return node;
  }
  for (const child of node.children) {
    const leafNode = findFirstLeafNode(child);

    if (leafNode) {
      return leafNode;
    }
  }

  return null;
}

/**
 * 渲染树节点标签，根据节点类型显示不同的图标
 * @param option - 树节点选项
 */
const renderTreeLabel = ({ option }: { option: TreeOption }) => {
  const label = option.label || "";

  let icon = "vscode-icons:default-folder";

  if (label.endsWith(".java")) icon = "vscode-icons:file-type-java";
  if (label.endsWith(".html")) icon = "vscode-icons:file-type-html";
  if (label.endsWith(".vue")) icon = "vscode-icons:file-type-vue";
  if (label.endsWith(".ts")) icon = "vscode-icons:file-type-typescript-official";
  if (label.endsWith(".xml")) icon = "vscode-icons:file-type-xml";

  return (
    <NFlex align="center">
      <Icones icon={icon} />
      <NText>{label}</NText>
    </NFlex>
  );
};

// 显示的语言
const language = ref("javascript");

const override: TreeOverrideNodeClickBehavior = ({ option }) => {
  if (option.children) {
    return "toggleExpand";
  }

  code.value = (option.content as string) || "";
  language.value = highlightedCode(option.label);

  return "default";
};

const highlightedCode = (key?: string) => {
  if (!key) return "";
  const language = key.substring(key.lastIndexOf(".") + 1);

  if (language === "vue") return "xml";
  if (language === "js" || language === "ts") return "javascript";

  return language;
};

// 下载代码
const downloadLoading = ref(false);
const handleExportCode = () => {
  downloadLoading.value = true;
  GeneratorAPI.download(tableCode.value)
    .then((response) => {
      window.$message.loading("正在下载中，请稍候...");
      const fileName = decodeURI(
        response.headers["content-disposition"].split(";")[1].split("=")[1]
      );

      exportFile(response.data, MIMETYPE.zip, fileName);
    })
    .finally(() => (downloadLoading.value = false));
};

// 取消
const cancel = () => {
  active.value = "basic";
  visible.value = false;
};
</script>
