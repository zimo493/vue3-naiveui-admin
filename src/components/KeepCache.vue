<template>
  <RouterView v-slot="{ Component }" class="flex-1">
    <Transition :name="appStore.transitionAnimation" mode="out-in">
      <KeepAlive :include="currentCacheRoutes">
        <component :is="Component" v-if="appStore.loadFlag" />
        <ContentLoading v-else />
      </KeepAlive>
    </Transition>
  </RouterView>
</template>
<script lang="ts" setup>
import { useAppStoreHook, useRouteStoreHook } from "@/store";

defineOptions({ name: "KeepCache" });

const appStore = useAppStoreHook();
const routeStore = useRouteStoreHook();
const route = useRoute();

// 当前缓存的路由列表
const currentCacheRoutes = ref<string[]>([]);

// 监听路由缓存变化
watch(
  () => routeStore.cacheRoutes,
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
      const currentRouteName = String(route.name);

      // 如果当前路由在缓存列表中，临时移除它以强制重新渲染
      if (currentRouteName && routeStore.cacheRoutes.includes(currentRouteName)) {
        // 临时从缓存中移除当前路由
        currentCacheRoutes.value = routeStore.cacheRoutes.filter(
          (name) => name !== currentRouteName
        );

        // 下一个tick后恢复缓存
        nextTick(() => {
          currentCacheRoutes.value = [...routeStore.cacheRoutes];
        });
      }
    }
  }
);
</script>
