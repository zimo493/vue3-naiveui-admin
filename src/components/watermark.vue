<script setup lang="ts">
import { useAppStoreHook, useWatermarkStoreHook } from "@/store";

defineOptions({ name: "Watermark" });

const { showWatermark = false } = defineProps({
  showWatermark: { type: Boolean },
});

const appStore = useAppStoreHook();
const watermark = useWatermarkStoreHook();
</script>

<template>
  <n-watermark v-if="showWatermark" :content="appStore.watermarkText" v-bind="watermark.config" />
</template>
