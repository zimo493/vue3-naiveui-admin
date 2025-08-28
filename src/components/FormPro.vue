<template>
  <n-form ref="formPro" :model="modelValue" v-bind="{ ...defaultFormProps, ...formProps }">
    <n-grid v-bind="{ ...defaultGridProps, ...gridProps }">
      <template v-for="item in formItems" :key="item.name">
        <n-form-item-gi
          v-bind="item.formItemProps"
          :span="item.span ?? 4"
          :path="item.name"
          :label="item.label"
        >
          <template v-if="item.labelMessage" #label>
            <FormTipLabel :label="item.label" :msg="item.labelMessage" />
          </template>
          <slot :name="item.name" :value="modelValue[item.name]">
            <n-flex vertical w-full :size="[0, 2]">
              <component
                :is="renderComponent(item)"
                v-model:value="modelValue[item.name]"
                v-bind="{ ...item.props }"
              />
              <template v-if="item.blockMessage">
                <component :is="getBlockMessage(item.blockMessage)" />
              </template>
            </n-flex>
          </slot>
        </n-form-item-gi>
      </template>
      <n-gi :span="operationSpan">
        <slot name="operation" :model="modelValue" />
      </n-gi>
    </n-grid>
  </n-form>
</template>

<script setup lang="ts" generic="T extends Recordable">
import type { FormInst, FormProps, GridProps, SelectOption } from "naive-ui";
import {
  NFlex,
  NInput,
  NSelect,
  NInputNumber,
  NDatePicker,
  NTimePicker,
  NSwitch,
  NTreeSelect,
  NCheckboxGroup,
  NCheckbox,
  NRadio,
  NRadioButton,
  NRadioGroup,
  NText,
  NEllipsis,
} from "naive-ui";

import { useDict } from "@/hooks";

defineOptions({ name: "FormPro" });

const { t } = useI18n();

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
    type: Number as PropType<FormPro.FormProProps["operationSpan"]>,
  },
});

// 表单数据
const modelValue = defineModel<T>("modelValue", {
  default: () => ({}),
});

// 表单引用
const formRef = useTemplateRef<FormInst>("formPro");

// 过滤表单配置项
const formItems = computed(() => formConfig.filter((item) => !item.hidden));

// 字典加载状态
const dictLoading = ref<Record<string, boolean>>({});

// 缓存字典hooks
const dictHooks = computed(() => {
  const hooks: Record<string, ReturnType<typeof useDict>> = {};

  formConfig.forEach((item) => {
    if (item.dict && !hooks[item.dict]) {
      hooks[item.dict] = useDict(item.dict);
    }
  });

  return hooks;
});

// 初始化字典数据
const dictData = computed(() => {
  const cache: Record<string, SelectOption[]> = {};

  formConfig.forEach((item) => {
    // 判断组件类型是否支持字典类型
    if (item.component && item.dict && ["select", "radio", "checkbox"].includes(item.component)) {
      const dict = dictHooks.value[item.dict];

      dictLoading.value[item.dict] = !dict[item.dict].value?.length;
      cache[item.dict] =
        dict[item.dict].value?.map((i) => ({
          label: i.label,
          value: isNaN(Number(i.value)) ? i.value : Number(i.value),
        })) || [];
    }
  });

  return cache;
});

// 监听字典数据变化更新loading状态
watchEffect(() => {
  formConfig.forEach((item) => {
    if (item.component && item.dict && ["select", "radio", "checkbox"].includes(item.component)) {
      const dict = dictHooks.value[item.dict];

      if (dict[item.dict].value?.length && dictLoading.value[item.dict]) {
        dictLoading.value[item.dict] = false;
      }
    }
  });
});

const getBlockMessage = (blockMessage: FormPro.FormItemConfig["blockMessage"]) => {
  // 如果是字符串
  if (typeof blockMessage === "string") {
    return h(
      NText,
      { depth: "3" },
      h(NEllipsis, { lineClamp: 1 }, () => blockMessage)
    );
  }

  // 如果是组件或其他VNode
  return blockMessage;
};

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
    placeholder: getPlaceholder(type, label ?? ""),
  };

  // 处理字典数据
  if (item.dict) {
    defaultProps.options = dictData.value[item.dict];
    defaultProps.loading = dictLoading.value[item.dict];
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

  if (type === "select") {
    return h(component, { filterable: true, consistentMenuWidth: false, ...defaultProps }, slots);
  }

  if (type === "treeSelect") {
    return h(component, { filterable: true, ...defaultProps }, slots);
  }

  if (type === "text") {
    return h(component, defaultProps, () => modelValue.value[item.name]);
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

  if (["select", "date", "treeSelect"].includes(type)) {
    return `${t("select")}${label}`;
  }

  if (["input", "textarea", "number", "password"].includes(type)) {
    return `${t("input")}${label}`;
  }

  return undefined;
};

/**
 * 组件转换函数
 * @param c  选项组组件
 * @param oc  选项组件
 * @param container 是否需要容器组件
 */
const transformComponent =
  (c: Component, oc: Component, container: boolean = true) =>
  (props: { options: SelectOption[] }) => {
    const { options = [] } = props;
    const renderOptions = () => options.map((item) => h(oc, { ...item })); // 渲染选项

    return container ? h(c, props, () => h(NFlex, {}, renderOptions)) : h(c, props, renderOptions);
  };

/**
 * 组件映射表
 */
const componentMap: Record<string, Component> = {
  input: NInput,
  select: NSelect,
  switch: NSwitch,
  textarea: NInput,
  password: NInput,
  number: NInputNumber,
  date: NDatePicker,
  time: NTimePicker,
  radio: transformComponent(NRadioGroup, NRadio),
  checkbox: transformComponent(NCheckboxGroup, NCheckbox),
  "radio-button": transformComponent(NRadioGroup, NRadioButton, false),
  treeSelect: NTreeSelect,
  text: NText,
};

/**
 * 获取组件
 * @param component 组件名称或组件
 */
const getComponent = (component: string | Component): Component =>
  typeof component === "string" ? componentMap[component] : component;

const defaultModel = { ...modelValue.value };

// 暴露表单实例方法
const formInstance: FormPro.FormInstance = {
  validate: async () => {
    await formRef.value?.validate();
  },
  reset: () => {
    formRef.value?.restoreValidation();

    Object.keys(modelValue.value).forEach((key) => {
      (modelValue.value as Recordable)[key] = unref(defaultModel)[key] ?? null;
    });
  },
};

defineExpose(formInstance);
</script>
