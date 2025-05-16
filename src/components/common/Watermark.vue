<script setup lang="ts">
defineOptions({ name: "Watermark" });

defineProps({
  showWatermark: { type: Boolean, default: false },
  text: { type: String, default: "vue3-naiveui-admin" },
});
</script>

<template>
  <n-watermark
    v-if="showWatermark"
    :content="text"
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
