<template>
  <!-- side-placement="right" -->
  <n-layout has-sider class="wh-full" embedded>
    <n-layout-sider
      v-if="!appStore.contentFullScreen"
      bordered
      collapse-mode="width"
      :inverted="appStore.inverted"
      :collapsed="appStore.collapsed"
      :show-trigger="appStore.sideTrigger"
      :collapsed-width="appStore.sideCollapsedWidth"
      :width="appStore.sideWidth"
      content-style="display: flex;flex-direction: column;min-height:100%;"
      @collapse="appStore.toggleCollapse()"
      @expand="appStore.toggleCollapse()"
    >
      <Logo v-if="appStore.showLogo" />
      <n-scrollbar class="flex-1">
        <Menu />
      </n-scrollbar>
      <!-- <CollapseButton /> -->
    </n-layout-sider>
    <n-layout-content
      class="h-full flex flex-col"
      content-style="display: flex;flex-direction: column;min-height:100%;"
      embedded
      :native-scrollbar="false"
    >
      <n-layout-header :position="appStore.fixed ? 'absolute' : 'static'" class="z-10">
        <div v-if="!appStore.contentFullScreen" class="h-50px flex-y-center justify-between">
          <div class="flex-y-center h-full p-x-10px">
            <!-- <CollapseButton /> -->
            <Breadcrumb />
          </div>

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
  </n-layout>
</template>

<script lang="ts" setup>
import { useAppStoreHook } from "@/store";

const appStore = useAppStoreHook();
</script>
