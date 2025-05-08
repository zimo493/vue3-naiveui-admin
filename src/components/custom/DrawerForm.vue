<template>
  <n-drawer
    v-model:show="modal.visible"
    :width="width"
    :placement="placement"
    :on-after-leave="cancel"
  >
    <n-drawer-content :title="modal.title">
      <slot name="header" />
      <n-spin :show="show">
        <FormPro
          ref="formProRef"
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
      <template #footer>
        <n-space>
          <n-button v-if="!isLook" type="primary" @click="handleSubmit">
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
    </n-drawer-content>
  </n-drawer>
</template>
<script lang="ts">
export default { name: "DrawerForm" };
</script>
<script lang="ts" setup>
import { DrawerPlacement } from "naive-ui";
import { FormOption } from "@/components/custom/FormPro/types";
import FormPro from "@/components/custom/FormPro/index.vue";

const props = defineProps({
  formConfig: {
    required: true,
    type: Object as PropType<FormOption<Recordable>>,
  },
  modelValue: {
    required: true,
    type: Object as PropType<Recordable>,
  },
  placement: {
    type: String as PropType<DrawerPlacement>,
    default: "right",
  },
  width: {
    type: Number,
    default: 502,
  },
  isLook: {
    type: Boolean,
    default: false,
  },
});
const modal = ref<DrawerModal>({
  title: "",
  visible: false,
});

const val = computed({
  get() {
    return props.modelValue;
  },
  set(v) {
    emit("update:modelValue", v);
  },
});
const emit = defineEmits<{
  (e: "update:modelValue", v: Recordable): void;
  (e: "submit", v: Recordable): void;
  (e: "cancel"): void;
}>();

const show = ref<boolean>(false); // 加载状态
const formProRef = ref<InstanceType<typeof FormPro>>();

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
