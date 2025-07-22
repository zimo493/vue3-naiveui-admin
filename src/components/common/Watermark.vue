<script setup lang="ts">
import { useAppStoreHook } from "@/store";

defineOptions({ name: "Watermark" });

const { showWatermark = false } = defineProps({
  showWatermark: { type: Boolean },
});

const appStore = useAppStoreHook();
</script>

<template>
  <n-watermark
    v-if="showWatermark"
    :content="appStore.watermarkText"
    cross
    fullscreen
    :font-size="16"
    :line-height="16"
    :width="380"
    :height="320"
    :y-offset="150"
    :rotate="-15"
  />
</template>
