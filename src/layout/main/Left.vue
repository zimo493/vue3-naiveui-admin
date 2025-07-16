<template>
  <!-- side-placement="right" -->
  <n-layout has-sider class="wh-full" embedded>
    <n-layout-sider
      v-if="!appStore.contentFullScreen"
      bordered
      :collapsed="appStore.collapsed"
      collapse-mode="width"
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
      <n-layout-header :position="appStore.fixed ? 'absolute' : 'static'" class="z-1">
        <div v-if="!appStore.contentFullScreen" class="h-50px flex-y-center justify-between">
          <div class="flex-y-center h-full p-x-10px">
            <!-- <CollapseButton /> -->
            <Breadcrumb />
          </div>
          <div class="flex-y-center gap-1 h-full p-x-10px">
            <!-- <LastLoginTime /> -->
            <Search />
            <!-- <Notices /> -->
            <FullScreen />
            <DarkModeSwitch />
            <!-- <LangsSwitch /> -->
            <Setting />
            <UserCenter />
          </div>
        </div>
        <TabBar v-if="appStore.showTabs" class="h-40px" />
      </n-layout-header>
      <div v-if="appStore.fixed">
        <div class="h-50px" />
        <div v-if="appStore.showTabs && !appStore.contentFullScreen" class="h-40px" />
      </div>
      <div class="flex-1 p-10px flex flex-col" :class="{ 'p-t-0px': appStore.contentFullScreen }">
        <KeepCache />
      </div>
      <div
        v-if="appStore.showFooter && appStore.fixed && !appStore.contentFullScreen"
        class="h-30px"
      />

      <BackTop />
      <n-layout-footer
        v-if="appStore.showFooter && !appStore.contentFullScreen"
        :position="appStore.fixed ? 'absolute' : 'static'"
        class="h-30px flex-center"
      >
        <span class="copyright">{{ appStore.footerText }}</span>
      </n-layout-footer>
    </n-layout-content>
  </n-layout>
</template>

<script lang="ts" setup>
import { useAppStoreHook } from "@/store";

import UserCenter from "@/layout/components/header/UserCenter";

const appStore = useAppStoreHook();
</script>
