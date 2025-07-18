<script setup lang="ts">
import type { TabsInst } from "naive-ui";
import type { RouteLocationNormalized } from "vue-router";

import { useAppStoreHook, useRouteStoreHook, useTabStoreHook } from "@/store";

import IconRedo from "~icons/icon-park-outline/redo";
import IconClose from "~icons/icon-park-outline/close";
import IconDelete from "~icons/icon-park-outline/delete-four";
import IconLeft from "~icons/icon-park-outline/to-left";
import IconRight from "~icons/icon-park-outline/to-right";
import IconFullwith from "~icons/icon-park-outline/close-one";

import Reload from "./Reload.vue";
import DropTabs from "./DropTabs.vue";

import { defaultIcon } from "@/modules/assets";

const tabStore = useTabStoreHook();
const routeStore = useRouteStoreHook();
const appStore = useAppStoreHook();

const router = useRouter();

// 动态页签
const dynamicTab = ref<RouteLocationNormalized[]>([]);

watchEffect(() => {
  dynamicTab.value = tabStore.tabs;
  const names = dynamicTab.value.map((item) => item.name as string).filter(Boolean);

  routeStore.setCacheRoutes(names);
});

const handleTab = (route: RouteLocationNormalized) => {
  router.push({
    path: route.path,
    query: route.query,
  });
};

const tabsInstRef = useTemplateRef<TabsInst>("tabs");
const handleClose = (path: string) => tabStore.closeTab(path).then(() => updateBar());

/** 删除之后手动更新一下指示条 */
const updateBar = () => tabsInstRef.value?.syncBarPosition();

const options = computed(() => {
  return [
    { label: "刷新", key: "reload", icon: () => h(IconRedo) },
    { label: "关闭", key: "closeCurrent", icon: () => h(IconClose) },
    { label: "关闭其他", key: "closeOther", icon: () => h(IconDelete) },
    { label: "关闭左侧", key: "closeLeft", icon: () => h(IconLeft) },
    { label: "关闭右侧", key: "closeRight", icon: () => h(IconRight) },
    { label: "关闭所有", key: "closeAll", icon: () => h(IconFullwith) },
  ];
});
const showDropdown = ref(false);
const x = ref(0);
const y = ref(0);
const currentRoute = ref();

const handleSelect = (key: string) => {
  router.push(currentRoute.value.fullPath).then(() => updateBar()); // 点击后切换到当前操作的路由
  showDropdown.value = false;

  const handleFn: Record<string, () => void> = {
    reload() {
      appStore.reloadPage();
    },
    closeCurrent() {
      handleClose(currentRoute.value.path);
    },
    closeOther() {
      tabStore.closeOtherTabs(currentRoute.value.path);
    },
    closeLeft() {
      tabStore.closeLeftTabs(currentRoute.value.path);
    },
    closeRight() {
      tabStore.closeRightTabs(currentRoute.value.path);
    },
    closeAll() {
      tabStore.closeAllTabs();
    },
  };

  handleFn[key]();
};

const handleContextMenu = (e: MouseEvent, route: RouteLocationNormalized) => {
  e.preventDefault();
  currentRoute.value = route;
  showDropdown.value = false;
  nextTick().then(() => {
    showDropdown.value = true;
    x.value = e.clientX;
    y.value = e.clientY;
  });
};

const onClickOutSide = () => (showDropdown.value = false);
</script>

<template>
  <div class="wh-full flex items-end tabs">
    <n-tabs
      ref="tabs"
      size="small"
      :tabs-padding="10"
      :value="tabStore.currentTabPath"
      @close="handleClose"
    >
      <n-tab
        v-for="item in tabStore.pinTabs"
        :key="item.path"
        class="h-40px"
        :name="item.path"
        @click="router.push(item.path)"
      >
        <div class="flex-x-center gap-2 items-center">
          <Icones :icon="item.meta.icon" />
          {{ item.meta.title }}
        </div>
      </n-tab>
      <n-tab
        v-for="item in dynamicTab"
        :key="item.path"
        closable
        :name="item.path"
        @click="handleTab(item)"
        @contextmenu="handleContextMenu($event, item)"
      >
        <div class="flex-x-center gap-1 items-center">
          <Icones :icon="item.meta?.icon ? item.meta.icon : defaultIcon" />
          {{ item.meta.title }}
          <Icones
            class="close"
            :size="14"
            icon="material-symbols:close"
            @click.stop="handleClose(item.path)"
          />
        </div>
      </n-tab>
      <template #suffix>
        <div flex-center pr-10px>
          <Reload />
          <ContentFullScreen />
          <DropTabs />
        </div>
      </template>
    </n-tabs>
    <n-dropdown
      placement="bottom-start"
      trigger="manual"
      :inverted="appStore.inverted"
      :x="x"
      :y="y"
      :options="options"
      :show="showDropdown"
      :on-clickoutside="onClickOutSide"
      @select="handleSelect"
    />
  </div>
</template>

<style scoped lang="scss">
.close {
  color: var(--n-close-icon-color);
  border-radius: var(--n-close-border-radius);
  transition:
    background-color 0.3s var(--n-bezier),
    color 0.3s var(--n-bezier);

  &:hover {
    background-color: var(--n-close-color-hover);
  }
}
</style>
