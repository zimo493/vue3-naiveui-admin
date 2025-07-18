<script setup lang="ts">
import type { RouteRecordRaw } from "vue-router";

import { useAppStoreHook } from "@/store";
import { isHttpUrl, renderIcon } from "@/utils";

import { defaultIcon } from "@/modules/assets";

type Options = import("naive-ui").DropdownOption;

const router = useRouter();
const route = useRoute();
const routes = computed(() => route.matched.filter((item) => item.name !== "Root"));

const appStore = useAppStoreHook();

const options = (item: RouteRecordRaw[]) => transformTree(item);

/** 递归遍历路由 */
const transformTree = (node: RouteRecordRaw[]): Options[] => {
  if (!node) return [];

  // 过滤掉隐藏的路由
  const menu = node.filter((item) => !item.meta?.hidden);

  return menu.map((item: RouteRecordRaw) => ({
    key: item.path,
    icon: appStore.showBreadcrumbIcon
      ? item.meta?.icon
        ? renderIcon(item.meta.icon)
        : renderIcon(defaultIcon)
      : undefined,
    label: item.meta?.title || "",
    children: item.children && transformTree(item.children),
  }));
};

const handleSelect = (path: string) => {
  console.log(path, "path");

  if (path.includes("/:")) return;
  isHttpUrl(path) ? window.open(path, "_blank") : router.push(path);
};
</script>

<template>
  <div v-if="appStore.showBreadcrumb">
    <n-breadcrumb>
      <TransitionGroup flex items-center name="breadcrumb" tag="div">
        <n-breadcrumb-item
          v-for="item in routes"
          :key="item.path"
          transition="all duration-0.3s ease"
        >
          <n-dropdown
            :inverted="appStore.inverted"
            :options="options(item.children)"
            :show-arrow="true"
            placement="bottom-start"
            @select="handleSelect"
          >
            <n-flex align="center" justify="center" :size="[4, 0]">
              <Icones
                v-if="appStore.showBreadcrumbIcon"
                :icon="item.meta?.icon ? item.meta.icon : defaultIcon"
              />
              <div class="whitespace-nowrap lh-[1]">
                {{ item.meta.title }}
              </div>
            </n-flex>
          </n-dropdown>
        </n-breadcrumb-item>
      </TransitionGroup>
    </n-breadcrumb>
  </div>
</template>
<style lang="scss" scoped>
/* 面包屑动画 */
.breadcrumb-move,
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all 0.3s ease;
}

.breadcrumb-enter-from,
.breadcrumb-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.breadcrumb-leave-active {
  position: absolute;
}
</style>
