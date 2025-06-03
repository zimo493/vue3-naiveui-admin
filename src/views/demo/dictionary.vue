<template>
  <n-flex vertical>
    <n-flex>
      <FormPro v-bind="formConfig" :modelValue="modelValue" use-type="submit" />
      <n-code language="json" :code="JSON.stringify(modelValue, null, 2)" />
    </n-flex>
    <n-flex vertical>
      <n-flex align="center">
        <DictTag :options="gender" :value="1" />
        <span>单个 Number 类型的 value</span>
      </n-flex>
      <n-flex align="center">
        <DictTag :options="gender" value="2" />
        <span>单个 String 类型的 value</span>
      </n-flex>
      <n-flex align="center">
        <DictTag :options="gender" :value="[0, 1]" />
        <n-divider vertical />
        <DictTag :options="gender" :value="['1', '2']" />
        <span>Array 类型的 value</span>
      </n-flex>
      <n-flex align="center">
        <DictTag :options="gender" value="0,1,2" />
        <span>String 类型的 value 使用分隔符</span>
      </n-flex>
      <n-flex align="center">
        <DictTag :options="gender" value="0-1-2" separator="-" />
        <span>String 类型的 value 自定义分隔符</span>
      </n-flex>
    </n-flex>
  </n-flex>
</template>
<script lang="tsx" setup>
import { useDict } from "@/hooks";

interface FormFields {
  selectDict?: number;
  radioDict?: number;
  checkboxDict?: number[];
}

const { gender } = useDict("gender");

// 表单配置
const formConfig = ref<TablePro.FormOption<FormFields>>({
  fields: [
    {
      field: "selectDict",
      label: "下拉框",
      type: "select",
      dict: "gender",
      placeholder: "请选择性别",
    },
    { field: "radioDict", label: "单选框", type: "radio", dict: "gender" },
    { field: "checkboxDict", label: "多选框", type: "checkbox", dict: "gender" },
  ],
  labelWidth: 60,
});
// 表单数据
const modelValue = ref<FormFields>({
  radioDict: 2,
});
</script>
