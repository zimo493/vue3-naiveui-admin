<script setup lang="ts">
import type { TabsInst } from "naive-ui";
import type { RouteLocationNormalized } from "vue-router";

import { useAppStoreHook, useTabStoreHook } from "@/store";

import IconRedo from "~icons/icon-park-outline/redo";
import IconClose from "~icons/icon-park-outline/close";
import IconDelete from "~icons/icon-park-outline/delete-four";
import IconLeft from "~icons/icon-park-outline/to-left";
import IconRight from "~icons/icon-park-outline/to-right";
import IconFullwith from "~icons/icon-park-outline/close-one";

import Reload from "./reload.vue";
import DropTabs from "./drop-tabs.vue";

import { defaultIcon } from "@/modules/assets";

const router = useRouter();
const { t } = useI18n();

const tabStore = useTabStoreHook();
const appStore = useAppStoreHook();

// 刷新指示条
watch([() => appStore.lang, () => appStore.showTabsIcon], () => nextTick(() => updateBar()));

const tabsInstRef = useTemplateRef<TabsInst>("tabs");
const handleClose = (path: string) => tabStore.closeTab(path).then(() => updateBar());

/** 手动更新指示条 */
const updateBar = () => tabsInstRef.value?.syncBarPosition();

const options = computed(() => [
  { label: t("tabBar.refresh"), key: "reload", icon: () => h(IconRedo) },
  { label: t("tabBar.close"), key: "closeCurrent", icon: () => h(IconClose) },
  { label: t("tabBar.closeOthers"), key: "closeOther", icon: () => h(IconDelete) },
  { label: t("tabBar.closeLeft"), key: "closeLeft", icon: () => h(IconLeft) },
  { label: t("tabBar.closeRight"), key: "closeRight", icon: () => h(IconRight) },
  { label: t("tabBar.closeAll"), key: "closeAll", icon: () => h(IconFullwith) },
]);
const showDropdown = ref(false);
const x = ref(0);
const y = ref(0);
const currentRoute = ref();

const handleSelect = (key: string) => {
  router.push(currentRoute.value.fullPath).then(() => updateBar()); // 点击后切换到当前操作的路由
  showDropdown.value = false;

  const handleFn: Record<string, () => void> = {
    reload: () => appStore.reloadPage(), // 刷新
    closeCurrent: () => handleClose(currentRoute.value.fullPath), // 关闭当前
    closeOther: () => tabStore.closeOtherTabs(currentRoute.value.fullPath), // 关闭其他
    closeLeft: () => tabStore.closeLeftTabs(currentRoute.value.fullPath), // 关闭左侧
    closeRight: () => tabStore.closeRightTabs(currentRoute.value.fullPath), // 关闭右侧
    closeAll: () => tabStore.closeAllTabs(), // 关闭所有
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
        :key="item.fullPath"
        class="h-40px"
        :name="item.fullPath"
        @click="router.push(item.fullPath)"
      >
        <div class="flex-x-center gap-2 items-center">
          <Icones v-if="appStore.showTabsIcon" :icon="item.meta.icon" />
          {{ t(`route.${String(item.name)}`, item.meta?.title ?? "") }}
        </div>
      </n-tab>
      <n-tab
        v-for="item in tabStore.tabs"
        :key="item.fullPath"
        :name="item.fullPath"
        closable
        @click="router.push(item.fullPath)"
        @contextmenu="handleContextMenu($event, item)"
      >
        <div class="flex-x-center gap-1 items-center">
          <Icones
            v-if="appStore.showTabsIcon"
            :icon="item.meta?.icon ? item.meta.icon : defaultIcon"
          />
          {{ t(`route.${String(item.name)}`, item.meta?.title ?? "") }}
          <Icones
            class="close"
            :size="14"
            icon="material-symbols:close"
            @click.stop="handleClose(item.fullPath)"
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
