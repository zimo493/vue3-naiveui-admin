<script setup lang="ts">
import { useAppStoreHook } from "@/store";

const t = useI18n().t;

const appStore = useAppStoreHook();
const icon = computed(() =>
  appStore.collapsed ? "icon-park-solid:menu-fold-one" : "icon-park-solid:menu-unfold-one"
);
</script>

<template>
  <div class="flex items-center justify-center">
    <n-tooltip placement="top" trigger="hover">
      <template #trigger>
        <CommonWrapper @click="appStore.toggleCollapse()">
          <Icones :icon="icon" :size="22" />
        </CommonWrapper>
      </template>
      <span>
        {{ appStore.collapsed ? t("system.tooltip.expandMenu") : t("system.tooltip.collapseMenu") }}
      </span>
    </n-tooltip>
  </div>
</template>
