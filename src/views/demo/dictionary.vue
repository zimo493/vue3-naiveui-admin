<template>
  <n-flex vertical p-3 :size="[0, 30]">
    <n-card title="在表单中使用" :segmented="{ content: true }">
      <n-flex>
        <FormPro
          v-model="modelValue"
          :form-config="formConfig"
          :form-props="{
            labelWidth: undefined,
            showFeedback: false,
          }"
        />
        <n-code language="json" :code="JSON.stringify(modelValue, null, 2)" />
      </n-flex>
    </n-card>
    <n-card title="使用字典标签" :segmented="{ content: true }">
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
    </n-card>
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
const formConfig = ref<FormPro.FormItemConfig[]>([
  {
    name: "selectDict",
    label: "下拉框",
    component: "select",
    dict: "gender",
    span: 24,
    props: { placeholder: "请选择性别" },
  },
  { name: "radioDict", label: "单选框", component: "radio", span: 24, dict: "gender" },
  { name: "checkboxDict", label: "多选框", component: "checkbox", span: 24, dict: "gender" },
]);
// 表单数据
const modelValue = ref<FormFields>({});
</script>
