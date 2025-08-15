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
    <n-flex vertical>
      <n-text v-for="msg in message.split('\n')">{{ msg }}</n-text>
    </n-flex>
  </n-tooltip>
</template>
