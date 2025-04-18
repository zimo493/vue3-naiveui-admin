<template>
  <n-drawer v-model:show="visible" width="80%" :on-after-leave="cancel">
    <n-drawer-content :title="`生成代码 - ${tableCode}`" closable>
      <n-spin :show="loading">
        <template v-if="active === 'basic'">
          <FormPro ref="formProRef" v-bind="formConfig" :modelValue="modelValue" use-type="submit">
            <template #parentMenuId>
              <n-tree-select
                v-model:value="modelValue.parentMenuId"
                filterable
                placeholder="选择上级菜单"
                :options="menuOptions"
                key-field="value"
                label-field="label"
              />
            </template>
          </FormPro>

          <n-data-table size="small" :columns="columns" :data="modelValue.fieldConfigs" />
        </template>
      </n-spin>
      <template #footer>
        <n-space>
          <n-button type="primary" @click="genCode">
            <template #icon>
              <Icones icon="ant-design:check-outlined" />
            </template>
            生成代码
          </n-button>
          <n-button strong secondary @click="cancel">
            <template #icon>
              <Icones icon="ant-design:close-outlined" />
            </template>
            取消
          </n-button>
        </n-space>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
<script lang="tsx" setup>
import { type FormOption, FormItemType } from "@/components/custom/FormPro/types";

import FormPro from "@/components/custom/FormPro/index.vue";
import GeneratorAPI from "@/api/codeGen";
import MenuAPI from "@/api/system/menu";
import { useCompRef, useLoading } from "@/hooks";
import { DataTableColumns, NCheckbox, NFlex, NInput, NInputNumber, NSpace, NText } from "naive-ui";

import EditableCheckbox from "./EditableCheckbox";

defineOptions({ name: "GenerateCode" });

type Active = "basic" | "fields" | "preview";
type FieldConfigKey = "isShowInQuery" | "isShowInList" | "isShowInForm";

const { loading, startLoading, endLoading } = useLoading();

defineExpose({
  open: (tableName: string) => {
    startLoading();
    visible.value = true;
    tableCode.value = tableName;
    Promise.all([getConfigForm(), getMenuOptions()]).finally(() => endLoading());
  },
});

const visible = ref(false);
const tableCode = ref(""); // 表名

const active = ref<Active>("basic");

// 表单配置
const formConfig = ref<FormOption<CodeGen.ConfigForm>>({
  fields: [
    { field: "tableName", label: "表名", type: FormItemType.Input, colSpan: 8 },
    { field: "businessName", label: "业务名", type: FormItemType.Input, colSpan: 8 },
    { field: "packageName", label: "主包名", type: FormItemType.Input, colSpan: 8 },
    { field: "moduleName", label: "模块名", type: FormItemType.Input, colSpan: 6 },
    { field: "entityName", label: "实体名", type: FormItemType.Input, colSpan: 6 },
    { field: "author", label: "作者", type: FormItemType.Input, colSpan: 6 },
    { field: "parentMenuId", label: "上级菜单", slotName: "parentMenuId", colSpan: 6 },
  ],
  labelWidth: 70,
  rules: {
    tableName: [{ required: true, message: "请输入表名", trigger: "blur" }],
    businessName: [{ required: true, message: "请输入业务名", trigger: "blur" }],
    packageName: [{ required: true, message: "请输入主包名", trigger: "blur" }],
    moduleName: [{ required: true, message: "请输入模块名", trigger: "blur" }],
    entityName: [{ required: true, message: "请输入实体名", trigger: "blur" }],
  },
});
const modelValue = ref<CodeGen.ConfigForm>({
  fieldConfigs: [],
});

// 获取基本信息表配置
const getConfigForm = async () => {
  modelValue.value = await GeneratorAPI.getGenConfig(tableCode.value);
  checkAllSelected("isShowInQuery", isCheckAllQuery);
  checkAllSelected("isShowInList", isCheckAllList);
  checkAllSelected("isShowInForm", isCheckAllForm);
};

// 菜单下拉选项
const menuOptions = ref<OptionType[]>([]);
const getMenuOptions = async () => {
  menuOptions.value = await MenuAPI.getOptions(true);
};

// 查询是否全选
const isCheckAllQuery = ref(false);
// 列表是否全选
const isCheckAllList = ref(false);
// 表单是否全选
const isCheckAllForm = ref(false);

const columns = ref<DataTableColumns<CodeGen.FieldConfig>>([
  {
    title: "#",
    key: "index",
    align: "center",
    width: 60,
    render: (_, index) => `${index + 1}`,
  },
  { title: "列名", key: "columnName", align: "center" },
  { title: "列类型", key: "columnType", align: "center" },
  {
    title: "字段名",
    key: "fieldName",
    render: (row) => <NInput v-model:value={row.fieldName} placeholder="请输入字段名" />,
  },
  { title: "字段类型", key: "fieldType", align: "center" },
  {
    title: "字段注释",
    key: "fieldComment",
    render: (row) => <NInput v-model:value={row.fieldComment} placeholder="请输入字段注释" />,
  },
  {
    title: "最大长度",
    key: "maxLength",
    render: (row) => <NInputNumber v-model:value={row.maxLength} placeholder="请输入最大长度" />,
  },
  {
    key: "isShowInQuery",
    align: "center",
    title: () => (
      <NFlex align="center" justify="center">
        <NText>查询</NText>
        <NCheckbox
          v-model:checked={isCheckAllQuery.value}
          onUpdateValue={toggleCheckAll("isShowInQuery", isCheckAllQuery.value)}
        />
      </NFlex>
    ),
    render: (row) => <EditableCheckbox v-model={row.isShowInQuery} />,
  },
  {
    key: "isShowInList",
    align: "center",
    title: () => (
      <NFlex align="center" justify="center">
        <NText>列表</NText>
        <NCheckbox
          v-model:checked={isCheckAllList.value}
          onUpdateValue={toggleCheckAll("isShowInList", isCheckAllList.value)}
        />
      </NFlex>
    ),
    render: (row) => <EditableCheckbox v-model={row.isShowInList} />,
  },
  {
    key: "isShowInForm",
    align: "center",
    title: () => (
      <NFlex align="center" justify="center">
        <NText>表单</NText>
        <NCheckbox
          v-model:checked={isCheckAllForm.value}
          onUpdateValue={toggleCheckAll("isShowInForm", isCheckAllForm.value)}
        />
      </NFlex>
    ),
    render: (row) => <EditableCheckbox v-model={row.isShowInForm} />,
  },
]);

/** 全选 */
const toggleCheckAll = (key: FieldConfigKey, value: boolean) => {
  const fieldConfigs = modelValue.value?.fieldConfigs;

  if (fieldConfigs) {
    fieldConfigs.forEach((row: CodeGen.FieldConfig) => {
      row[key] = value ? 1 : 0;
    });
  }
};

const checkAllSelected = (key: keyof CodeGen.FieldConfig, isCheckAllRef: Ref) => {
  const fieldConfigs = modelValue.value?.fieldConfigs || [];

  isCheckAllRef.value = fieldConfigs.every((row) => row[key] === 1);
};

// 保存配置
const formProRef = useCompRef(FormPro);
const genCode = async () => {
  await formProRef.value?.instance()?.validate();
  await GeneratorAPI.saveGenConfig(tableCode.value, modelValue.value);
  window.$message?.success("保存成功");
};

const cancel = () => {
  active.value = "basic";
  visible.value = false;
};
</script>
