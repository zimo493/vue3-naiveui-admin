<template>
  <div>
    <n-tooltip placement="bottom" trigger="hover">
      <template #trigger>
        <CommonWrapper @click="openSetting">
          <icon-park-outline-setting-two />
        </CommonWrapper>
      </template>
      <span>{{ t("system.tooltip.settings") }}</span>
    </n-tooltip>

    <!-- 设置面板 -->
    <n-drawer v-model:show="drawerActive" :width="380">
      <n-drawer-content :title="t('system.tooltip.settings')" closable>
        <n-flex vertical>
          <!-- <n-divider>布局设置</n-divider> -->
          <LayoutSelector v-model:value="appStore.layoutMode" />

          <n-divider>{{ t("system.theme.mode.mode") }}</n-divider>
          <n-flex vertical :size="16">
            <n-flex align="center" justify="center">
              <n-tabs
                v-model:value="colorMode"
                type="segment"
                animated
                @update:value="appStore.setColorMode"
              >
                <n-tab :name="ThemeMode.LIGHT">
                  <icon-park-outline-sun-one />
                </n-tab>
                <n-tab :name="ThemeMode.DARK">
                  <icon-park-outline-moon />
                </n-tab>
                <n-tab :name="ThemeMode.AUTO">
                  <icon-park-outline-laptop-computer />
                </n-tab>
              </n-tabs>
            </n-flex>
            <n-flex justify="space-between">
              <n-flex align="center" justify="center" :size="[4, 0]">
                {{ t("system.theme.mode.reverseStyle") }}
                <HelpInfo :message="t('system.theme.mode.reverseStyleTip')" />
              </n-flex>
              <n-switch v-model:value="appStore.inverted" />
            </n-flex>
            <n-flex justify="space-between">
              {{ t("system.theme.mode.colorWeakness") }}
              <n-switch :value="appStore.colorWeak" @update:value="appStore.toggleColorWeak" />
            </n-flex>
            <n-flex justify="space-between">
              {{ t("system.theme.mode.grey") }}
              <n-switch :value="appStore.grayMode" @update:value="appStore.toggleGrayMode" />
            </n-flex>
          </n-flex>

          <n-divider>
            <span mr-10px>{{ t("system.theme.color.color") }}</span>
            <n-tooltip trigger="hover" placement="left">
              <template #trigger>
                <n-button
                  v-copy="{ text: themeConfig, msg: t('system.theme.color.colorTip') }"
                  type="primary"
                  size="small"
                  quaternary
                >
                  {{ t("common.btn.copy") }}
                </n-button>
              </template>
              <span>
                {{ t("system.theme.color.copyAndPaste") }}
                <n-tag type="info" :bordered="false">src/utils/theme.ts</n-tag>
                {{ t("system.theme.color.content") }}
              </span>
            </n-tooltip>
          </n-divider>
          <n-flex align="center" justify="space-between">
            {{ t("system.theme.color.primary") }}
            <n-color-picker
              v-model:value="appStore.primaryColor"
              w-100px
              :show-alpha="false"
              :swatches="palette"
              @update:value="appStore.setPrimaryColor"
            />
          </n-flex>
          <n-flex align="center" justify="space-between">
            <n-flex>
              {{ t("system.theme.color.info") }}
              <n-checkbox
                v-model:checked="appStore.followPrimary"
                @update:checked="appStore.handleFollowPrimary"
              >
                {{ t("system.theme.color.followPrimary") }}
              </n-checkbox>
            </n-flex>
            <n-color-picker
              v-model:value="appStore.infoColor"
              w-100px
              :show-alpha="false"
              :swatches="palette"
              @update:value="appStore.setInfoColor"
            />
          </n-flex>
          <n-flex align="center" justify="space-between">
            {{ t("system.theme.color.success") }}
            <n-color-picker
              v-model:value="appStore.successColor"
              w-100px
              :show-alpha="false"
              :swatches="palette"
              @update:value="appStore.setSuccessColor"
            />
          </n-flex>
          <n-flex align="center" justify="space-between">
            {{ t("system.theme.color.warning") }}
            <n-color-picker
              v-model:value="appStore.warningColor"
              w-100px
              :show-alpha="false"
              :swatches="palette"
              @update:value="appStore.setWarningColor"
            />
          </n-flex>
          <n-flex align="center" justify="space-between">
            {{ t("system.theme.color.error") }}
            <n-color-picker
              v-model:value="appStore.errorColor"
              w-100px
              :show-alpha="false"
              :swatches="palette"
              @update:value="appStore.setErrorColor"
            />
          </n-flex>

          <n-divider>{{ t("system.interface.function") }}</n-divider>
          <n-flex align="center" justify="space-between">
            {{ t("system.interface.borderRadius") }}
            <n-select
              v-model:value="appStore.borderRadius"
              class="w-10em"
              :consistent-menu-width="false"
              :options="borderRadiusOptions"
              :render-label="renderLabel"
              :render-tag="renderTag"
              @update:value="appStore.setBorderRadius"
            />
          </n-flex>
          <n-flex align="center" justify="space-between">
            {{ t("system.interface.pageTransition") }}
            <n-select
              v-model:value="appStore.transitionAnimation"
              class="w-10em"
              :options="transitionSelectorOptions"
              @update:value="appStore.reloadPage"
            />
          </n-flex>
          <template v-if="setSideBar">
            <n-flex align="center" justify="space-between">
              {{ t("system.interface.sidebarWidth") }}
              <n-input-number v-model:value="appStore.sideWidth" class="w-10em" :min="180" />
            </n-flex>
            <n-flex align="center" justify="space-between">
              {{ t("system.interface.sidebarCollapseWidth") }}
              <n-input-number
                v-model:value="appStore.sideCollapsedWidth"
                class="w-10em"
                :min="50"
              />
            </n-flex>
            <n-flex align="center" justify="space-between">
              {{ t("system.interface.sidebarTriggerStyle") }}
              <n-select
                v-model:value="appStore.sideTrigger"
                class="w-10em"
                :options="sideBarShowTrigger"
              />
            </n-flex>
          </template>
          <n-flex align="center" justify="space-between">
            {{ t("system.interface.msgPlacement") }}
            <n-select
              v-model:value="appStore.placement"
              class="w-10em"
              :options="messagePositions"
              @update:value="appStore.setPlacement"
            />
          </n-flex>

          <n-flex justify="space-between">
            {{ t("system.interface.logo") }}
            <n-switch v-model:value="appStore.showLogo" />
          </n-flex>
          <n-flex justify="space-between">
            {{ t("system.interface.topProgress") }}
            <n-switch v-model:value="appStore.showProgress" />
          </n-flex>
          <n-flex justify="space-between">
            {{ t("system.interface.breadcrumb") }}
            <n-switch v-model:value="appStore.showBreadcrumb" />
          </n-flex>
          <n-flex justify="space-between">
            {{ t("system.interface.breadcrumbIcon") }}
            <n-switch v-model:value="appStore.showBreadcrumbIcon" />
          </n-flex>
          <n-flex justify="space-between">
            {{ t("system.interface.tabs") }}
            <n-switch v-model:value="appStore.showTabs" />
          </n-flex>
          <n-flex justify="space-between">
            {{ t("system.interface.tabsIcon") }}
            <n-switch v-model:value="appStore.showTabsIcon" />
          </n-flex>
          <n-flex justify="space-between">
            {{ t("system.interface.fixedTopAndBottom") }}
            <n-switch v-model:value="appStore.fixed" />
          </n-flex>
          <n-flex justify="space-between">
            {{ t("system.interface.copyright") }}
            <n-switch v-model:value="appStore.showFooter" />
          </n-flex>
          <n-flex justify="space-between" align="center">
            <n-flex align="center">
              <n-text>{{ t("system.interface.watermark") }}</n-text>
              <div>
                <n-input
                  v-model:value="appStore.watermarkText"
                  type="text"
                  :placeholder="t('system.interface.watermarkTip')"
                />
              </div>
            </n-flex>
            <n-switch v-model:value="appStore.showWatermark" />
          </n-flex>
        </n-flex>
        <template #footer>
          <n-button type="warning" @click="resetSetting">
            <template #icon>
              <icon-park-outline-redo />
            </template>
            {{ t("common.btn.reset") }}
          </n-button>
        </template>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="tsx">
