<script setup lang="ts">
import { LayoutMode } from "@/enums";

const { t } = useI18n();

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
      <span>{{ t("system.layout.left") }}</span>
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
      <span>{{ t("system.layout.top") }}</span>
    </n-tooltip>

    <n-tooltip trigger="hover">
      <template #trigger>
        <n-el
          :class="{ 'outline outline-2': value === LayoutMode.MIX_LEFT }"
          class="grid grid-cols-[20%_1fr] grid-rows-[20%_1fr] outline-[var(--primary-color)] hover:(outline outline-2) cursor-pointer"
          @click="value = LayoutMode.MIX_LEFT"
        >
          <div class="bg-[var(--primary-color)] row-span-2" />
          <div class="bg-[var(--primary-color)]" />
          <div class="bg-[var(--divider-color)]" />
        </n-el>
      </template>
      <span>{{ t("system.layout.mixLeft") }}</span>
    </n-tooltip>

    <n-tooltip trigger="hover">
      <template #trigger>
        <n-el
          :class="{ 'outline outline-2': value === LayoutMode.RIGHT }"
          class="grid grid-cols-[1fr_20%] outline-[var(--primary-color)] hover:(outline outline-2)"
          @click="value = LayoutMode.RIGHT"
        >
          <div class="bg-[var(--divider-color)]" />
          <div class="bg-[var(--primary-color)]" />
        </n-el>
      </template>
      <span>{{ t("system.layout.right") }}</span>
    </n-tooltip>

    <n-tooltip trigger="hover">
      <template #trigger>
        <n-el
          :class="{ 'outline outline-2': value === LayoutMode.MIX_RIGHT }"
          class="grid grid-cols-[1fr_20%] grid-rows-[20%_1fr] outline-[var(--primary-color)] hover:(outline outline-2) cursor-pointer"
          @click="value = LayoutMode.MIX_RIGHT"
        >
          <div class="bg-[var(--primary-color)]" />
          <div class="bg-[var(--primary-color)] row-span-2" />
          <div class="bg-[var(--divider-color)]" />
        </n-el>
      </template>
      <span>{{ t("system.layout.mixRight") }}</span>
    </n-tooltip>
  </div>
</template>

<style lang="scss" scoped>
.grid {
  gap: 0.4em;
  width: 86px;
  height: 60px;
  padding: 0.4em;
  border-radius: 4px;
  box-shadow: var(--box-shadow-1);
}

.grid > div {
  border-radius: 2px;
}
</style>
