<template>
  <n-layout has-sider class="wh-full" embedded>
    <n-layout-sider
      v-if="!appStore.contentFullScreen"
      bordered
      collapse-mode="width"
      :inverted="appStore.inverted"
      :show-trigger="appStore.sideTrigger"
      :collapsed="appStore.collapsed"
      :collapsed-width="appStore.sideCollapsedWidth"
      :width="appStore.sideWidth"
      content-style="display: flex;flex-direction: column;min-height:100%;"
      @collapse="appStore.toggleCollapse()"
      @expand="appStore.toggleCollapse()"
    >
      <Logo v-if="appStore.showLogo" />
      <n-scrollbar class="flex-1">
        <n-menu
          ref="menu"
          :inverted="appStore.inverted"
          :collapsed="appStore.collapsed"
          :indent="20"
          :collapsed-width="appStore.sideCollapsedWidth"
          :options="sideMenu"
          :value="routeStore.activeMenu"
        />
      </n-scrollbar>
      <!-- <CollButton /> -->
    </n-layout-sider>
    <n-layout-content
      class="h-full flex flex-col"
      content-style="display: flex;flex-direction: column;min-height:100%;"
      embedded
      :native-scrollbar="false"
    >
      <n-layout-header bordered :position="appStore.fixed ? 'absolute' : 'static'" class="z-999">
        <div v-if="!appStore.contentFullScreen" class="h-50px flex-y-center justify-between">
          <!-- <CollButton /> -->
          <n-menu
            ref="menu"
            mode="horizontal"
            responsive
            :options="topMenu"
            :value="activeTopMenu"
            @update:value="updateTopMenu"
          />

          <!-- 右侧导航 -->
          <RightNavigation />
        </div>
        <TabBar v-if="appStore.showTabs" class="h-40px" />
      </n-layout-header>

      <!-- 页面主体 -->
      <MainBody />
      <!-- 底部版权 -->
      <LayoutFooter />
      <!-- 返回顶部 -->
      <BackTop />
    </n-layout-content>
  </n-layout>
</template>
<script lang="ts" setup>
import type { MenuInst, MenuOption } from "naive-ui";

import { useAppStoreHook, useRouteStoreHook } from "@/store";
import { $t, isHttpUrl, renderIcon } from "@/utils";

import { RouterLink } from "vue-router";
import { homeIcon } from "@/modules/assets";

const routeStore = useRouteStoreHook();
const appStore = useAppStoreHook();
const pageRoute = useRoute();
const router = useRouter();

const menuInstRef = useTemplateRef<MenuInst>("menu");

watch(
  () => pageRoute.path,
  () => {
    menuInstRef.value?.showOption(routeStore.activeMenu as string);
  },
  { immediate: true }
);

const topMenu = ref<MenuOption[]>([]);
const activeTopMenu = ref<string>("");
const handleTopMenu = (menu: MenuOption[]) => {
  topMenu.value = menu.map((item) => ({
    icon: item.icon,
    label: item.label,
    key: item.key,
  }));
};

onMounted(() => {
  handleTopMenu(routeStore.menus);

  // 当前顶级菜单 key：匹配链中第一个能对应顶级菜单的路径
  const menuKeys = new Set<string>(
    (routeStore.menus as MenuOption[]).map((item) => String(item.key))
  );
  const currentMenuKey =
    pageRoute.matched.map((item) => item.path).find((path) => path && menuKeys.has(path)) ?? "";

  handleSideMenu(currentMenuKey);
  activeTopMenu.value = currentMenuKey;
});

const sideMenu = ref<MenuOption[]>([]);
const handleSideMenu = (key: string) => {
  const routeMenu = routeStore.menus;

  const targetMenu = routeMenu.find((i): i is MenuOption => i.key === key) as
    | MenuOption
    | undefined;

  if (targetMenu?.children?.length) {
    sideMenu.value = targetMenu.children ?? [];
  } else {
    sideMenu.value = [
      {
        key: "/home",
        label: () => h(RouterLink, { to: "/" }, { default: () => $t("route.Home") }),
        icon: renderIcon(homeIcon),
      },
    ];
  }
};

const updateTopMenu = (key: string) => {
  if (isHttpUrl(key)) return;
  handleSideMenu(key);
  activeTopMenu.value = key;
  router.push(key);
};
</script>
