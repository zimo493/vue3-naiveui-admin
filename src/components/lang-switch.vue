<script setup lang="ts">
import { useAppStore } from "@/store";

defineOptions({ name: "LangSwitch" });

const { t } = useI18n();

const appStore = useAppStore();
const options = [
  { label: "English", value: "enUS" },
  { label: "简体中文", value: "zhCN" },
  { label: "繁體中文", value: "zhTW" },
];
</script>

<template>
  <n-popselect
    :value="appStore.lang"
    :options="options"
    trigger="click"
    @update:value="appStore.setAppLang"
  >
    <n-tooltip placement="bottom" trigger="hover">
      <template #trigger>
        <CommonWrapper>
          <icon-park-outline-translate />
        </CommonWrapper>
      </template>
      <span>{{ t("system.tooltip.languageSwitch") }}</span>
    </n-tooltip>
  </n-popselect>
</template>
