<template>
  <div>
    <SearchTable
      :formConfig="formConfig"
      :modelValue="query"
      :columns="columns"
      :tableData="tableData"
      :total="total"
      :loading="loading"
      :rowKey="(row: DictData.VO) => row.id"
      @update:checked-row-keys="handleCheck"
      @search="handleQuery"
      @reset="handleQuery"
    >
      <template #dictCode>
        <n-select
          v-model:value="query.dictCode"
          :options="dictTypeList"
          @update:value="handleChange"
        />
      </template>
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
        <n-button @click="handleClose">
          <template #icon>
            <icon-park-outline-close-small />
          </template>
          关闭
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
<script lang="tsx" setup>
import type { VNodeChild } from "vue";
import {
  type DataTableColumns,
  type DataTableRowKey,
  NButton,
  NFlex,
  NSpace,
  NTag,
  NText,
  SelectOption,
} from "naive-ui";
import { type FormOption, FormItemType } from "@/components/custom/FormPro/types";

import DictTypeAPI from "@/api/system/dict/type";
import DictDataAPI from "@/api/system/dict/data";

import { useLoading } from "@/hooks";
import { spin, startSpin, endSpin, InquiryBox } from "@/utils";
import { useTabStoreHook } from "@/store";

import Icones from "@/components/common/Icones.vue";
import CommonStatus from "@/components/common/CommonStatus.vue";

defineOptions({
  name: "DictItem",
  inheritAttrs: false,
});

const route = useRoute();

const dictCode = ref(route.query.dictCode as string);

const tabStore = useTabStoreHook();

const dictTypeList = ref<OptionType[]>([]);
const getDictType = () => {
  DictTypeAPI.getList().then((data) => {
    dictTypeList.value = data;
  });
};

getDictType();

// 定义表单的初始值
const query = ref<DictData.Query>({
  pageNum: 1,
  pageSize: 10,
  dictCode: dictCode.value,
});

const tableData = ref<DictData.VO[]>([]);
const total = ref<number>(0);

const { loading, startLoading, endLoading } = useLoading();

onMounted(() => handleQuery());

const handleChange = (v: string) => {
  dictCode.value = v;
  handleQuery();
};
/** 查询方法 */
const handleQuery = () => {
  startLoading();
  DictDataAPI.getDictItemPage(dictCode.value, query.value)
    .then(async (res) => {
      tableData.value = res.list;
      total.value = res.total;
    })
    .finally(() => endLoading());
};

const formConfig = ref<FormOption<DictData.Query>>({
  fields: [
    { field: "dictCode", label: "字典编码", slotName: "dictCode" },
    {
      field: "keywords",
      label: "关键字",
      type: FormItemType.Input,
      placeholder: "请输入字典数据值/标签",
    },
  ],
});

const columns = ref<DataTableColumns<DictData.VO>>([
  { type: "selection", options: ["all", "none"] },
  { title: "字典标签", key: "label", align: "center" },
  { title: "字典值", key: "value", align: "center" },
  { title: "排序", key: "sort", align: "center" },
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
    width: 150,
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

const editConfig = ref<FormOption<DictData.Form>>({
  fields: [
    { field: "label", label: "字典标签", type: FormItemType.Input },
    { field: "value", label: "字典值", type: FormItemType.Input },
    { field: "sort", label: "排序", type: FormItemType.Number },
    {
      field: "tagType",
      label: "标签类型",
      type: FormItemType.Select,
      clearable: false,
      options: [
        { label: "默认", value: "" },
        { label: "主要", value: "primary" },
        { label: "成功", value: "success" },
        { label: "信息", value: "info" },
        { label: "警告", value: "warning" },
        { label: "错误", value: "danger" },
      ],
      otherOptions: {
        /** 自定义渲染 */
        renderLabel: ({ label, value }: SelectOption): VNodeChild => (
          <NFlex align="center">
            {value && (
              <NText type={value === "danger" ? "error" : value}>{`${label} (${value})`}</NText>
            )}
            <NTag
              type={value ? (value === "danger" ? "error" : value) : "default"}
              bordered={false}
              size="small"
            >
              {modelValue.value.label}
            </NTag>
          </NFlex>
        ),
      },
    },
    {
      field: "status",
      label: "状态",
      type: FormItemType.Radio,
      options: [
        { label: "正常", value: 1 },
        { label: "禁用", value: 0 },
      ],
    },
  ],
  labelWidth: 80,
  rules: {
    label: [{ required: true, message: "请输入字典标签", trigger: "blur" }],
    value: [{ required: true, message: "请输入字典值", trigger: "blur" }],
    status: [{ required: true, type: "number", message: "请选择状态", trigger: "change" }],
  },
});

/** 初始化表单 */
const modelValue = ref<DictData.Form>({
  id: "",
  dictCode: dictCode.value,
  status: 1,
  sort: 1,
});

/** 新增、编辑 */
const drawerFormRef = useTemplateRef("drawerForm");
const openDrawer = (row?: DictData.VO) => {
  drawerFormRef.value?.open(row ? "编辑字典项" : "新增字典项", modelValue.value);

  if (row) {
    drawerFormRef.value?.startLoading();
    DictDataAPI.getDictItemFormData(dictCode.value, row.id)
      .then((data) => {
        modelValue.value = { ...data };
      })
      .finally(() => drawerFormRef.value?.hideLoading());
  } else {
    // 新增时重置表单
    modelValue.value = {
      id: "",
      dictCode: dictCode.value,
      status: 1,
      sort: 1,
    };
  }
};

/** 表单提交 */
const submitForm = async (val: DictData.Form) => {
  if (val.tagType === null) {
    val.tagType = "";
  }
  try {
    startSpin();
    val.id
      ? await DictDataAPI.updateDictItem(dictCode.value, val.id, val)
      : await DictDataAPI.createDictItem(dictCode.value, val);

    window.$message.success("操作成功");
    drawerFormRef.value?.close();
    handleQuery();
  } finally {
    endSpin();
  }
};

/** 选中行 */
const selectedRowKeys = ref<string[]>([]);
const handleCheck = (keys: DataTableRowKey[]) => (selectedRowKeys.value = keys as string[]);

// 删除字典项
const handleDelete = (id?: string) => {
  const ids = id || selectedRowKeys.value.join(",");

  InquiryBox("确认删除已选中的数据项?").then(() => {
    DictDataAPI.deleteDictItems(dictCode.value, ids).then(() => {
      window.$message.success("删除成功");
      handleQuery();
    });
  });
};

// 返回按钮(关闭当前页面打开字典管理页面)
const handleClose = () => tabStore.closeCurrentTabOpenNew("/system/dict");
</script>
