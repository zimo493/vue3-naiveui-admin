<template>
  <div class="form-header">
    <slot name="header" />
  </div>
  <n-form
    ref="ruleForm"
    v-bind="$attrs"
    :rules="rules"
    :model="val"
    :label-align="labelAlign"
    :label-placement="labelPlacement"
    :label-width="labelWidth"
    :show-feedback="isLook ? false : showFeedback ? showFeedback : useType === 'submit'"
    :show-label="showLabel"
  >
    <n-grid
      :x-gap="isLook ? 12 : useType === 'submit' ? (gutter ? gutter : 0) : gutter"
      :y-gap="isLook ? 12 : useType === 'submit' ? 0 : gutter"
    >
      <template v-for="item in fieldList" :key="item.field">
        <n-form-item-grid-item
          v-if="!item.isHidden"
          :span="item.colSpan ? item.colSpan : useType === 'submit' ? 24 : 4"
          :label="item.label"
          :path="item.field"
        >
          <template v-if="item.labelMessage" #label>
            <FormTipLabel :label="item.label" :msg="item.labelMessage" />
          </template>
          <template
            v-if="
              item.type === FormItemType.Input ||
              item.type === FormItemType.Password ||
              item.type === FormItemType.Textarea
            "
          >
            <n-input
              v-model:value="val[item.field]"
              v-bind="item.otherOptions"
              :disabled="item.disabled ?? false"
              :readonly="item.readonly ?? false"
              :clearable="item.clearable ?? true"
              :type="
                item.type === FormItemType.Input
                  ? 'text'
                  : item.type === FormItemType.Password
                    ? 'password'
                    : 'textarea'
              "
              :show-password-on="item.type === FormItemType.Password ? 'mousedown' : 'click'"
              :placeholder="item.placeholder ?? `请输入${item.label}`"
              v-on="item.otherEvents ?? {}"
            />
          </template>

          <template v-if="item.type === FormItemType.Number">
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

          <template v-if="item.type === FormItemType.Switch">
            <n-switch
              v-model:value="val[item.field]"
              v-bind="item.otherOptions"
              :disabled="item.disabled ?? false"
              v-on="item.otherEvents ?? {}"
            />
          </template>
          <template v-if="item.type === FormItemType.Radio">
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
          <template v-if="item.type === FormItemType.Checkbox">
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
          <template v-else-if="item.type === FormItemType.Select">
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
          <template v-else-if="item.type === FormItemType.TreeSelect">
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
          <template v-else-if="item.type === FormItemType.Datepicker">
            <n-date-picker
              v-model:value="val[item.field]"
              :clearable="item.clearable ?? true"
              v-bind="item.otherOptions"
              :disabled="item.disabled ?? false"
              :readonly="item.readonly ?? false"
              v-on="item.otherEvents ?? {}"
            />
          </template>
          <template v-else-if="item.type === FormItemType.Timepicker">
            <n-time-picker
              v-model:value="val[`${item.field}`]"
              :clearable="item.clearable ?? true"
              v-bind="item.otherOptions"
              :disabled="item.disabled ?? false"
              :readonly="item.readonly ?? false"
              v-on="item.otherEvents ?? {}"
            />
          </template>
          <template v-else-if="item.type === FormItemType.Text">
            <span>{{ val[`${item.field}`] }}</span>
          </template>
          <template v-if="item.slotName != undefined">
            <slot :name="item.slotName" />
          </template>
        </n-form-item-grid-item>
      </template>
      <n-gi v-if="useType === 'search'" style="min-width: 172px" :span="6">
        <n-space>
          <n-button type="primary" @click="handleQuery">
            <template #icon>
              <icon-park-outline-search />
            </template>
            搜索
          </n-button>
          <n-button strong secondary @click="resetQuery">
            <template #icon>
              <icon-park-outline-redo />
            </template>
            重置
          </n-button>
        </n-space>
      </n-gi>
    </n-grid>
  </n-form>
</template>
<script setup lang="ts">
import { type PropType } from "vue";
import { type FormInst, type FormRules } from "naive-ui";
import { type FormItem, type ItemOption, FormItemType } from "./types";

import { useDict } from "@/hooks";

import FormTipLabel from "@/components/custom/FormTipLabel";

defineOptions({ name: "FormPro" });

const emit = defineEmits<{
  (e: "update:modelValue", v: Recordable): void;
  (e: "reset", v: Recordable): void;
  (e: "submit", v: Recordable): void;
}>();

const {
  modelValue,
  fields,
  rules = {},
  useType = "search",
  labelPlacement = "left",
  labelAlign = "right",
  isLook = false,
  gutter = 16,
  showLabel = true,
  showFeedback = false,
} = defineProps({
  modelValue: {
    required: true,
    type: Object as PropType<Recordable>,
  },
  fields: {
    required: true,
    type: Array as PropType<FormItem<Recordable>[]>,
  },
  rules: { type: Object as PropType<FormRules> },
  useType: { type: String as PropType<"search" | "submit"> },
  labelPlacement: { type: String as PropType<"left" | "top"> },
  labelAlign: { type: String as PropType<"left" | "right"> },
  // 是否是查看
  isLook: { type: Boolean },
  gutter: { type: Number },
  showLabel: { type: Boolean },
  labelWidth: { type: Number },
  showFeedback: { type: Boolean },
});

const fieldList = computed(() =>
  fields.map((item) => {
    if (item.type && item.dict) {
      if ([FormItemType.Select, FormItemType.Radio, FormItemType.Checkbox].includes(item.type)) {
        const dict = useDict(item.dict);

        item.options = dict[item.dict].value.map((i) => {
          return {
            label: i.label,
            value: isNaN(+i.value) ? i.value : +i.value,
          };
        });

        return item;
      }

      return item;
    }

    return item;
  })
);

const val = computed({
  get: () => modelValue,
  set: (v) => {
    emit("update:modelValue", v);
  },
});

/** 表单默认值 */
const defaultValue = { ...val.value };

/** 获取下拉框的选择项 */
const selectOption = (opt?: ItemOption[]) => {
  if (!opt || !opt.length) return [];

  return opt.map(({ label, value, disabled }) => {
    return { label, value, disabled };
  });
};

const ruleFormRef = useTemplateRef<FormInst>("ruleForm");

// 提交按钮触发
const handleQuery = async () => {
  await ruleFormRef.value?.validate();
  emit("submit", val.value);
};

// 重置按钮触发
function resetQuery() {
  ruleFormRef.value?.restoreValidation();
  Object.keys(val.value).forEach((key) => {
    val.value[key] = unref(defaultValue)[key] || null;
  });
  emit("reset", val.value);
}

defineExpose({
  instance: () => ruleFormRef.value,
  submit: async () => {
    console.log(ruleFormRef.value);

    await ruleFormRef.value?.validate();
    emit("submit", val.value);
  },
  reset: () => {
    ruleFormRef.value?.restoreValidation();
    Object.keys(val.value).forEach((key) => {
      val.value[key] = unref(defaultValue)[key] || null;
    });
  },
});
</script>
