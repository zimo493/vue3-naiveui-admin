<template>
  <div>
    <SearchTable
      :formConfig="formConfig"
      :modelValue="query"
      :columns="columns"
      :tableData="tableData"
      :total="total"
      :loading="loading"
      :rowKey="(row: Config.VO) => row.id"
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
        <n-button type="warning" @click="handleRefreshCache()">
          <template #icon>
            <icon-park-outline-refresh />
          </template>
          刷新缓存
        </n-button>
      </template>
    </SearchTable>

    <!-- 新增、编辑 -->
    <DrawerForm
      ref="drawerFormRef"
      :form-config="editConfig"
      :model-value="modelValue"
      :width="580"
      @submit="submitForm"
    />
  </div>
</template>
<script setup lang="tsx">
import { type DataTableColumns, NButton, NSpace } from "naive-ui";
import { type FormOption, FormItemType } from "@/components/custom/FormPro/types";
import { type DrawerFormInst } from "@/types/inst";

import ConfigAPI from "@/api/system/config";

import { useLoading } from "@/hooks";
import { InquiryBox } from "@/utils";

defineOptions({
  name: "Config",
  inheritAttrs: false,
});

// 定义表单的初始值
const query = ref<Config.Query>({
  pageNum: 1,
  pageSize: 10,
});

const tableData = ref<Config.VO[]>([]);
const total = ref<number>(0);

const { loading, startLoading, endLoading } = useLoading();

onMounted(() => handleQuery());
/** 查询方法 */
const handleQuery = () => {
  startLoading();
  ConfigAPI.getPage(query.value)
    .then(async (res) => {
      tableData.value = res.list;
      total.value = res.total;
    })
    .finally(() => endLoading());
};

// 查询表单
const formConfig = ref<FormOption<Config.Query>>({
  fields: [
    {
      field: "keywords",
      label: "关键字",
      type: FormItemType.Input,
      placeholder: "请输入配置名称/配置键",
    },
  ],
});

const columns = ref<DataTableColumns<Config.VO>>([
  { title: "配置名称", key: "configName", align: "center" },
  { title: "配置键", key: "configKey", align: "center" },
  { title: "配置值", key: "configValue", align: "center" },
  { title: "备注", key: "remark", align: "center" },
  {
    title: "操作",
    key: "action",
    align: "center",
    render: (row) => {
      return (
        <NSpace justify="center">
          <NButton text type="info" onClick={() => openDrawer(row)}>
            编辑
          </NButton>
          <NButton text type="error" onClick={() => handleDelete(row.id)}>
            删除
          </NButton>
        </NSpace>
      );
    },
  },
]);

const editConfig = ref<FormOption<Config.Form>>({
  fields: [
    { field: "configName", label: "配置名称", type: FormItemType.Input },
    { field: "configKey", label: "配置键", type: FormItemType.Input },
    { field: "configValue", label: "配置值", type: FormItemType.Input },
    { field: "remark", label: "备注", type: FormItemType.Textarea },
  ],
  labelWidth: 80,
  rules: {
    configName: [{ required: true, message: "请输入配置名称", trigger: "blur" }],
    configKey: [{ required: true, message: "请输入配置键", trigger: "blur" }],
    configValue: [{ required: true, message: "请输入配置值", trigger: "blur" }],
  },
});

/** 初始化表单 */
const modelValue = ref<Config.Form>({});

/** 新增、编辑 */
const drawerFormRef = ref<DrawerFormInst>();
const openDrawer = (row?: Config.VO) => {
  drawerFormRef.value?.open(row ? "编辑配置" : "新增配置", modelValue.value);

  if (row) {
    drawerFormRef.value?.startLoading();
    ConfigAPI.getFormData(row.id)
      .then((data) => {
        modelValue.value = { ...data };
      })
      .finally(() => drawerFormRef.value?.hideLoading());
  }
};

/** 表单提交 */
const submitForm = async (val: Config.Form) => {
  val.id ? await ConfigAPI.update(val.id, val) : await ConfigAPI.create(val);

  window.$message.success("操作成功");

  drawerFormRef.value?.close();
  handleQuery();
};

// 删除配置
const handleDelete = (id: string) => {
  InquiryBox("确认删除该配置项?").then(() => {
    ConfigAPI.deleteById(id).then(() => {
      window.$message.success("删除成功");
      handleQuery();
    });
  });
};

// 添加刷新缓存的加载状态
const refreshLoading = ref<boolean>(false);

// 刷新缓存
const handleRefreshCache = () => {
  refreshLoading.value = true;
  ConfigAPI.refreshCache()
    .then(() => window.$message.success("缓存刷新成功"))
    .finally(() => (refreshLoading.value = false));
};
</script>
