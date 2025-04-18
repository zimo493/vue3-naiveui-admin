<template>
  <div>
    <SearchTable
      :formConfig="formConfig"
      :modelValue="query"
      :columns="columns"
      :tableData="tableData"
      :total="total"
      :loading="loading"
      :rowKey="({tableName}: CodeGen.VO) => tableName"
      @search="handleQuery"
      @reset="handleQuery"
    />
    <!-- 预览 -->
    <CodePreview ref="codePreviewRef" />
  </div>
</template>
<script setup lang="tsx">
import { NButton, NSpace, type DataTableColumns } from "naive-ui";
import { type FormOption, FormItemType } from "@/components/custom/FormPro/types";

import GeneratorAPI from "@/api/codeGen";

import { useCompRef, useLoading } from "@/hooks";
import { InquiryBox } from "@/utils";

import Icones from "@/components/common/Icones.vue";
import CodePreview from "./components/CodePreview.vue";

defineOptions({
  name: "Codegen",
});

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

const formConfig = ref<FormOption<CodeGen.Query>>({
  fields: [
    {
      field: "keywords",
      label: "关键字",
      type: FormItemType.Input,
      placeholder: "请输入表名",
    },
  ],
});

const columns = ref<DataTableColumns<CodeGen.VO>>([
  { title: "表名", key: "tableName", align: "center" },
  { title: "描述", key: "tableComment", align: "center" },
  { title: "存储引擎", key: "engine", align: "center" },
  { title: "排序规则", key: "tableCollation", align: "center" },
  { title: "创建时间", key: "createTime", align: "center" },
  {
    title: "操作",
    key: "action",
    align: "center",
    render: (row) => (
      <NSpace justify="center">
        <NButton
          text
          type="primary"
          onClick={() => openDrawer(row)}
          v-slots={{
            icon: () => <Icones icon="ant-design:code-outlined" />,
          }}
        >
          生成代码
        </NButton>

        {row.isConfigured === 1 && (
          <>
            <NButton
              text
              type="info"
              onClick={() => handlePreview(row)}
              v-slots={{
                icon: () => <Icones icon="ant-design:eye-outlined" />,
              }}
            >
              预览
            </NButton>
            <NButton
              text
              type="error"
              onClick={() => handleResetConfig(row.tableName)}
              v-slots={{
                icon: () => <Icones icon="ant-design:reload-outlined" />,
              }}
            >
              重置配置
            </NButton>
          </>
        )}
      </NSpace>
    ),
  },
]);

const openDrawer = (row: CodeGen.VO) => {
  console.log(row);
};

// 预览代码
const codePreviewRef = useCompRef(CodePreview);
const handlePreview = (row: CodeGen.VO) => {
  console.log(row);
  codePreviewRef.value?.open(row.tableName);
};

const handleResetConfig = (tableName: string) => {
  InquiryBox(`确定要重置 ${tableName} 的配置吗？`)
    .then(() => {
      GeneratorAPI.resetGenConfig(tableName).then(() => {
        window.$message.success("重置成功");
        handleQuery();
      });
    })
    .catch(() => {});
};
</script>
