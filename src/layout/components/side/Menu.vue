<template>
  <n-menu
    ref="menu"
    accordion
    :collapsed="collapsed"
    :indent="20"
    :inverted="appStore.inverted"
    :collapsed-width="appStore.sideCollapsedWidth"
    :options="routesStore.menus"
    :value="routesStore.activeMenu"
  />
</template>
<script setup lang="ts">
import type { MenuInst } from "naive-ui";

import { LayoutMode } from "@/enums";
import { useAppStoreHook, useRouteStoreHook } from "@/store";

const route = useRoute();
const appStore = useAppStoreHook();
const routesStore = useRouteStoreHook();

const menuInstRef = useTemplateRef<MenuInst>("menu");

watch(
  () => route.path,
  () => {
    menuInstRef.value?.showOption(routesStore.activeMenu);
  },
  { immediate: true }
);

// 如果布局为左侧菜单并且菜单栏收起时，切换到顶部菜单模式时需要将collapsed的值设置为false
const collapsed = computed(() =>
  appStore.layoutMode === LayoutMode.TOP ? false : appStore.collapsed
);

const breakpoint = 988; // 设置一个断点，当视口宽度小于此值时收起侧边栏
const updateSidebar = () => (appStore.collapsed = window.innerWidth < breakpoint);

onMounted(() => {
  window.addEventListener("resize", updateSidebar);
  updateSidebar(); // 初始化时检查一次
});
onUnmounted(() => window.removeEventListener("resize", updateSidebar));
</script>
