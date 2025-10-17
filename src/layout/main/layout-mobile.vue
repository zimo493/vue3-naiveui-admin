<template>
  <n-layout class="mobile-layout wh-full" embedded>
    <n-layout-content
      class="h-full flex flex-col"
      content-style="display: flex;flex-direction: column;min-height:100%;"
      embedded
      :native-scrollbar="false"
    >
      <!-- 移动端头部 -->
      <MobileHeader @toggle-drawer="showDrawer = true" />

      <!-- 页面主体 -->
      <MainBody />

      <!-- 底部版权（移动端通常隐藏） -->
      <LayoutFooter v-if="appStore.showFooter" />

      <!-- 返回顶部 -->
      <BackTop />
    </n-layout-content>

    <!-- 移动端侧边抽屉菜单 -->
    <MobileDrawer v-model:show="showDrawer" />
  </n-layout>
</template>

<script setup lang="ts">
import { useAppStoreHook } from "@/store";
import MobileHeader from "../components/mobile/mobile-header.vue";
import MobileDrawer from "../components/mobile/mobile-drawer.vue";

const appStore = useAppStoreHook();
const showDrawer = ref(false);

// 监听路由变化，自动关闭抽屉
const route = useRoute();

watch(
  () => route.path,
  () => {
    showDrawer.value = false;
  }
);
</script>
