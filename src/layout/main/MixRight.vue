<template>
  <n-layout has-sider class="wh-full" embedded sider-placement="right">
    <n-layout-content
      class="h-full flex flex-col"
      content-style="display: flex;flex-direction: column;min-height:100%;"
      embedded
      :native-scrollbar="false"
    >
      <n-layout-header bordered :position="appStore.fixed ? 'absolute' : 'static'" class="z-999">
        <div v-if="!appStore.contentFullScreen" class="h-50px flex-y-center justify-between">
          <!-- <CollapseButton /> -->
          <n-menu
            ref="menuInstRef"
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
      <!-- <CollapseButton /> -->
    </n-layout-sider>
  </n-layout>
</template>
<script lang="ts" setup>
import type { MenuInst, MenuOption } from "naive-ui";
import { useAppStore, useRouteStore } from "@/store";
import { renderIcon, isHttpUrl } from "@/utils";
import { RouterLink } from "vue-router";

const routeStore = useRouteStore();
const appStore = useAppStore();
const pageRoute = useRoute();
const router = useRouter();

const menuInstRef = ref<MenuInst | null>(null);

watch(
  () => pageRoute.path,
  () => {
    menuInstRef.value?.showOption(routeStore.activeMenu as string);
  },
  { immediate: true }
);

const topMenu = ref<MenuOption[]>([]);
const activeTopMenu = ref<string>("");
const handleTopMenu = (rowMenu: MenuOption[]) => {
  topMenu.value = rowMenu.map(({ icon, label, key }) => ({
    icon,
    label,
    key,
  })) as MenuOption[];
};

onMounted(() => {
  handleTopMenu(routeStore.menus);

  // 根据当前页面获取选中菜单和对应侧边菜单
  const currentMenuKey = pageRoute.matched[1].path;

  handleSideMenu(currentMenuKey);
  activeTopMenu.value = currentMenuKey;
});

const sideMenu = ref<MenuOption[]>([]);
const handleSideMenu = (key: string) => {
  const routeMenu = routeStore.menus as MenuOption[];
  const targetMenu = routeMenu.find((i) => i.key === key);

  if (targetMenu?.children?.length) {
    // 类型实例化过于深入，可能是无限的 断言为 any 类型
    sideMenu.value = (targetMenu.children ?? []) as any;
  } else {
    sideMenu.value = [
      {
        key: "/",
        label: () => h(RouterLink, { to: "/" }, { default: () => "首页" }),
        icon: renderIcon("fluent-emoji-flat:house"),
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
