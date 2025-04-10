<script setup lang="ts">
import { useAppStoreHook } from "@/store";
import { RouteRecordRaw } from "vue-router";
import { DropdownMixedOption } from "naive-ui/es/dropdown/src/interface";
import { isHttpUrl, renderIcon } from "@/utils";
import { defaultIcon } from "@/modules/assets";

const router = useRouter();
const route = useRoute();
const routes = computed(() => route.matched.filter((item) => item.name !== "Root"));

const appStore = useAppStoreHook();

const options = (item: RouteRecordRaw[]): DropdownMixedOption[] => transformTree(item);

/** 递归遍历路由 */
function transformTree(node: RouteRecordRaw[]): DropdownMixedOption[] {
  if (!node) return [];

  return node.map((item: RouteRecordRaw) => {
    return {
      key: item.path,
      label: item.meta?.title || "",
      icon: appStore.showBreadcrumbIcon
        ? item.meta?.icon
          ? renderIcon(item.meta.icon)
          : renderIcon(defaultIcon)
        : undefined,
      children: item.children && transformTree(item.children),
    };
  });
}

const handleSelect = (path: string) => {
  console.log(path, "path");

  if (path.includes("/:")) return;
  isHttpUrl(path) ? window.open(path, "_blank") : router.push(path);
};
</script>

<template>
  <div>
    <TransitionGroup
      v-if="appStore.showBreadcrumb"
      name="list"
      tag="ul"
      style="display: flex; gap: 1em"
    >
      <div v-for="(item, idx) in routes" :key="item.path">
        <n-dropdown :options="options(item.children)" :show-arrow="true" @select="handleSelect">
          <n-el tag="li" class="flex-center gap-2 cursor-pointer split">
            <nova-icon v-show="idx !== 0" icon="line-md:chevron-small-right" />
            <nova-icon v-if="appStore.showBreadcrumbIcon" :icon="item.meta.icon" />
            <span class="whitespace-nowrap">
              {{ item.meta.title }}
            </span>
          </n-el>
        </n-dropdown>
      </div>
    </TransitionGroup>
  </div>
</template>

<style lang="scss">
.split {
  color: var(--text-color-2);
  transition: 0.3s var(--cubic-bezier-ease-in-out);
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-active {
  position: absolute;
}
</style>
