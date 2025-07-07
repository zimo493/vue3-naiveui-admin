<script setup lang="ts">
const { message = "" } = defineProps({
  message: { type: String },
});
</script>

<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <icon-park-outline-help class="cursor-pointer" />
    </template>
    <div v-html="message" />
  </n-tooltip>
</template>
