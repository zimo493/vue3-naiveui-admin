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

          <!-- 优先展示自定义插槽 -->
          <template v-if="item.slotName != undefined">
            <slot :name="item.slotName" />
          </template>
          <template v-else>
            <FieldRenderer v-model="val" :item="item" />
          </template>
        </n-form-item-grid-item>
      </template>
      <n-gi v-if="useType === 'search'" style="min-width: 172px" :span="6">
        <n-space>
          <n-button type="primary" :loading="loading" @click="handleQuery">
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
import { type FormInst } from "naive-ui";
import { useDict } from "@/hooks";
import FormTipLabel from "@/components/custom/FormTipLabel";
import FieldRenderer from "./component/FieldRender.vue";

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
  loading = false,
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
    type: Array as PropType<TablePro.FormItem<Recordable>[]>,
  },
  rules: { type: Object as PropType<TablePro.FormOption<Recordable>["rules"]> },
  useType: { type: String as PropType<"search" | "submit"> },
  labelPlacement: { type: String as PropType<"left" | "top"> },
  labelAlign: { type: String as PropType<"left" | "right"> },
  // 是否是查看
  isLook: { type: Boolean },
  loading: { type: Boolean },
  gutter: { type: Number },
  showLabel: { type: Boolean },
  labelWidth: { type: Number },
  showFeedback: { type: Boolean },
});

const fieldList = computed(() =>
  fields.map((item) => {
    if (!item.type) {
      item.type = "input";
    }
    if (item.type && item.dict) {
      if (["select", "checkbox", "radio"].includes(item.type)) {
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
