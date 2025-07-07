<template>
  <n-form
    ref="formRef"
    :model="modelValue"
    v-bind="{ ...defaultFormProps, ...formProps, ...$attrs }"
  >
    <n-grid v-bind="{ ...defaultGridProps, ...gridProps }">
      <template v-for="item in formItems" :key="item.name">
        <n-form-item-grid-item :span="item.span ?? 4" :path="item.name">
          <template #label>
            <FormTipLabel v-if="item.labelMessage" :label="item.label" :msg="item.labelMessage" />
            <span v-else>{{ item.label }}</span>
          </template>
          <slot :name="item.name" :value="modelValue[item.name]">
            <component
              :is="renderComponent(item)"
              v-model:value="modelValue[item.name]"
              clsss="flex items-center justify-start"
              v-bind="{ ...item.props }"
            ></component>
          </slot>
        </n-form-item-grid-item>
      </template>
      <n-gi :span="operationSpan">
        <slot name="operation" :model="modelValue" />
      </n-gi>
    </n-grid>
  </n-form>
</template>

<script setup lang="tsx" generic="T extends Recordable">
import {
  type FormInst,
  type FormProps,
  type GridProps,
  type SelectOption,
  NCheckbox,
  NCheckboxGroup,
  NFlex,
  NRadio,
  NRadioGroup,
} from "naive-ui";

import FormTipLabel from "@/components/custom/FormTipLabel";

type NComponentName =
  | "NInput"
  | "NSelect"
  | "NInputNumber"
  | "NDatePicker"
  | "NTimePicker"
  | "NSwitch";

/**
 * 模拟获取字典数据
 * @param dict
 */
const getDict = (dict: string) => {
  return new Promise<SelectOption[]>((resolve) => {
    if (!dict) resolve([]);
    setTimeout(() => {
      resolve([
        { label: "选项1", value: 1 },
        { label: "选项2", value: 2 },
        { label: "选项3", value: 3 },
        { label: "选项4", value: 4 },
      ]);
    }, 2000);
  });
};

/**
 * 默认的FormProps
 */
const defaultFormProps: FormProps = {
  labelPlacement: "left",
  labelWidth: 80,
};

/**
 * 默认的GridProps
 */
const defaultGridProps: GridProps = {
  xGap: 16,
};

/**
 * 表单项通用的Props
 */
const baseProps: Record<string, any> = {
  clearable: true,
};

const {
  formConfig = [],
  formProps = {},
  gridProps = {},
  operationSpan = 4,
} = defineProps({
  formConfig: {
    type: Object as PropType<FormPro.FormItemConfig[]>,
  },
  formProps: {
    type: Object as PropType<FormPro.FormProProps["formProps"]>,
  },
  gridProps: {
    type: Object as PropType<FormPro.FormProProps["gridProps"]>,
  },
  operationSpan: {
    type: Number,
  },
});

// 表单数据
const modelValue = defineModel<T>("modelValue", {
  default: () => ({}),
});

// 表单引用
const formRef = useTemplateRef<FormInst>("formRef");

// 过滤表单配置项
const formItems = computed(() => formConfig.filter((item) => !item.hidden));

// 创建异步组件的工具函数
const createAsyncComponent = (componentName: NComponentName) =>
  defineAsyncComponent(() => import("naive-ui").then((m) => m[componentName]));

// 字典数据缓存
const dictCache = ref<Record<string, SelectOption[]>>({});
const dictLoading = ref<Record<string, boolean>>({});

// 初始化字典数据
watchEffect(() => {
  formConfig.forEach((item) => {
    if (item.dict && !dictCache.value[item.dict] && !dictLoading.value[item.dict]) {
      console.log("初始化字典数据", item.dict);
      dictLoading.value[item.dict] = true;
      getDict(item.dict).then((options) => {
        dictCache.value[item.dict!] = options;
        dictLoading.value[item.dict!] = false;
      });
    }
  });
});

/**
 * 渲染表单项组件
 * @param item 表单项配置对象
 */
const renderComponent = (item: FormPro.FormItemConfig) => {
  const { component: comp, label, props = {}, slots } = item;

  // 如果是函数组件
  if (comp && typeof comp === "function") {
    return comp;
  }

  const type = comp ?? "input";

  // 构建组件属性
  const defaultProps: Record<string, any> = {
    ...baseProps,
    ...props,
    placeholder: getPlaceholder(type, label),
  };

  // 处理字典数据
  if (item.dict) {
    const dict = item.dict;

    defaultProps.options = dictCache.value[dict];
    defaultProps.loading = !defaultProps.options && (dictLoading.value[dict] || false);
  }

  // 获取最终要渲染的组件
  const component = getComponent(type);

  // 处理特殊组件类型
  if (type === "textarea") {
    return h(component, { ...defaultProps, type: "textarea" }, slots);
  }

  if (type === "password") {
    return h(component, { showPasswordOn: "mousedown", ...defaultProps, type: "password" }, slots);
  }

  return h(component, defaultProps, slots);
};

/**
 * 获取placeholder
 * @param type 组件类型
 * @param label 组件标签
 */
const getPlaceholder = (type: FormPro.ComponentType, label: string) => {
  if (typeof type !== "string") return undefined;

  if (["select", "date-picker"].includes(type)) {
    return `请选择${label}`;
  }

  if (["input", "textarea", "number", "password"].includes(type)) {
    return `请输入${label}`;
  }

  return undefined;
};

/**
 * 组件转换函数
 * @param c  选项组组件
 * @param oc  选项组件
 */
const transformComponent =
  (c: Component, oc: Component) => (props: { options: SelectOption[] }) => {
    const { options = [] } = props;

    return h(c, props, () => h(NFlex, {}, () => options.map((item) => h(oc, { ...item }))));
  };

/**
 * 组件映射表
 */
const componentMap: Record<string, Component> = {
  input: createAsyncComponent("NInput"),
  select: createAsyncComponent("NSelect"),
  switch: createAsyncComponent("NSwitch"),
  textarea: createAsyncComponent("NInput"),
  password: createAsyncComponent("NInput"),
  number: createAsyncComponent("NInputNumber"),
  "date-picker": createAsyncComponent("NDatePicker"),
  "time-picker": createAsyncComponent("NTimePicker"),
  "radio-group": transformComponent(NRadioGroup, NRadio),
  "checkbox-group": transformComponent(NCheckboxGroup, NCheckbox),
};

/**
 * 获取组件
 * @param component 组件名称或组件
 */
const getComponent = (component: string | Component): Component =>
  typeof component === "string" ? componentMap[component] : component;

// 暴露表单实例方法
const formInstance: FormPro.FormInstance = {
  validate: async () => {
    await formRef.value?.validate();
  },
  reset: () => {
    formRef.value?.restoreValidation();
  },
};

defineExpose(formInstance);
</script>
