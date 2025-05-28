<script setup lang="ts">
import { useLoading } from "@/hooks";
import { useAppStoreHook } from "@/store";

const appStore = useAppStoreHook();

const { loading, startLoading, endLoading } = useLoading();

const handleReload = () => {
  startLoading();
  appStore.reloadPage().finally(() => endLoading());
};
</script>

<template>
  <n-tooltip placement="bottom" trigger="hover">
    <template #trigger>
      <CommonWrapper @click="handleReload">
        <icon-park-outline-refresh :class="{ 'animate-spin': loading }" />
      </CommonWrapper>
    </template>
    <span>刷新</span>
  </n-tooltip>
</template>
