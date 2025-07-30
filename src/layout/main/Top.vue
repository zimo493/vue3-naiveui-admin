<template>
  <n-layout class="wh-full" embedded>
    <n-layout
      class="h-full flex flex-col"
      content-style="display: flex;flex-direction: column;min-height:100%;"
      embedded
      :native-scrollbar="false"
    >
      <n-layout-header :position="appStore.fixed ? 'absolute' : 'static'" class="z-10">
        <n-layout has-sider>
          <n-layout-sider
            v-if="!appStore.contentFullScreen"
            :inverted="appStore.inverted"
            width="100%"
            content-style="height:50px; display: flex; align-items: center;"
          >
            <Logo v-if="appStore.showLogo" />
            <Menu mode="horizontal" responsive />

            <!-- 右侧导航 -->
            <RightNavigation />
          </n-layout-sider>
        </n-layout>
        <TabBar v-if="appStore.showTabs" class="h-40px" />
      </n-layout-header>

      <!-- 页面主体 -->
      <MainBody />
      <!-- 底部版权 -->
      <LayoutFooter />
      <!-- 返回顶部 -->
      <BackTop />
    </n-layout>
  </n-layout>
</template>

<script lang="ts" setup>
import { useAppStoreHook } from "@/store";

const appStore = useAppStoreHook();
</script>
