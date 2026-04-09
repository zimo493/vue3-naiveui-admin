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
    />

    <!-- 详情 -->
    <n-modal
      v-model:show="showModal"
      style="width: 720px; max-height: 600px"
      :title="t('log.detail')"
      draggable
      preset="card"
      content-scrollable
      :segmented="{ content: true, action: true }"
    >
      <n-descriptions
        bordered
        label-placement="left"
        size="small"
        :column="2"
        label-style="width: auto"
      >
        <n-descriptions-item :label="t('tableHeader.operationTitle')" :span="2">
          {{ detailData.title }}
        </n-descriptions-item>
        <n-descriptions-item :label="t('tableHeader.status')">
          <n-tag
            :bordered="false"
            :type="detailData.status === 1 ? 'success' : 'error'"
            size="small"
          >
            {{ detailData.status === 1 ? t("statusTag.success") : t("statusTag.failure") }}
          </n-tag>
        </n-descriptions-item>
        <n-descriptions-item :label="t('tableHeader.executeTime')">
          {{ detailData.executionTime }}ms
        </n-descriptions-item>
        <n-descriptions-item :label="t('tableHeader.apiPath')" :span="2">
          <n-flex>
            <n-tag
              :bordered="false"
              size="small"
              :type="getMethodTagType(detailData.requestMethod)"
            >
              {{ detailData.requestMethod }}
            </n-tag>
            <span>{{ detailData.requestUri }}</span>
          </n-flex>
        </n-descriptions-item>
        <n-descriptions-item :label="t('tableHeader.operator')">
          {{ detailData.operatorName }}
        </n-descriptions-item>
        <n-descriptions-item :label="t('tableHeader.operateTime')">
          {{ detailData.createTime }}
        </n-descriptions-item>
        <n-descriptions-item :label="t('tableHeader.region')">
          {{ detailData.region }}
        </n-descriptions-item>
        <n-descriptions-item :label="t('tableHeader.ip')">
          {{ detailData.ip }}
        </n-descriptions-item>
        <n-descriptions-item :label="t('tableHeader.browser')">
          {{ detailData.browser }}
        </n-descriptions-item>
        <n-descriptions-item :label="t('tableHeader.os')" :span="2">
          {{ detailData.os }}
        </n-descriptions-item>
        <n-descriptions-item :label="t('tableHeader.content')" :span="2">
          <div v-if="detailData.content" class="whitespace-pre-wrap">
            {{ detailData.content }}
          </div>
          <span v-else class="text-gray-400">{{ t("log.none") }}</span>
        </n-descriptions-item>
        <n-descriptions-item
          v-if="detailData.errorMsg"
          :label="t('tableHeader.errorMsg')"
          :span="2"
        >
          <span class="text-red">{{ detailData.errorMsg }}</span>
        </n-descriptions-item>
      </n-descriptions>
      <template #action>
        <n-flex justify="end">
          <n-button strong secondary @click="showModal = false">
            <template #icon><Icones icon="ant-design:close-outlined" /></template>
            {{ t("button.cancel") }}
          </n-button>
        </n-flex>
      </template>
    </n-modal>
  </div>
</template>

<script lang="tsx" setup>
import { TagProps, type DataTableColumns } from "naive-ui";

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
  {
    name: "keywords",
    label: t("tableHeader.keywords"),
    labelMessage: t("tableHeader.ip") + " / " + t("tableHeader.operator"),
  },
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
  { title: t("tableHeader.operationTitle"), key: "title", align: "center" },
  { title: t("tableHeader.apiPath"), key: "requestUri", align: "center" },
  {
    title: t("tableHeader.requestMethod"),
    key: "requestMethod",
    align: "center",
    sorter: "default",
    render: ({ requestMethod }) => (
      <NTag size="small" type={getMethodTagType(requestMethod)}>
        {requestMethod}
      </NTag>
    ),
  },
  { title: t("tableHeader.ip"), key: "ip", align: "center", sorter: "default" },
  { title: t("tableHeader.executeTime"), key: "executionTime", align: "center", sorter: "default" },
  {
    title: t("tableHeader.status"),
    key: "status",
    align: "center",
    sorter: "default",
    render: ({ status }) => (
      <NTag bordered={false} type={status === 1 ? "success" : "error"}>
        {status === 1 ? t("statusTag.success") : t("statusTag.failure")}
      </NTag>
    ),
  },
  { title: t("tableHeader.operator"), key: "operatorName", align: "center", sorter: "default" },
  { title: t("tableHeader.operateTime"), key: "createTime", align: "center", sorter: "default" },
  {
    title: t("tableHeader.action"),
    key: "action",
    align: "center",
    render: (row) => (
      <NButton
        text
        type="info"
        onClick={() => handleDetail(row)}
        v-slots={{ icon: () => <Icones icon="icon-park-outline:doc-detail" /> }}
      >
        {t("button.detail")}
      </NButton>
    ),
  },
];

const handleQuery = () => {
  startLoading();
  LogAPI.getPage(query.value)
    .then((data) => {
      tableData.value = data.list;
      total.value = data.total ?? 0;
    })
    .finally(() => endLoading());
};

// 详情
const detailData = ref<Log.VO>({} as Log.VO);
const showModal = ref<boolean>(false);
const handleDetail = (row: Log.VO) => {
  showModal.value = true;
  detailData.value = { ...row };
};

/** 获取请求方式标签类型 */
const getMethodTagType = (method?: string): TagProps["type"] => {
  if (!method) {
    return "default";
  }
  const map: Record<string, TagProps["type"]> = {
    GET: "success",
    POST: "warning",
    PUT: "primary",
    DELETE: "error",
    PATCH: "info",
  };

  return map[method?.toUpperCase()] ?? "default";
};
</script>
