<template>
  <n-layout has-sider class="wh-full" embedded sider-placement="right">
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
            <Search />
            <FullScreen />
            <DarkModeSwitch />
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
        <router-view v-slot="{ Component, route }" class="flex-1">
          <transition :name="appStore.transitionAnimation" mode="out-in">
            <keep-alive :include="routeStore.cacheRoutes">
              <component :is="Component" v-if="appStore.loadFlag" :key="route.fullPath" />
              <ContentLoading v-else />
            </keep-alive>
          </transition>
        </router-view>
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
  </n-layout>
</template>

<script lang="ts" setup>
import { useAppStore, useRouteStore } from "@/store";
import UserCenter from "@/layout/components/header/UserCenter";

const routeStore = useRouteStore();
const appStore = useAppStore();
</script>
