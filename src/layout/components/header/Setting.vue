<script setup lang="tsx">
import type { VNodeChild } from "vue";

import { useAppStoreHook } from "@/store";
import { LayoutMode, ThemeMode } from "@/enums";

import { NFlex, NText, SelectOption } from "naive-ui";

const appStore = useAppStoreHook();

const colorMode = ref(appStore.storeColorMode);

const drawerActive = ref(false);
const openSetting = () => (drawerActive.value = !drawerActive.value);

// 页面过度动画
const transitionSelectorOptions = ref<Status.TransitionSelectorOptions[]>([
  { label: "无过渡", value: "" },
  { label: "侧边淡出", value: "fade-slide" },
  { label: "底边淡出", value: "fade-bottom" },
  { label: "收缩淡出", value: "fade-scale" },
  { label: "扩大淡出", value: "zoom-fade" },
  { label: "收缩", value: "zoom-out" },
  { label: "柔和", value: "fade" },
  { label: "渐变", value: "fade-gradient" },
]);

// 边框圆角大小
const borderRadiusOptions = ref([
  { label: "无圆角", value: "0px" },
  { label: "小型", value: "2px" },
  { label: "默认", value: "4px" },
  { label: "大型", value: "6px" },
  { label: "圆润", value: "8px" },
]);

// 消息提示位置
const messagePositions = ref([
  { label: "顶部", value: "top" },
  { label: "底部", value: "bottom" },
  { label: "左上", value: "top-left" },
  { label: "右上", value: "top-right" },
  { label: "左下", value: "bottom-left" },
  { label: "右下", value: "bottom-right" },
]);

const sideBarShowTrigger = ref<Status.SideBarTriggerOptions[]>([
  { label: "条状", value: "bar" },
  { label: "圆形箭头", value: "arrow-circle" },
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
    title: "重置设置",
    content: "确认重置所有设置？",
    positiveText: "确认",
    negativeText: "取消",
    onPositiveClick: () => {
      appStore.resetAllTheme();
      window.$message.success("重置成功");
    },
  });
};

const setSideBar = computed(() => [LayoutMode.LEFT, LayoutMode.MIX].includes(appStore.layoutMode));

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

