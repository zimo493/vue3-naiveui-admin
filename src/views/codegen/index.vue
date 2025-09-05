<template>
  <div>
    <TablePro
      v-model="query"
      :form-config="formConfig"
      :columns="columns"
      :table-data="tableData"
      :total="total"
      :loading="loading"
      :row-key="({ tableName }) => tableName"
      operation-button-position="left"
      @query="handleQuery"
      @reset="handleQuery"
    />
    <!-- 生成代码预览 -->
    <GenerateCode ref="generateCode" @refresh="handleQuery" />
  </div>
</template>
<script setup lang="tsx">
import { type DataTableColumns, NButton, NFlex } from "naive-ui";

import GeneratorAPI from "@/api/codeGen";

import { useLoading } from "@/hooks";
import { InquiryBox } from "@/utils";

import Icones from "@/components/icones.vue";

defineOptions({ name: "Codegen" });

const { t } = useI18n();

// 定义表单的初始值
const query = ref<CodeGen.Query>({
  pageNum: 1,
  pageSize: 10,
});
const tableData = ref<CodeGen.VO[]>([]);
const total = ref<number>(0);

const { loading, startLoading, endLoading } = useLoading();

onMounted(() => handleQuery());
/** 查询方法 */
const handleQuery = () => {
  startLoading();
  GeneratorAPI.getTablePage(query.value)
    .then(async (res) => {
      tableData.value = res.list;
      total.value = res.total;
    })
    .finally(() => endLoading());
};

const formConfig = ref<FormPro.FormItemConfig[]>([
  {
    name: "keywords",
    label: t("codeGen.tableHeader.name"),
    props: { placeholder: t("input") + t("codeGen.tableHeader.name") },
  },
]);

const columns = ref<DataTableColumns<CodeGen.VO>>([
  { title: t("codeGen.tableHeader.name"), key: "tableName", align: "center" },
  { title: t("codeGen.tableHeader.comment"), key: "tableComment", align: "center" },
  { title: t("codeGen.tableHeader.engine"), key: "engine", align: "center" },
  { title: t("codeGen.tableHeader.collation"), key: "tableCollation", align: "center" },
  { title: t("tableHeader.createTime"), key: "createTime", align: "center" },
  {
    title: t("tableHeader.action"),
    key: "action",
    align: "center",
    render: (row) => (
      <NFlex justify="center">
        <NButton
          text
          type="primary"
          onClick={() => openDrawer(row)}
          v-slots={{
            icon: () => <Icones icon="ant-design:code-outlined" />,
          }}
        >
          {t("codeGen.generate")}
        </NButton>

        {row.isConfigured === 1 && (
          <NButton
            text
            type="error"
            onClick={() => handleResetConfig(row.tableName)}
            v-slots={{
              icon: () => <Icones icon="ant-design:reload-outlined" />,
            }}
          >
            {t("codeGen.resetConfig")}
          </NButton>
        )}
      </NFlex>
    ),
  },
]);

// 生成代码
const generateCodeRef = useTemplateRef("generateCode");
const openDrawer = (row: CodeGen.VO) => {
  generateCodeRef.value?.open(row.tableName);
  console.log(row);
};

const handleResetConfig = (tableName: string) => {
  InquiryBox(t("codeGen.resetConfigConfirm", { tableName }))
    .then(() => {
      GeneratorAPI.resetGenConfig(tableName).then(() => {
        window.$message.success(t("codeGen.resetConfigSuccess"));
        handleQuery();
      });
    })
    .catch(() => {});
};
</script>
