<script setup lang="ts">
import { useAppStoreHook } from "@/store";

import fullScreen from "~icons/icon-park-outline/full-screen-one";
import offScreen from "~icons/icon-park-outline/off-screen-one";

const appStore = useAppStoreHook();
</script>

<template>
  <n-tooltip placement="bottom" trigger="hover">
    <template #trigger>
      <CommonWrapper @click="appStore.contentFullScreen = !appStore.contentFullScreen">
        <component :is="appStore.contentFullScreen ? offScreen : fullScreen" />
      </CommonWrapper>
    </template>
    <span>
      {{ appStore.contentFullScreen ? "取消内容区全屏" : "内容区全屏" }}
    </span>
  </n-tooltip>
</template>
