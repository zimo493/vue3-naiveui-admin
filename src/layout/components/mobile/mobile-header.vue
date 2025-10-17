<template>
  <n-layout-header
    :position="appStore.fixed ? 'absolute' : 'static'"
    class="mobile-header z-999"
    bordered
  >
    <div
      v-if="!appStore.contentFullScreen"
      class="h-50px flex items-center justify-between px-10px"
    >
      <!-- 左侧：菜单按钮 + Logo -->
      <SvgIconsLogo v-if="appStore.showLogo" class="text-1.6em" @click="router.push('/')" />

      <div flex p-1>
        <n-button quaternary circle @click="$emit('toggle-drawer')">
          <template #icon>
            <icon-park-outline-system />
          </template>
        </n-button>
      </div>

      <!-- 中间：页面标题或面包屑 -->
      <div class="flex-1 flex justify-start">
        <div v-if="appStore.showBreadcrumb">
          <Breadcrumb />
        </div>
        <div v-else>
          {{ currentPageTitle }}
        </div>
      </div>

      <!-- 右侧：用户操作 -->
      <div class="flex items-center gap-1">
        <n-button quaternary circle @click="showSearch = true">
          <template #icon>
            <icon-park-outline-more />
          </template>
        </n-button>

        <!-- 用户中心 -->
        <UserCenter />
      </div>
    </div>

    <!-- 标签页 -->
    <div v-if="appStore.showTabs">
      <TabBar class="h-40px mobile-tabs" />
    </div>

    <!-- 搜索抽屉 -->
    <n-drawer v-model:show="showSearch" width="80%" placement="top" height="80">
      <n-drawer-content :native-scrollbar="false">
        <div class="flex-center gap-1 h-full p-x-10px">
          <MenuSearch @close="showSearch = false" />
          <DarkModeSwitch />
          <LangSwitch />
          <Notices />
          <SystemSetting />
        </div>
      </n-drawer-content>
    </n-drawer>
  </n-layout-header>
</template>

<script setup lang="ts">
import { useAppStoreHook } from "@/store";
import UserCenter from "../header/user-center";

interface Emits {
  (e: "toggle-drawer"): void;
}

defineEmits<Emits>();

const appStore = useAppStoreHook();
const route = useRoute();
const router = useRouter();

const showSearch = ref(false);

// 当前页面标题
const currentPageTitle = computed(() => route.meta?.title || "页面");
</script>
