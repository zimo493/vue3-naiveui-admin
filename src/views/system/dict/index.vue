<template>
  <div>
    <SearchTable
      :formConfig="formConfig"
      :modelValue="query"
      :columns="columns"
      :tableData="tableData"
      :total="total"
      :loading="loading"
      :rowKey="(row: DictType.VO) => row.id"
      @update:checked-row-keys="handleCheck"
      @search="handleQuery"
      @reset="handleQuery"
    >
      <template #controls>
        <n-button type="primary" @click="openDrawer()">
          <template #icon>
            <icon-park-outline-plus />
          </template>
          新增
        </n-button>
        <n-button type="error" :disabled="!selectedRowKeys.length" @click="handleDelete()">
          <template #icon>
            <icon-park-outline-delete-themes />
          </template>
          删除
        </n-button>
        <n-button type="warning" :loading="clear" :disabled="clearDisabled" @click="clearDictCache">
          <template #icon>
            <icon-park-outline-delete />
          </template>
          清除缓存
        </n-button>
      </template>
    </SearchTable>

    <!-- 新增、编辑 -->
    <DrawerForm
      ref="drawerForm"
      :form-config="editConfig"
      :model-value="modelValue"
      :width="580"
      :loading="spin"
      @submit="submitForm"
    />
  </div>
</template>
<script setup lang="tsx">
import { type DataTableColumns, type DataTableRowKey, NButton, NSpace } from "naive-ui";
import { type FormOption, FormItemType } from "@/components/custom/FormPro/types";

import DictTypeAPI from "@/api/system/dict/type";

import { router } from "@/router";
import { useLoading } from "@/hooks";
import { spin, executeAsync, InquiryBox } from "@/utils";
import { useDictStoreHook, useTabStoreHook } from "@/store";

import Icones from "@/components/common/Icones.vue";
import CommonStatus from "@/components/common/CommonStatus.vue";

defineOptions({
  name: "DictType",
  inheritAttrs: false,
});

// 定义表单的初始值
const query = ref<DictType.Query>({
  pageNum: 1,
  pageSize: 10,
});

const tableData = ref<DictType.VO[]>([]);
const total = ref<number>(0);

const { loading, startLoading, endLoading } = useLoading();
const { loading: clear, startLoading: clearStart, endLoading: clearEnd } = useLoading();

onMounted(() => handleQuery());
/** 查询方法 */
const handleQuery = () => {
  startLoading();
  DictTypeAPI.getPage(query.value)
    .then(async (res) => {
      tableData.value = res.list;
      total.value = res.total;
    })
    .finally(() => endLoading());
};

const formConfig = ref<FormOption<DictType.Query>>({
  fields: [
    {
      field: "keywords",
      label: "关键字",
      type: FormItemType.Input,
      placeholder: "字典名称/字典编码",
      colSpan: 6,
    },
    {
      field: "status",
      label: "状态",
      type: FormItemType.Select,
      colSpan: 4,
      options: [
        { label: "正常", value: 1 },
        { label: "禁用", value: 0 },
      ],
    },
  ],
});

const columns = ref<DataTableColumns<DictType.VO>>([
  { type: "selection", options: ["all", "none"] },
  { title: "字典名称", key: "name", align: "center" },
  {
    title: "字典编码",
    key: "dictCode",
    align: "center",
    render: (row) => (
      <NButton text type="primary" onClick={() => handleViewItems(row)}>
        {row.dictCode}
      </NButton>
    ),
  },
  {
    title: "状态",
    key: "status",
    align: "center",
    render: ({ status }) => <CommonStatus value={status} />,
  },
  {
    title: "操作",
    key: "action",
    align: "center",
    width: 200,
    render: (row) => (
      <NSpace justify="center">
        <NButton
          text
          type="info"
          v-slots={{ icon: () => <Icones icon="ant-design:edit-outlined" /> }}
          onClick={() => openDrawer(row)}
        >
          编辑
        </NButton>
        <NButton
          text
          type="error"
          v-slots={{ icon: () => <Icones icon="ant-design:delete-outlined" /> }}
          onClick={() => handleDelete(row.id)}
        >
          删除
        </NButton>
      </NSpace>
    ),
  },
]);

const editConfig = ref<FormOption<DictType.Form>>({
  fields: [
    { field: "name", label: "字典名称", type: FormItemType.Input },
    { field: "dictCode", label: "字典编码", type: FormItemType.Input },
    {
      field: "status",
      label: "状态",
      type: FormItemType.Radio,
      options: [
        { label: "正常", value: 1 },
        { label: "禁用", value: 0 },
      ],
    },
    { field: "remark", label: "备注", type: FormItemType.Textarea },
  ],
  labelWidth: 80,
  rules: {
    name: [{ required: true, message: "请输入字典名称", trigger: "blur" }],
    dictCode: [{ required: true, message: "请输入字典编码", trigger: "blur" }],
    status: [{ required: true, type: "number", message: "请选择状态", trigger: "change" }],
  },
});

/** 初始化表单 */
const modelValue = ref<DictType.Form>({
  status: 1,
});

/** 新增、编辑 */
const drawerFormRef = useTemplateRef("drawerForm");
const openDrawer = (row?: DictType.VO) => {
  drawerFormRef.value?.open(row ? "编辑字典" : "新增字典", modelValue.value);

  if (row) {
    drawerFormRef.value?.startLoading();
    DictTypeAPI.getFormData(row.id)
      .then((data) => {
        modelValue.value = { ...data };
      })
      .finally(() => drawerFormRef.value?.hideLoading());
  }
};

/** 表单提交 */
const submitForm = async (val: DictType.Form) =>
  executeAsync(
    () => (val.id ? DictTypeAPI.update(val.id, val) : DictTypeAPI.create(val)),
    () => {
      drawerFormRef.value?.close();
      handleQuery();
    }
  );

/** 选中行 */
const selectedRowKeys = ref<string[]>([]);
const handleCheck = (keys: DataTableRowKey[]) => (selectedRowKeys.value = keys as string[]);

// 删除字典
const handleDelete = (dictId?: string) => {
  const dictIds = dictId || selectedRowKeys.value.join(",");

  InquiryBox("确认删除已选中的数据项?").then(() => {
    DictTypeAPI.deleteByIds(dictIds).then(() => {
      window.$message.success("删除成功");
      handleQuery();
    });
  });
};

// 查看字典项
const handleViewItems = ({ dictCode }: DictType.VO) => {
  // 跳转到字典项管理页面，并传递字典类型信息
  const path = `/system/dict-item`;
  const query = { dictCode };

  router.push({ path, query }).then(() => {
    // 使用 router.resolve 生成完整的路由对象
    const route = router.resolve({ path, query });

    // 添加标签页
    useTabStoreHook().addTab({
      ...route, // 解构路由对象，确保包含所有必要属性
      name: `dict-item`,
      meta: {
        title: `字典数据项`, // 自定义标题
        icon: "icon-park-outline:book-one", // 自定义图标
      },
    });
  });
};

// 清除字典缓存
const dictStore = useDictStoreHook();
const clearDisabled = computed(() => dictStore.dict.length === 0);
const clearDictCache = () => {
  clearStart();
  const dictList = dictStore.dict.map((item) => item.key);

  dictStore.cleanDict();
  setTimeout(() => {
    clearEnd();
    window.$message.success(`清除字典项 ${dictList.join(", ")} 成功`);
  }, 1000);
};
</script>
