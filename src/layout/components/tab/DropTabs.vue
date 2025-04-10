<script setup lang="ts">
import { useTabStoreHook } from "@/store";
import { renderIcon } from "@/utils";
import { defaultIcon } from "@/modules/assets";

const tabStore = useTabStoreHook();
const router = useRouter();

const renderDropTabsLabel = (option: any) => option.meta.title;

const renderDropTabsIcon = (option: any) =>
  option.meta?.icon ? renderIcon(option.meta?.icon)!() : renderIcon(defaultIcon)!();

const handleDropTabs = (key: string, option: any) => router.push(option.path);
</script>

<template>
  <n-dropdown
    :options="tabStore.allTabs"
    :render-label="renderDropTabsLabel"
    :render-icon="renderDropTabsIcon"
    trigger="click"
    size="small"
    @select="handleDropTabs"
  >
    <CommonWrapper>
      <icon-park-outline-application-menu />
    </CommonWrapper>
  </n-dropdown>
</template>
