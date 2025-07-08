<template>
  <div>
    <TablePro
      v-model="query"
      :form-config="formConfig"
      :columns="columns"
      :table-data="tableData"
      :total="total"
      :loading="loading"
      :row-key="(row) => row.id"
      @query="handleQuery"
      @reset="handleQuery"
    >
      <template #controls>
        <n-button type="primary" @click="openDrawer()">
          <template #icon>
            <icon-park-outline-plus />
          </template>
          新增
        </n-button>
        <n-button type="warning" :loading="spin" @click="handleRefreshCache()">
          <template #icon>
            <icon-park-outline-refresh />
          </template>
          刷新缓存
        </n-button>
      </template>
    </TablePro>

    <!-- 新增、编辑 -->
    <DrawerForm
      ref="drawerForm"
      v-model="modelValue"
      :form="editFormConfig"
      :loading="spin"
      @submit="submitForm"
    />
  </div>
</template>
<script setup lang="tsx">
import { type DataTableColumns, NButton, NSpace } from "naive-ui";

import ConfigAPI from "@/api/system/config";

import { useLoading } from "@/hooks";
import { spin, startSpin, endSpin, InquiryBox, executeAsync } from "@/utils";

import Icones from "@/components/common/Icones.vue";

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
const formConfig = ref<FormPro.FormItemConfig[]>([
  {
    name: "keywords",
    label: "关键字",
    props: { placeholder: "请输入配置名称 / 配置键" },
  },
]);

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
      );
    },
  },
]);

const editFormConfig: DialogForm.Form = {
  config: [
    { name: "configName", label: "配置名称" },
    { name: "configKey", label: "配置键" },
    { name: "configValue", label: "配置值" },
    { name: "remark", label: "备注", component: "textarea" },
  ],
  props: {
    rules: {
      configName: [{ required: true, message: "请输入配置名称", trigger: "blur" }],
      configKey: [{ required: true, message: "请输入配置键", trigger: "blur" }],
      configValue: [{ required: true, message: "请输入配置值", trigger: "blur" }],
    },
  },
};

/** 初始化表单 */
const modelValue = ref<Config.Form>({});

/** 新增、编辑 */
const drawerFormRef = useTemplateRef("drawerForm");
const openDrawer = (row?: Config.VO) => {
  drawerFormRef.value?.open(row ? "编辑配置" : "新增配置", modelValue.value);

  if (row) {
    startSpin();
    ConfigAPI.getFormData(row.id)
      .then((data) => {
        modelValue.value = { ...data };
      })
      .finally(() => endSpin());
  }
};

/** 表单提交 */
const submitForm = async (val: Config.Form) =>
  executeAsync(
    () => (val.id ? ConfigAPI.update(val.id, val) : ConfigAPI.create(val)),
    () => {
      drawerFormRef.value?.close();
      handleQuery();
    }
  );

// 删除配置
const handleDelete = (id: string) => {
  InquiryBox("确认删除该配置项?").then(() => {
    ConfigAPI.deleteById(id).then(() => {
      window.$message.success("删除成功");
      handleQuery();
    });
  });
};

// 刷新缓存
const handleRefreshCache = () => {
  startSpin();
  ConfigAPI.refreshCache()
    .then(() => window.$message.success("缓存刷新成功"))
    .finally(() => endSpin());
};
</script>
