<template>
  <n-modal
    v-model:show="visible"
    w="[85%]"
    preset="card"
    title="代码预览"
    :on-mask-click="cancel"
    :segmented="{ content: true, action: true }"
    @close="cancel"
  >
    <n-spin :show="loading">
      {{ codeData }}
    </n-spin>
  </n-modal>
</template>
<script lang="tsx" setup>
import GeneratorAPI from "@/api/codeGen";
import { useLoading } from "@/hooks";

defineOptions({ name: "CodePreview" });

const { loading, startLoading, endLoading } = useLoading();

defineExpose({
  open: (tableName: string) => {
    visible.value = true;
    getPreviewCode(tableName);
  },
});

const visible = ref(false);
const codeData = ref<CodeGen.PreviewVO[]>([]);
const getPreviewCode = (tableName: string) => {
  startLoading();
  GeneratorAPI.getPreviewData(tableName)
    .then((data) => (codeData.value = data))
    .finally(() => endLoading());
};

const cancel = () => {
  visible.value = false;
};
</script>
