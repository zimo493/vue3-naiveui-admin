<template>
  <RouterView v-slot="{ Component, route }" class="flex-1">
    <Transition :name="appStore.transitionAnimation" mode="out-in">
      <KeepAlive :include="currentCacheRoutes">
        <component
          :is="currentComponent(Component, route)"
          v-if="appStore.loadFlag"
          :key="route.fullPath"
        />
        <ContentLoading v-else />
      </KeepAlive>
    </Transition>
  </RouterView>
</template>
<script lang="ts" setup>
import { useAppStoreHook, useTabStoreHook } from "@/store";
import { RouteLocationNormalized } from "vue-router";

import Error404 from "@/views/error/404";

defineOptions({ name: "KeepCache" });

const appStore = useAppStoreHook();
const tabsStore = useTabStoreHook();
const route = useRoute();

// 当前缓存的路由列表
const currentCacheRoutes = ref<string[]>([]);

// 当前组件
const wrapperMap = new Map<string, Component>();
const currentComponent = (component: Component, route: RouteLocationNormalized) => {
  if (!component) return;

  const { fullPath: componentName } = route; // 使用路由路径作为组件名称
  let wrapper = wrapperMap.get(componentName);

  if (!wrapper) {
    wrapper = {
      name: componentName,
      render: () => {
        try {
          return h(component);
        } catch (error) {
          console.error(`Error rendering component for route: ${componentName}`, error);

          return h(Error404);
        }
      },
    };
    wrapperMap.set(componentName, wrapper);
  }

  // 添加组件数量限制
  if (wrapperMap.size > 100) {
    const firstKey = wrapperMap.keys().next().value;

    if (firstKey) {
      wrapperMap.delete(firstKey);
    }
  }

  return h(wrapper);
};

// 监听路由缓存变化
watch(
  () => tabsStore.cacheRoutes,
  (newRoutes) => {
    currentCacheRoutes.value = [...newRoutes];
  },
  { immediate: true }
);

// 监听loadFlag变化，当页面刷新时处理缓存
watch(
  () => appStore.loadFlag,
  (newVal, oldVal) => {
    // 当loadFlag从false变为true时（页面刷新完成）
    if (!oldVal && newVal) {
      const currentRouteName = String(route.fullPath);

      // 如果当前路由在缓存列表中，临时移除它以强制重新渲染
      if (currentRouteName && tabsStore.cacheRoutes.includes(currentRouteName)) {
        // 临时从缓存中移除当前路由
        currentCacheRoutes.value = tabsStore.cacheRoutes.filter(
          (name) => name !== currentRouteName
        );

        // 下一个tick后恢复缓存
        nextTick(() => {
          currentCacheRoutes.value = [...tabsStore.cacheRoutes];
        });
      }
    }
  }
);
</script>
