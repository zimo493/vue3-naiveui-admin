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
          {{ t("button.add") }}
        </n-button>
        <n-button type="warning" :loading="spin" @click="handleRefreshCache()">
          <template #icon>
            <icon-park-outline-refresh />
          </template>
          {{ t("button.refreshCache") }}
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
import { type DataTableColumns, NButton, NFlex } from "naive-ui";

import ConfigAPI from "@/api/system/config";

import { useLoading } from "@/hooks";
import { spin, startSpin, endSpin, InquiryBox, executeAsync } from "@/utils";

import Icones from "@/components/icones.vue";

defineOptions({
  name: "Config",
  inheritAttrs: false,
});

const { t } = useI18n();

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
      tableData.value = res.data;
      total.value = res.page?.total ?? 0;
    })
    .finally(() => endLoading());
};

// 查询表单
const formConfig = ref<FormPro.FormItemConfig[]>([
  {
    name: "keywords",
    label: t("tableHeader.keywords"),
    props: { placeholder: t("tableHeader.configName") + " / " + t("tableHeader.configKey") },
  },
]);

const columns = ref<DataTableColumns<Config.VO>>([
  { title: t("tableHeader.configName"), key: "configName", align: "center" },
  { title: t("tableHeader.configKey"), key: "configKey", align: "center" },
  { title: t("tableHeader.configValue"), key: "configValue", align: "center" },
  { title: t("tableHeader.remark"), key: "remark", align: "center" },
  {
    title: t("tableHeader.action"),
    key: "action",
    align: "center",
    render: (row) => (
      <NFlex justify="center">
        <NButton
          text
          type="info"
          v-slots={{ icon: () => <Icones icon="ant-design:edit-outlined" /> }}
          onClick={() => openDrawer(row)}
        >
          {t("button.edit")}
        </NButton>
        <NButton
          text
          type="error"
          v-slots={{ icon: () => <Icones icon="ant-design:delete-outlined" /> }}
          onClick={() => handleDelete(row)}
        >
          {t("button.delete")}
        </NButton>
      </NFlex>
    ),
  },
]);

const editFormConfig: DialogForm.Form = {
  config: [
    { name: "configName", label: t("tableHeader.configName") },
    { name: "configKey", label: t("tableHeader.configKey") },
    { name: "configValue", label: t("tableHeader.configValue") },
    { name: "remark", label: t("tableHeader.remark"), component: "textarea" },
  ],
  props: {
    rules: {
      configName: [
        {
          required: true,
          message: t("input") + t("tableHeader.configName"),
          trigger: "blur",
        },
      ],
      configKey: [
        {
          required: true,
          message: t("input") + t("tableHeader.configKey"),
          trigger: "blur",
        },
      ],
      configValue: [
        {
          required: true,
          message: t("input") + t("tableHeader.configValue"),
          trigger: "blur",
        },
      ],
    },
  },
};

/** 初始化表单 */
const modelValue = ref<Config.Form>({});

/** 新增、编辑 */
const drawerFormRef = useTemplateRef("drawerForm");
const openDrawer = (row?: Config.VO) => {
  drawerFormRef.value?.open(row ? t("config.edit") : t("config.add"), modelValue.value);

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
const submitForm = (val: Config.Form) =>
  executeAsync(
    () => (val.id ? ConfigAPI.update(val.id, val) : ConfigAPI.create(val)),
    () => {
      drawerFormRef.value?.close();
      handleQuery();
    }
  );

// 删除配置
const handleDelete = ({ configName: name, id }: Config.VO) => {
  InquiryBox(t("config.delete", { name })).then(() => {
    ConfigAPI.deleteById(id).then(() => {
      window.$message.success(t("message.deleteSuccess"));
      handleQuery();
    });
  });
};

// 刷新缓存
const handleRefreshCache = () => {
  startSpin();
  ConfigAPI.refreshCache()
    .then(() => window.$message.success(t("config.refreshCache")))
    .finally(() => endSpin());
};
</script>
