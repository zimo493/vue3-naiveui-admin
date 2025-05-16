<template>
  <n-el tag="div" class="el cursor-pointer rounded" :class="padding">
    <n-flex align="center" :wrap="false" class="h-full">
      <slot />
    </n-flex>
  </n-el>
</template>
<script lang="ts" setup>
defineOptions({
  name: "CommonWrapper",
  inheritAttrs: false,
});

defineProps({
  padding: {
    type: String,
    default: "p-2",
  },
});
</script>
<style scoped>
.el {
  color: var(--n-text-color);
  transition: 0.3s var(--cubic-bezier-ease-in-out);
}

.el:hover {
  color: var(--n-text-color-hover);
  background-color: var(--button-color-2-hover);
}
</style>
