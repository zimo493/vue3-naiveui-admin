<template>
  <n-modal
    v-model:show="modal.visible"
    preset="card"
    :title="modal.title"
    :on-mask-click="cancel"
    :style="{ width: width + 'px' }"
    :segmented="{ content: true, action: true }"
    :draggable="draggable"
    @close="cancel"
  >
    <slot name="header" />
    <n-spin :show="show">
      <FormPro
        ref="formPro"
        v-bind="formConfig"
        :modelValue="val"
        :is-look="isLook"
        useType="submit"
        @submit="submit"
      >
        <template v-for="item in Object.keys($slots)" #[item]>
          <slot :name="item" />
        </template>
      </FormPro>
    </n-spin>

    <slot name="footer" />
    <template #action>
      <n-space justify="end">
        <n-button v-if="!isLook" type="primary" :loading="loading" @click="handleSubmit">
          <template #icon>
            <Icones icon="ant-design:check-outlined" />
          </template>
          提交
        </n-button>
        <n-button strong secondary @click="cancel">
          <template #icon>
            <Icones icon="ant-design:close-outlined" />
          </template>
          取消
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>
<script setup lang="ts">
import type { DrawerPlacement } from "naive-ui";

defineOptions({ name: "DialogForm" });

const {
  formConfig,
  modelValue,
  width = 700,
  isLook = false,
  loading = false,
  draggable = false,
} = defineProps({
  formConfig: {
    required: true,
    type: Object as PropType<TablePro.FormOption<Recordable>>,
  },
  modelValue: {
    required: true,
    type: Object as PropType<Recordable>,
  },
  placement: { type: String as PropType<DrawerPlacement> },
  width: { type: Number },
  isLook: { type: Boolean },
  loading: { type: Boolean },
  draggable: { type: Boolean },
});

const modal = ref<{
  title: string;
  visible: boolean;
}>({
  title: "",
  visible: false,
});

const val = computed({
  get: () => modelValue,
  set: (v) => {
    emit("update:modelValue", v);
  },
});

const emit = defineEmits<{
  (e: "update:modelValue", v: Recordable): void;
  (e: "submit", v: Recordable): void;
  (e: "cancel"): void;
}>();

const show = ref<boolean>(false); // 加载状态
const formProRef = useTemplateRef("formPro");

// 点击提交
const handleSubmit = () => formProRef.value?.submit();

/** 提交 */
const submit = (val: Recordable) => emit("submit", val);

/** 取消 */
const cancel = () => {
  formProRef.value?.reset();
  modal.value = { title: "", visible: false };
  emit("cancel");
};

defineExpose({
  /**
   * 打开弹窗
   * @param title 标题
   * @param data 弹窗数据
   */
  open: (title: string, data: Recordable) => {
    console.log();

    modal.value = { title, visible: true };
    val.value = unref(data);
  },
  close: () => {
    formProRef.value?.reset();
    modal.value = { title: "", visible: false };
  },
  // 开启加载
  startLoading: () => (show.value = true),
  // 关闭加载
  hideLoading: () => (show.value = false),
});
</script>
