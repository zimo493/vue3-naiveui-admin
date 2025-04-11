<template>
  <n-layout class="wh-full" embedded>
    <n-layout
      class="h-full flex flex-col"
      content-style="display: flex;flex-direction: column;min-height:100%;"
      embedded
      :native-scrollbar="false"
    >
      <n-layout-header :position="appStore.fixed ? 'absolute' : 'static'" class="z-1">
        <div
          v-if="!appStore.contentFullScreen"
          class="h-50px flex-y-center justify-between shrink-0"
        >
          <Logo v-if="appStore.showLogo" />
          <Menu mode="horizontal" responsive />
          <div class="flex-y-center gap-1 h-full p-x-xl">
            <!-- <Search /> -->
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
        <RouterView v-slot="{ Component, route }" class="flex-1">
          <transition :name="appStore.transitionAnimation" mode="out-in">
            <KeepAlive :include="routeStore.cacheRoutes">
              <component :is="Component" v-if="appStore.loadFlag" :key="route.fullPath" />
              <ContentLoading v-else />
            </KeepAlive>
          </transition>
        </RouterView>
      </div>
      <div
        v-if="appStore.showFooter && appStore.fixed && !appStore.contentFullScreen"
        class="h-30px"
      />
      <n-layout-footer
        v-if="appStore.showFooter && !appStore.contentFullScreen"
        :position="appStore.fixed ? 'absolute' : 'static'"
        class="h-30px flex-center"
      >
        <span class="copyright">{{ appStore.footerText }}</span>
      </n-layout-footer>
      <BackTop />
    </n-layout>
  </n-layout>
</template>

<script lang="ts" setup>
import { useAppStoreHook, useRouteStoreHook } from "@/store";
import UserCenter from "@/layout/components/header/UserCenter";

const appStore = useAppStoreHook();
const routeStore = useRouteStoreHook();
</script>
