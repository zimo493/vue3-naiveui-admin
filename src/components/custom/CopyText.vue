<template>
  <div v-if="modelValue" class="inline-flex items-center justify-center gap-0.5em">
    <n-ellipsis :style="{ maxWidth }">
      {{ modelValue }}
    </n-ellipsis>
    <n-tooltip trigger="hover">
      <template #trigger>
        <span v-copy="modelValue" cursor-pointer>
          <icon-park-outline-copy />
        </span>
      </template>
      复制
    </n-tooltip>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "CopyText",
  inheritAttrs: false,
});

const { maxWidth = "12em" } = defineProps({
  maxWidth: { type: Number },
});
const modelValue = defineModel<string>("value", { required: true });
</script>
