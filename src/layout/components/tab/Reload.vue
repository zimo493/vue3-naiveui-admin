<script setup lang="ts">
import { useAppStoreHook } from "@/store";

const appStore = useAppStoreHook();

const loading = ref(false);

const handleReload = () => {
  loading.value = true;
  appStore.reloadPage().finally(() => (loading.value = false));
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