import type { VNodeChild } from "vue";

import { useAppStoreHook } from "@/store";
import { LayoutMode, ThemeMode } from "@/enums";

import { type SelectOption, NFlex, NText } from "naive-ui";

const appStore = useAppStoreHook();

const { t } = useI18n();

const colorMode = ref(appStore.storeColorMode);

const drawerActive = ref(false);
const openSetting = () => (drawerActive.value = !drawerActive.value);

// 页面过度动画
const transitionSelectorOptions = computed<Status.TransitionSelectorOptions[]>(() => [
  { label: t("system.transitionList.none"), value: "" },
  { label: t("system.transitionList.slideFade"), value: "fade-slide" },
  { label: t("system.transitionList.bottomFade"), value: "fade-bottom" },
  { label: t("system.transitionList.collapseFade"), value: "fade-scale" },
  { label: t("system.transitionList.expandFade"), value: "zoom-fade" },
  { label: t("system.transitionList.collapse"), value: "zoom-out" },
  { label: t("system.transitionList.soft"), value: "fade" },
  { label: t("system.transitionList.gradual"), value: "fade-gradient" },
]);

// 边框圆角大小
const borderRadiusOptions = computed<SelectOption[]>(() => [
  { label: t("system.borderRadius.none"), value: "0px" },
  { label: t("system.borderRadius.small"), value: "2px" },
  { label: t("system.borderRadius.default"), value: "4px" },
  { label: t("system.borderRadius.large"), value: "6px" },
  { label: t("system.borderRadius.round"), value: "8px" },
]);

