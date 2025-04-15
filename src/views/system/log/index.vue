<template>
  <div>
    <SearchTable
      :formConfig="formConfig"
      :modelValue="query"
      :columns="columns"
      :tableData="tableData"
      :total="total"
      :loading="loading"
      :rowKey="(row:Log.VO)=> row.id"
      @search="handleQuery"
      @reset="handleQuery"
    />
  </div>
</template>

<script lang="tsx" setup>
import { type FormOption, FormItemType } from "@/components/custom/FormPro/types";
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
const formConfig = ref<FormOption<Log.Query>>({
  fields: [
    { field: "keywords", label: "关键字", type: FormItemType.Input },
    {
      field: "createTime",
      label: "操作时间",
      colSpan: 5,
      type: FormItemType.Datepicker,
      otherOptions: {
        type: "daterange",
        closeOnSelect: true,
      },
      otherEvents: {
        updateFormattedValue: (value: [string, string]) => (query.value.createTime = value),
      },
    },
  ],
});

const tableData = ref<Log.VO[]>([]);
const total = ref<number>(0);

const columns: DataTableColumns<Log.VO> = [
  { title: "操作人", key: "operator", align: "center", sorter: "default" },
  { title: "日志模块", key: "module", align: "center", sorter: "default" },
  { title: "日志内容", key: "content", align: "center", sorter: "default" },
  { title: "IP 地址", key: "ip", align: "center", sorter: "default" },
  { title: "地区", key: "region", align: "center", sorter: "default" },
  { title: "浏览器", key: "browser", align: "center", sorter: "default" },
  { title: "终端系统", key: "os", align: "center", sorter: "default" },
  { title: "执行时间(ms)", key: "executionTime", align: "center", sorter: "default" },
  { title: "操作时间", key: "createTime", align: "center", sorter: "default" },
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
