<script setup lang="ts">
import { useAppStoreHook } from "@/store";

defineOptions({ name: "LayoutFooter" });

const appStore = useAppStoreHook();
</script>

<template>
  <!-- 底部占位 -->
  <div v-if="appStore.showFooter && appStore.fixed && !appStore.contentFullScreen" class="h-30px" />

  <n-layout-footer
    v-if="appStore.showFooter && !appStore.contentFullScreen"
    :position="appStore.fixed ? 'absolute' : 'static'"
    class="h-30px flex-center"
  >
    <span class="copyright">{{ appStore.footerText }}</span>
  </n-layout-footer>
</template>
