<template>
  <n-dropdown
    trigger="click"
    :options="options"
    :show-arrow="true"
    :inverted="appStore.inverted"
    @select="(key) => router.push(key)"
  >
    <CommonWrapper>
      <icon-park-outline-application-menu />
    </CommonWrapper>
  </n-dropdown>
</template>

<script setup lang="ts">
import { renderIcon } from "@/utils";
import { useAppStoreHook, useTabStoreHook } from "@/store";

import { defaultIcon } from "@/modules/assets";

const { t } = useI18n();
const router = useRouter();
const tabStore = useTabStoreHook();
const appStore = useAppStoreHook();

const options = computed(() =>
  tabStore.allTabs?.map((item) => ({
    key: item.fullPath,
    label: t(`route.${String(item.name)}`, item.meta?.title ?? ""),
    icon: item.meta?.icon ? renderIcon(item.meta.icon) : renderIcon(defaultIcon),
  }))
);
</script>
