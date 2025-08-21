<template>
  <n-drawer
    v-model:show="modal.visible"
    v-bind="{
      width: 502,
      placement: 'right',
      ...props.props,
      closeOnEsc: !isAllowClose,
      maskClosable: !isAllowClose,
      onAfterLeave: cancel,
    }"
  >
    <n-drawer-content :title="modal.title">
      <slot name="header" />
      <n-spin :show="loading">
        <FormPro
          ref="formPro"
          v-model:model-value="modelValue"
          :form-config="showFormConfig"
          :form-props="{ labelWidth: 'auto', ...(form?.props || {}) }"
          :grid-props="{ ...(form?.gridProps || {}) }"
        >
          <!-- 转发所有具名插槽 -->
          <template v-for="(_, name) in $slots" :key="name" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps" />
          </template>
        </FormPro>
      </n-spin>
      <slot name="footer" />
      <template #footer>
        <n-flex justify="end">
          <n-button
            v-if="useType === 'submit'"
            type="primary"
            :loading="loading"
            @click="handleSubmit"
          >
            <template #icon>
              <Icones icon="ant-design:check-outlined" />
            </template>
            {{ form?.positiveText ?? t("button.submit") }}
          </n-button>
          <n-button strong secondary :disabled="isAllowClose" @click="cancel">
            <template #icon>
              <Icones icon="ant-design:close-outlined" />
            </template>
            {{ form?.negativeText ?? t("button.cancel") }}
          </n-button>
        </n-flex>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
<script lang="ts" setup generic="T extends Recordable">
interface Props {
  props?: DialogForm.DrawerProps;
  form?: DialogForm.Form;
  formConfig?: FormPro.FormItemConfig[];
  loading?: boolean;
  useType?: "submit" | "view";
}

defineOptions({
  name: "DrawerForm",
});

const { t } = useI18n();

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  useType: "submit",
});

// 表单参数
const modelValue = defineModel<T>("modelValue", {
  default: () => ({}),
});

/**
 * 展示的表单配置
 * 优先使用直接传入的 formConfig，如果没有则使用 form.config
 */
const showFormConfig = computed(() => {
  return (props.formConfig || props.form?.config || []).map((item) => ({
    ...item,
    span: item.span ?? 24,
  }));
});

const emit = defineEmits<{
  (e: "submit", v: T): void;
  (e: "cancel"): void;
}>();

// 是否允许关闭
const isAllowClose = computed(() => props.loading);

const formProRef = useTemplateRef("formPro");
const modal = ref<FormModal>({
  title: "",
  visible: false,
});

// 点击提交
const handleSubmit = async () => {
  await formProRef.value?.validate();
  emit("submit", modelValue.value);
};

/** 取消 */
const cancel = () => {
  formProRef.value?.reset();
  modal.value = { title: "", visible: false };
  emit("cancel");
};

// 暴露表单实例方法
const dialogFormInstance: DialogForm.Instance<T> = {
  /**
   * 打开弹窗
   * @param title 标题
   * @param data 表单数据
   */
  open: (title: string, data: T) => {
    modal.value = { title, visible: true };
    modelValue.value = unref(data);
  },
  close: () => {
    formProRef.value?.reset();
    modal.value = { title: "", visible: false };
  },
};

defineExpose(dialogFormInstance);
</script>
