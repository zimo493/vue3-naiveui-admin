<script setup lang="ts">
import { useAppStoreHook } from "@/store";

defineOptions({ name: "MainBody" });

const appStore = useAppStoreHook();
</script>

<template>
  <div v-if="appStore.fixed">
    <div class="h-50px" />
    <div v-if="appStore.showTabs && !appStore.contentFullScreen" class="h-40px" />
  </div>
  <div class="flex-1 p-10px flex flex-col" :class="{ 'p-t-0px': appStore.contentFullScreen }">
    <KeepCache />
  </div>
</template>
