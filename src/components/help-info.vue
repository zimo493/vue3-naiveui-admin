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
    <n-flex vertical :size="[2, 0]">
      <div v-for="msg in message.split('\n')" :key="msg">{{ msg }}</div>
    </n-flex>
  </n-tooltip>
</template>
