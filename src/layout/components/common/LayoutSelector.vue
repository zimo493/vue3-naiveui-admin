<script setup lang="ts">
import { LayoutMode } from "@/enums";

const value = defineModel<LayoutMode>("value", { required: true });
</script>

<template>
  <div flex-center gap-4 flex-wrap>
    <n-tooltip trigger="hover">
      <template #trigger>
        <n-el
          :class="{ 'outline outline-2': value === LayoutMode.LEFT }"
          class="grid grid-cols-[20%_1fr] outline-[var(--primary-color)] hover:(outline outline-2)"
          @click="value = LayoutMode.LEFT"
        >
          <div class="bg-[var(--primary-color)]" />
          <div class="bg-[var(--divider-color)]" />
        </n-el>
      </template>
      <span>左侧菜单</span>
    </n-tooltip>

    <n-tooltip trigger="hover">
      <template #trigger>
        <n-el
          :class="{ 'outline outline-2': value === LayoutMode.TOP }"
          class="grid grid-rows-[25%_1fr] outline-[var(--primary-color)] hover:(outline outline-2)"
          @click="value = LayoutMode.TOP"
        >
          <div class="bg-[var(--primary-color)]" />
          <div class="bg-[var(--divider-color)]" />
        </n-el>
      </template>
      <span>顶部菜单</span>
    </n-tooltip>

    <n-tooltip trigger="hover">
      <template #trigger>
        <n-el
          :class="{ 'outline outline-2': value === LayoutMode.MIX }"
          class="grid grid-cols-[20%_1fr] grid-rows-[20%_1fr] outline-[var(--primary-color)] hover:(outline outline-2) cursor-pointer"
          @click="value = LayoutMode.MIX"
        >
          <div class="bg-[var(--primary-color)] row-span-2" />
          <div class="bg-[var(--primary-color)]" />
          <div class="bg-[var(--divider-color)]" />
        </n-el>
      </template>
      <span>混合菜单</span>
    </n-tooltip>
  </div>
</template>

<style lang="scss" scoped>
.grid {
  gap: 0.4em;
  width: 86px;
  height: 60px;
  padding: 0.4em;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow-1);
}

.grid > div {
  border-radius: var(--border-radius);
}
</style>