// 消息提示位置
const messagePositions = computed<SelectOption[]>(() => [
  { label: t("system.messagePositions.top"), value: "top" },
  { label: t("system.messagePositions.bottom"), value: "bottom" },
  { label: t("system.messagePositions.top-left"), value: "top-left" },
  { label: t("system.messagePositions.top-right"), value: "top-right" },
  { label: t("system.messagePositions.bottom-left"), value: "bottom-left" },
  { label: t("system.messagePositions.bottom-right"), value: "bottom-right" },
]);

const sideBarShowTrigger = computed<SelectOption[]>(() => [
  { label: t("system.sideBarShowTrigger.bar"), value: "bar" },
  { label: t("system.sideBarShowTrigger.arrow-circle"), value: "arrow-circle" },
]);

const palette = [
  "#ffb8b8",
  "#d03050",
  "#F0A020",
  "#fff200",
  "#ffda79",
  "#11a983",
  "#006266",
  "#22a6b3",
  "#13c2c2",
  "#409eff",
  "#c56cf0",
  "#be2edd",
  "#706fd3",
  "#4834d4",
  "#130f40",
  "#4b4b4b",
];

// const { sideBarWidth,side } = storeToRefs(appStore);

const resetSetting = () => {
  window.$dialog.warning({
    title: t("system.dialog.title.resetSettings"),
    content: t("system.dialog.content.resetSettings"),
    positiveText: t("common.btn.confirm"),
    negativeText: t("common.btn.cancel"),
    onPositiveClick: () => {
      appStore.resetAllTheme();
      window.$message.success(t("system.message.resetSuccess"));
    },
  });
};

const setSideBar = computed(() => appStore.layoutMode !== LayoutMode.TOP);

// 渲染圆角大小选项标签
const renderLabel = ({ label, value }: SelectOption): VNodeChild => (
  <NFlex>
    <NText>{label}</NText>
    <NText>{value}</NText>
  </NFlex>
);

const renderTag = ({ option }: { option: SelectOption }): VNodeChild => (
  <NText>{option.label}</NText>
);

const themeConfig = computed(() => {
  const { common } = appStore.theme;

  return `import type { GlobalThemeOverrides } from "naive-ui";

/** 默认主色 */
export const primaryColor = "${common?.primaryColor}";
/** 默认信息色 */
export const infoColor = "${common?.infoColor}";
/** 默认成功色 */
export const successColor = "${common?.successColor}";
/** 默认警告色 */
export const warningColor = "${common?.warningColor}";
/** 默认错误色 */
export const errorColor = "${common?.errorColor}";

/** 默认主题配置 */
const themeConfig: GlobalThemeOverrides = {
  common: {
    primaryColor,
    primaryColorHover: "${common?.primaryColorHover}",
    primaryColorPressed: "${common?.primaryColorPressed}",
    primaryColorSuppl: "${common?.primaryColorSuppl}",
    infoColor,
    infoColorHover: "${common?.infoColorHover}",
    infoColorPressed: "${common?.infoColorPressed}",
    infoColorSuppl: "${common?.infoColorSuppl}",
    successColor,
    successColorHover: "${common?.successColorHover}",
    successColorPressed: "${common?.successColorPressed}",
    successColorSuppl: "${common?.successColorSuppl}",
    warningColor,
    warningColorHover: "${common?.warningColorHover}",
    warningColorPressed: "${common?.warningColorPressed}",
    warningColorSuppl: "${common?.warningColorSuppl}",
    errorColor,
    errorColorHover: "${common?.errorColorHover}",
    errorColorPressed: "${common?.errorColorPressed}",
    errorColorSuppl: "${common?.errorColorSuppl}",
  },
};

export default themeConfig;
`;
});
</script>