<template>
  <n-tooltip placement="bottom" trigger="hover">
    <template #trigger>
      <CommonWrapper @click="openSetting">
        <div>
          <icon-park-outline-setting-two />
          <n-drawer v-model:show="drawerActive" :width="360">
            <n-drawer-content title="系统设置" closable>
              <n-space vertical>
                <n-divider>布局设置</n-divider>
                <LayoutSelector v-model:value="appStore.layoutMode" />

                <n-divider>主题模式</n-divider>
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
                  <n-space justify="space-between">
                    <n-flex align="center" justify="center" :size="[4, 0]">
                      反转样式
                      <HelpInfo message="来增强菜单和下拉菜单的视觉效果" />
                    </n-flex>
                    <n-switch v-model:value="appStore.inverted" />
                  </n-space>
                  <n-space justify="space-between">
                    色弱模式
                    <n-switch
                      :value="appStore.colorWeak"
                      @update:value="appStore.toggleColorWeak"
                    />
                  </n-space>
                  <n-space justify="space-between">
                    黑白模式
                    <n-switch :value="appStore.grayMode" @update:value="appStore.toggleGrayMode" />
                  </n-space>
                </n-flex>

                <n-divider>
                  <span mr-10px>主题颜色</span>
                  <n-tooltip trigger="hover" placement="left">
                    <template #trigger>
                      <n-button
                        v-copy="{ text: themeConfig, msg: '主题配色已复制到剪贴板' }"
                        type="primary"
                        size="small"
                        quaternary
                      >
                        复制
                      </n-button>
                    </template>
                    <span>
                      复制后可粘贴替换
                      <n-tag type="info" :bordered="false">src/utils/theme.ts</n-tag>
                      中的内容
                    </span>
                  </n-tooltip>
                </n-divider>
                <n-space align="center" justify="space-between">
                  主色
                  <n-color-picker
                    v-model:value="appStore.primaryColor"
                    w-100px
                    :show-alpha="false"
                    :swatches="palette"
                    @update:value="appStore.setPrimaryColor"
                  />
                </n-space>
                <n-space align="center" justify="space-between">
                  <n-space>
                    信息色
                    <n-checkbox
                      v-model:checked="appStore.followPrimary"
                      @update:checked="appStore.handleFollowPrimary"
                    >
                      跟随主色
                    </n-checkbox>
                  </n-space>
                  <n-color-picker
                    v-model:value="appStore.infoColor"
                    w-100px
                    :show-alpha="false"
                    :swatches="palette"
                    @update:value="appStore.setInfoColor"
                  />
                </n-space>
                <n-space align="center" justify="space-between">
                  成功色
                  <n-color-picker
                    v-model:value="appStore.successColor"
                    w-100px
                    :show-alpha="false"
                    :swatches="palette"
                    @update:value="appStore.setSuccessColor"
                  />
                </n-space>
                <n-space align="center" justify="space-between">
                  警告色
                  <n-color-picker
                    v-model:value="appStore.warningColor"
                    w-100px
                    :show-alpha="false"
                    :swatches="palette"
                    @update:value="appStore.setWarningColor"
                  />
                </n-space>
                <n-space align="center" justify="space-between">
                  错误色
                  <n-color-picker
                    v-model:value="appStore.errorColor"
                    w-100px
                    :show-alpha="false"
                    :swatches="palette"
                    @update:value="appStore.setErrorColor"
                  />
                </n-space>

                <n-divider>界面功能</n-divider>
                <n-space align="center" justify="space-between">
                  圆角大小
                  <n-select
                    v-model:value="appStore.borderRadius"
                    class="w-10em"
                    :consistent-menu-width="false"
                    :options="borderRadiusOptions"
                    :render-label="renderLabel"
                    :render-tag="renderTag"
                    @update:value="appStore.setBorderRadius"
                  />
                </n-space>
                <n-space align="center" justify="space-between">
                  页面过渡
                  <n-select
                    v-model:value="appStore.transitionAnimation"
                    class="w-10em"
                    :options="transitionSelectorOptions"
                    @update:value="appStore.reloadPage"
                  />
                </n-space>
                <template v-if="setSideBar">
                  <n-space align="center" justify="space-between">
                    侧边栏宽度
                    <n-input-number v-model:value="appStore.sideWidth" class="w-10em" :min="180" />
                  </n-space>
                  <n-space align="center" justify="space-between">
                    侧边栏折叠宽度
                    <n-input-number
                      v-model:value="appStore.sideCollapsedWidth"
                      class="w-10em"
                      :min="50"
                    />
                  </n-space>
                  <n-space align="center" justify="space-between">
                    侧边栏触发样式
                    <n-select
                      v-model:value="appStore.sideTrigger"
                      class="w-10em"
                      :options="sideBarShowTrigger"
                    />
                  </n-space>
                </template>
                <n-space align="center" justify="space-between">
                  Message提示位置
                  <n-select
                    v-model:value="appStore.placement"
                    class="w-10em"
                    :options="messagePositions"
                    @update:value="appStore.setPlacement"
                  />
                </n-space>

                <n-space justify="space-between">
                  logo显示
                  <n-switch v-model:value="appStore.showLogo" />
                </n-space>
                <n-space justify="space-between">
                  顶部进度
                  <n-switch v-model:value="appStore.showProgress" />
                </n-space>
                <n-space justify="space-between">
                  面包屑
                  <n-switch v-model:value="appStore.showBreadcrumb" />
                </n-space>
                <n-space justify="space-between">
                  面包屑图标
                  <n-switch v-model:value="appStore.showBreadcrumbIcon" />
                </n-space>
                <n-space justify="space-between">
                  多页签显示
                  <n-switch v-model:value="appStore.showTabs" />
                </n-space>
                <n-space justify="space-between">
                  多页签图标
                  <n-switch v-model:value="appStore.showTabsIcon" />
                </n-space>
                <n-space justify="space-between">
                  固定顶部和底部
                  <n-switch v-model:value="appStore.fixed" />
                </n-space>
                <n-space justify="space-between">
                  底部版权
                  <n-switch v-model:value="appStore.showFooter" />
                </n-space>
                <n-space justify="space-between">
                  水印
                  <n-switch v-model:value="appStore.showWatermark" />
                </n-space>
              </n-space>
              <template #footer>
                <n-button type="warning" @click="resetSetting">
                  <template #icon>
                    <icon-park-outline-redo />
                  </template>
                  重置
                </n-button>
              </template>
            </n-drawer-content>
          </n-drawer>
        </div>
      </CommonWrapper>
    </template>
    <span>系统设置</span>
  </n-tooltip>
</template>
