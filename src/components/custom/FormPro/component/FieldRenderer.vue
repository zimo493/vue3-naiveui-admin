<template>
  <template v-if="item.type && ['input', 'password', 'textarea'].includes(item.type)">
    <n-input
      v-model:value="val[item.field]"
      v-bind="item.otherOptions"
      :disabled="item.disabled ?? false"
      :readonly="item.readonly ?? false"
      :clearable="item.clearable ?? true"
      :type="item.type === 'input' ? 'text' : item.type === 'password' ? 'password' : 'textarea'"
      :show-password-on="item.type === 'password' ? 'mousedown' : 'click'"
      :placeholder="item.placeholder ?? `请输入${item.label}`"
      v-on="item.otherEvents ?? {}"
    />
  </template>
  <template v-else-if="item.type === 'number'">
    <n-input-number
      v-model:value="val[item.field]"
      style="width: 100%"
      v-bind="item.otherOptions"
      :disabled="item.disabled ?? false"
      :readonly="item.readonly ?? false"
      :clearable="item.clearable ?? true"
      v-on="item.otherEvents ?? {}"
    />
  </template>
  <template v-else-if="item.type === 'switch'">
    <n-switch
      v-model:value="val[item.field]"
      v-bind="item.otherOptions"
      :disabled="item.disabled ?? false"
      v-on="item.otherEvents ?? {}"
    />
  </template>
  <template v-else-if="item.type === 'radio'">
    <n-radio-group
      v-model:value="val[item.field]"
      v-bind="item.otherOptions"
      :disabled="item.disabled ?? false"
      v-on="item.otherEvents ?? {}"
    >
      <n-space>
        <n-radio
          v-for="option in item.options"
          :key="option.value"
          :value="option.value"
          :label="option.label"
          :disabled="option.disabled ?? false"
        />
      </n-space>
    </n-radio-group>
  </template>
  <template v-else-if="item.type === 'checkbox'">
    <n-checkbox-group
      v-model:value="val[item.field]"
      v-bind="item.otherOptions"
      :disabled="item.disabled ?? false"
      v-on="item.otherEvents ?? {}"
    >
      <n-space item-style="display: flex;">
        <n-checkbox
          v-for="option in item.options"
          :key="option.value"
          :value="option.value"
          :label="option.label"
          :disabled="option.disabled ?? false"
        />
      </n-space>
    </n-checkbox-group>
  </template>
  <template v-else-if="item.type === 'select'">
    <n-select
      v-model:value="val[item.field]"
      v-bind="item.otherOptions"
      :disabled="item.disabled ?? false"
      :clearable="item.clearable ?? true"
      :options="selectOption(item.options)"
      :placeholder="item.placeholder ?? `请选择${item.label}`"
      v-on="item.otherEvents ?? {}"
    />
  </template>
  <template v-else-if="item.type === 'tree-select'">
    <n-tree-select
      v-model:value="val[item.field]"
      v-bind="item.otherOptions"
      :disabled="item.disabled ?? false"
      :clearable="item.clearable ?? true"
      :options="selectOption(item.options)"
      :placeholder="item.placeholder ?? `请选择${item.label}`"
      key-field="value"
      label-field="label"
      v-on="item.otherEvents ?? {}"
    />
  </template>
  <template v-else-if="item.type === 'datepicker'">
    <n-date-picker
      v-model:value="val[item.field]"
      :clearable="item.clearable ?? true"
      v-bind="item.otherOptions"
      :disabled="item.disabled ?? false"
      :readonly="item.readonly ?? false"
      v-on="item.otherEvents ?? {}"
    />
  </template>
  <template v-else-if="item.type === 'timepicker'">
    <n-time-picker
      v-model:value="val[item.field]"
      :clearable="item.clearable ?? true"
      v-bind="item.otherOptions"
      :disabled="item.disabled ?? false"
      :readonly="item.readonly ?? false"
      v-on="item.otherEvents ?? {}"
    />
  </template>
  <template v-else-if="item.type === 'text'">
    <span>{{ val[item.field] }}</span>
  </template>
</template>

<script setup lang="ts">
const props = defineProps({
  item: {
    type: Object as PropType<TablePro.FormItem<Recordable>>,
    required: true,
  },
  modelValue: {
    type: Object as PropType<Recordable>,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const val = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

/** 获取下拉框的选择项 */
const selectOption = (opt?: TablePro.ItemOption[]) => {
  if (!opt || !opt.length) return [];

  return opt.map(({ label, value, disabled }) => {
    return { label, value, disabled: disabled ?? false };
  });
};
</script>
