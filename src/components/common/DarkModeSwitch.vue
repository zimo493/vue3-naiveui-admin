<script setup lang="ts">
import { NFlex } from "naive-ui";
import { useAppStore } from "@/store";
import IconSun from "~icons/icon-park-outline/sun-one";
import IconMoon from "~icons/icon-park-outline/moon";
import IconAuto from "~icons/icon-park-outline/laptop-computer";

type Option = { label: string; value: string; icon: Component };

const appStore = useAppStore();

const options = ref<Option[]>([
  { label: "跟随系统", value: "auto", icon: IconAuto },
  { label: "明亮", value: "light", icon: IconSun },
  { label: "暗黑", value: "dark", icon: IconMoon },
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
          <icon-park-outline-sun-one v-if="appStore.storeColorMode === 'light'" />
          <icon-park-outline-moon v-if="appStore.storeColorMode === 'dark'" />
          <icon-park-outline-laptop-computer v-if="appStore.storeColorMode === 'auto'" />
        </CommonWrapper>
      </template>
      <span>主题切换</span>
    </n-tooltip>
  </n-popselect>
</template>
