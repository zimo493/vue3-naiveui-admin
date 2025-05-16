<script setup lang="ts">
import { useAppStoreHook } from "@/store";

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
      <span>{{ appStore.collapsed ? "展开菜单" : "收起菜单" }}</span>
    </n-tooltip>
  </div>
</template>
