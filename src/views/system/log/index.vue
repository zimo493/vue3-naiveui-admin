<template>
  <div>
    <TablePro
      v-model="query"
      :form-config="formConfig"
      :columns="columns"
      :table-data="tableData"
      :total="total"
      :loading="loading"
      :rowKey="(row) => row.id"
      @query="handleQuery"
      @reset="handleQuery"
    />
  </div>
</template>

<script lang="tsx" setup>
import { type DataTableColumns } from "naive-ui";

import LogAPI from "@/api/system/log";

import { useLoading } from "@/hooks";

defineOptions({
  name: "Log",
  inheritAttrs: false,
});

const { t } = useI18n();

const { loading, startLoading, endLoading } = useLoading(true);

onMounted(() => handleQuery());

// 定义表单的初始值
const query = ref<Log.Query>({
  pageNum: 1,
  pageSize: 10,
});

/** 查询表单配置 */
const formConfig = ref<FormPro.FormItemConfig[]>([
  { name: "keywords", label: t("tableHeader.keywords") },
  {
    name: "createTime",
    label: t("tableHeader.operateTime"),
    span: 5,
    component: "date",
    props: {
      type: "daterange",
      closeOnSelect: true,
      onUpdateFormattedValue: (value: [string, string]) => (query.value.createTime = value),
    },
  },
]);

const tableData = ref<Log.VO[]>([]);
const total = ref<number>(0);

const columns: DataTableColumns<Log.VO> = [
  { title: t("tableHeader.apiPath"), key: "requestUri" },
  { title: t("tableHeader.logModule"), key: "module" },
  { title: t("tableHeader.logContent"), key: "content" },
  { title: t("tableHeader.ip"), key: "ip", sorter: "default" },
  {
    title: t("tableHeader.region"),
    key: "region",
    sorter: "default",
    render: ({ region }) => region.replaceAll("0", "").trim(),
  },
  { title: t("tableHeader.browser"), key: "browser", sorter: "default" },
  { title: t("tableHeader.os"), key: "os", sorter: "default" },
  {
    title: t("tableHeader.executeTime"),
    key: "executionTime",
    sorter: "default",
    render: ({ executionTime }) => `${executionTime} ms`,
  },
  { title: t("tableHeader.operator"), key: "operator", sorter: "default" },
  { title: t("tableHeader.operateTime"), key: "createTime", sorter: "default" },
];

const handleQuery = () => {
  startLoading();
  LogAPI.getPage(query.value)
    .then((data) => {
      tableData.value = data.list;
      total.value = data.total;
    })
    .finally(() => endLoading());
};
</script>
