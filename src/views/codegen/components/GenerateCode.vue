<template>
  <n-drawer v-model:show="visible" width="80%" :on-after-leave="cancel">
    <n-drawer-content :title="`${t('codeGen.generate')}- ${tableCode}`" closable>
      <n-spin :show="loading">
        <template v-if="active === 'basic'">
          <FormPro
            ref="formPro"
            v-model="modelValue"
            :form-config="formConfig"
            :form-props="{ rules, labelWidth: 'auto' }"
          >
            <template #parentMenuId>
              <n-tree-select
                v-model:value="modelValue.parentMenuId"
                filterable
                clearable
                :placeholder="t('select') + t('codeGen.tableHeader.parentMenu')"
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
            <n-alert :title="t('codeGen.drawer.alert')" type="warning" />
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
                    <template #description>{{ t("button.copy") }}</template>
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
            {{ t("codeGen.generate") }}
          </n-button>
          <n-flex v-else>
            <n-button type="success" @click="active = 'basic'">
              <template #icon>
                <Icones icon="ant-design:arrow-left-outlined" />
              </template>
              {{ t("codeGen.drawer.configPreview") }}
            </n-button>
            <n-button type="primary" :loading="downloadLoading" @click="handleExportCode">
              <template #icon>
                <Icones icon="ant-design:download-outlined" />
              </template>
              {{
                downloadLoading ? t("codeGen.drawer.downloading") : t("codeGen.drawer.downloadCode")
              }}
            </n-button>
          </n-flex>

          <n-button strong secondary @click="cancel">
            <template #icon>
              <Icones icon="ant-design:close-outlined" />
            </template>
            {{ t("button.cancel") }}
          </n-button>
        </n-flex>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
<script lang="tsx" setup>
import type { DataTableColumns, TreeOption, TreeOverrideNodeClickBehavior } from "naive-ui";
import { NCheckbox, NFlex, NInput, NInputNumber, NText } from "naive-ui";

import GeneratorAPI from "@/api/codeGen";
import MenuAPI from "@/api/system/menu";
import DictAPI from "@/api/system/dict/type";

import { endSpin, exportFile, spin, startSpin } from "@/utils";
import { useLoading } from "@/hooks";
import { MIMETYPE } from "@/enums";
import { FormType, QueryType } from "./config";

import Selection from "./Selection";
import EditableCheckbox from "./EditableCheckbox";
import Icones from "@/components/Icones.vue";

defineOptions({ name: "GenerateCode" });

type Active = "basic" | "preview";
type FieldConfigKey = "isShowInQuery" | "isShowInList" | "isShowInForm";
interface TreeNode {
  label: string;
  key: number;
  content?: string;
  children?: TreeNode[];
}

const { t } = useI18n();

const { loading, startLoading, endLoading } = useLoading();

defineExpose({
  open: (tableName: string) => {
    startLoading();
    visible.value = true;
    tableCode.value = tableName;
    Promise.all([getConfigForm(), getMenuOptions(), getDictOptions()]).finally(() => endLoading());
  },
});

const emit = defineEmits<{
  (e: "refresh"): void;
}>();

const visible = ref(false);
const tableCode = ref(""); // 表名

const active = ref<Active>("basic");

// 表单配置
const formConfig = ref<FormPro.FormItemConfig[]>([
  { name: "tableName", label: t("codeGen.tableHeader.name"), span: 8 },
  { name: "businessName", label: t("codeGen.tableHeader.bizName"), span: 8 },
  { name: "packageName", label: t("codeGen.tableHeader.mainPackage"), span: 8 },
  { name: "moduleName", label: t("codeGen.tableHeader.moduleName"), span: 8 },
  { name: "entityName", label: t("codeGen.tableHeader.entityName"), span: 8 },
  { name: "author", label: t("codeGen.tableHeader.author"), span: 8 },
  {
    name: "removeTablePrefix",
    label: "移除表前缀",
    span: 8,
    props: {
      placeholder: "如: sys_",
    },
  },
  {
    name: "pageType",
    label: "页面类型",
    span: 8,
    component: "radio",
    props: {
      options: [
        { label: "普通", value: "classic" },
        { label: "封装(CURD)", value: "curd" },
      ],
    },
  },
  {
    name: "parentMenuId",
    label: t("codeGen.tableHeader.parentMenu"),
    span: 8,
    labelMessage: t("codeGen.drawer.parentMenuTip"),
  },
]);

