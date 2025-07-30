<script setup lang="ts">
import { NFlex } from "naive-ui";
import { useAppStoreHook } from "@/store";
import { ThemeMode } from "@/enums";

import IconSun from "~icons/icon-park-outline/sun-one";
import IconMoon from "~icons/icon-park-outline/moon";
import IconAuto from "~icons/icon-park-outline/laptop-computer";

type Option = { label: string; value: string; icon: Component };

const { t } = useI18n();
const appStore = useAppStoreHook();

const options = computed<Option[]>(() => [
  { label: t("system.theme.mode.auto"), value: ThemeMode.AUTO, icon: IconAuto },
  { label: t("system.theme.mode.light"), value: ThemeMode.LIGHT, icon: IconSun },
  { label: t("system.theme.mode.dark"), value: ThemeMode.DARK, icon: IconMoon },
]);

const renderLabel = (option: Option) =>
  h(NFlex, { align: "center" }, { default: () => [h(option.icon), option.label] });
</script>

<template>
  <n-popselect
    :value="appStore.storeColorMode"
    :render-label="renderLabel"
    :options="options"
    trigger="click"
    @update:value="appStore.setColorMode"
  >
    <n-tooltip placement="bottom" trigger="hover">
      <template #trigger>
        <CommonWrapper>
          <icon-park-outline-sun-one v-if="appStore.storeColorMode === ThemeMode.LIGHT" />
          <icon-park-outline-moon v-if="appStore.storeColorMode === ThemeMode.DARK" />
          <icon-park-outline-laptop-computer v-if="appStore.storeColorMode === ThemeMode.AUTO" />
        </CommonWrapper>
      </template>
      <span>{{ t("system.tooltip.themeSwitch") }}</span>
    </n-tooltip>
  </n-popselect>
</template>
