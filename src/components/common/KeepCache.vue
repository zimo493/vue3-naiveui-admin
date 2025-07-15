<template>
  <RouterView v-slot="{ Component, route }">
    <KeepAlive :include="routeStore.cacheRoutes">
      <component :is="Component" :key="route.fullPath" />
    </KeepAlive>
  </RouterView>
</template>
<script lang="ts" setup>
import { useRouteStoreHook } from "@/store";

defineOptions({ name: "KeepCache" });

const routeStore = useRouteStoreHook();
</script>
