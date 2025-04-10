<template>
  <n-menu
    ref="menuInstRef"
    accordion
    :collapsed="collapsed"
    :indent="20"
    :collapsed-width="appStore.sideCollapsedWidth"
    :options="routesStore.menus"
    :value="routesStore.activeMenu"
  />
</template>
<script setup lang="ts">
import { MenuInst } from "naive-ui";
import { useAppStoreHook, useRouteStoreHook } from "@/store";

const route = useRoute();
const appStore = useAppStoreHook();
const routesStore = useRouteStoreHook();

const menuInstRef = ref<MenuInst | null>(null);

watch(
  () => route.path,
  () => {
    menuInstRef.value?.showOption(routesStore.activeMenu);
  },
  { immediate: true }
);

// 如果布局为左侧菜单并且菜单栏收起时，切换到顶部菜单模式时需要将collapsed的值设置为false
const collapsed = computed(() => (appStore.layoutMode === "topMenu" ? false : appStore.collapsed));

const breakpoint = 988; // 设置一个断点，当视口宽度小于此值时收起侧边栏
const updateSidebar = () => (appStore.collapsed = window.innerWidth < breakpoint);

onMounted(() => {
  window.addEventListener("resize", updateSidebar);
  updateSidebar(); // 初始化时检查一次
});
onUnmounted(() => window.removeEventListener("resize", updateSidebar));
</script>
