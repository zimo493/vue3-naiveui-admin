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

const { loading, startLoading, endLoading } = useLoading(true);

onMounted(() => handleQuery());

// 定义表单的初始值
const query = ref<Log.Query>({
  pageNum: 1,
  pageSize: 10,
});

/** 查询表单配置 */
const formConfig = ref<FormPro.FormItemConfig[]>([
  { name: "keywords", label: "关键字" },
  {
    name: "createTime",
    label: "操作时间",
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
  { title: "请求路径", key: "requestUri" },
  { title: "日志模块", key: "module" },
  { title: "日志内容", key: "content" },
  { title: "IP 地址", key: "ip", sorter: "default" },
  {
    title: "地区",
    key: "region",
    sorter: "default",
    render: ({ region }) => region.replaceAll("0", "").trim(),
  },
  { title: "浏览器", key: "browser", sorter: "default" },
  { title: "终端系统", key: "os", sorter: "default" },
  {
    title: "执行时间",
    key: "executionTime",
    sorter: "default",
    render: ({ executionTime }) => `${executionTime} ms`,
  },
  { title: "操作人", key: "operator", sorter: "default" },
  { title: "操作时间", key: "createTime", sorter: "default" },
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
