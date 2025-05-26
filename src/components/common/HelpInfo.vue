<script setup lang="ts">
const { message = "" } = defineProps({
  message: { type: String },
});
</script>

<template>
  <n-tooltip :show-arrow="false" trigger="hover">
    <template #trigger>
      <icon-park-outline-help />
    </template>
    <div v-html="message" />
  </n-tooltip>
</template>