const rules = {
  tableName: [
    { required: true, message: t("input") + t("codeGen.tableHeader.name"), trigger: "blur" },
  ],
  businessName: [
    { required: true, message: t("input") + t("codeGen.tableHeader.bizName"), trigger: "blur" },
  ],
  packageName: [
    { required: true, message: t("input") + t("codeGen.tableHeader.mainPackage"), trigger: "blur" },
  ],
  moduleName: [
    { required: true, message: t("input") + t("codeGen.tableHeader.moduleName"), trigger: "blur" },
  ],
  entityName: [
    { required: true, message: t("input") + t("codeGen.tableHeader.entityName"), trigger: "blur" },
  ],
};

const modelValue = ref<CodeGen.ConfigForm>({
  fieldConfigs: [],
});

// 获取基本信息表配置
const getConfigForm = async () => {
  const data = await GeneratorAPI.getGenConfig(tableCode.value);

  data.pageType = data.pageType || "classic"; // 默认普通页面
  modelValue.value = data;

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
const formTypeOptions: OptionType[] = Object.values(FormType.value);
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
  { title: t("codeGen.tableHeader.columnName"), key: "columnName", align: "center" },
  { title: t("codeGen.tableHeader.columnType"), key: "columnType", align: "center" },
  {
    title: t("codeGen.tableHeader.fieldName"),
    key: "fieldName",
    width: 120,
    render: (row) => (
      <NInput v-model:value={row.fieldName} placeholder={t("codeGen.tableHeader.fieldName")} />
    ),
  },
  { title: t("codeGen.tableHeader.fieldType"), key: "fieldType", align: "center" },
  {
    title: t("codeGen.tableHeader.fieldComment"),
    key: "fieldComment",
    width: 120,
    render: (row) => (
      <NInput
        v-model:value={row.fieldComment}
        placeholder={t("codeGen.tableHeader.fieldComment")}
      />
    ),
  },
  {
    title: t("codeGen.tableHeader.maxLength"),
    key: "maxLength",
    width: 120,
    render: (row) => (
      <NInputNumber
        v-model:value={row.maxLength}
        placeholder={t("codeGen.tableHeader.maxLength")}
      />
    ),
  },
  {
    key: "isShowInQuery",
    align: "center",
    title: () => (
      <NFlex align="center" justify="center">
        <NText>{t("codeGen.tableHeader.isShowInQuery")}</NText>
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
        <NText>{t("codeGen.tableHeader.isShowInList")}</NText>
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
        <NText>{t("codeGen.tableHeader.isShowInForm")}</NText>
        <NCheckbox
          v-model:checked={isCheckAllForm.value}
          onUpdateChecked={(v: boolean) => toggleCheckAll("isShowInForm", v)}
        />
      </NFlex>
    ),
    render: (row) => <EditableCheckbox v-model={row.isShowInForm} />,
  },
  {
    title: t("codeGen.tableHeader.isRequired"),
    key: "isRequired",
    align: "center",
    render: (row) => {
      if (row.isShowInForm === 1) {
        return <EditableCheckbox v-model={row.isRequired} />;
      }
    },
  },
  {
    title: t("codeGen.tableHeader.queryType"),
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
    title: t("codeGen.tableHeader.formType"),
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
    title: t("codeGen.tableHeader.dictType"),
    key: "dictType",
    align: "center",
    width: 120,
    render: (row) => {
      if (row.formType === FormType.value.SELECT.value) {
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

/** 是否需要刷新列表 */
const needRefresh = ref(false);

// 保存配置
const formProRef = useTemplateRef("formPro");
const genCode = async () => {
  try {
    startSpin();
    await formProRef.value?.validate();
    await GeneratorAPI.saveGenConfig(tableCode.value, modelValue.value);

    await getConfigForm();

    needRefresh.value = true;

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
  GeneratorAPI.getPreviewData(tableName, modelValue.value.pageType)
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
  GeneratorAPI.download(tableCode.value, modelValue.value.pageType)
    .then((response) => {
      window.$message.loading(t("common.downloading"));
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
  // 取消之后刷新列表
  if (needRefresh.value) {
    emit("refresh");
    needRefresh.value = false;
  }
  visible.value = false;
};
</script>
