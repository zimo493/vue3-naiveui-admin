<script setup lang="ts">
// import LayoutSelector from '../common/LayoutSelector.vue'
import { useAppStoreHook } from "@/store";

const appStore = useAppStoreHook();

const colorMode = ref(appStore.storeColorMode);

const drawerActive = ref(false);
const openSetting = () => (drawerActive.value = !drawerActive.value);

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

// const { siderWidth,side } = storeToRefs(appStore);

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

const setSiderWidth = computed(() => ["leftMenu", "mixMenu"].includes(appStore.layoutMode));
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
                      <n-tab name="light">
                        <icon-park-outline-sun-one />
                      </n-tab>
                      <n-tab name="dark">
                        <icon-park-outline-moon />
                      </n-tab>
                      <n-tab name="auto">
                        <icon-park-outline-laptop-computer />
                      </n-tab>
                    </n-tabs>
                  </n-flex>
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

                <n-divider>主题颜色</n-divider>
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
                  页面过渡
                  <n-select
                    v-model:value="appStore.transitionAnimation"
                    class="w-10em"
                    :options="transitionSelectorOptions"
                    @update:value="appStore.reloadPage"
                  />
                </n-space>

                <template v-if="setSiderWidth">
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
                </template>

                <n-space justify="space-between">
                  logo显示
                  <n-switch v-model:value="appStore.showLogo" />
                </n-space>
                <n-space justify="space-between">
                  顶部进度
                  <n-switch v-model:value="appStore.showProgress" />
                </n-space>
                <n-space justify="space-between">
                  固定顶部和底部
                  <n-switch v-model:value="appStore.fixed" />
                </n-space>
                <n-space justify="space-between">
                  多页签显示
                  <n-switch v-model:value="appStore.showTabs" />
                </n-space>
                <n-space justify="space-between">
                  底部版权
                  <n-switch v-model:value="appStore.showFooter" />
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
                  水印
                  <n-switch v-model:value="appStore.showWatermark" />
                </n-space>
              </n-space>
              <template #footer>
                <n-button type="warning" @click="resetSetting">重置</n-button>
              </template>
            </n-drawer-content>
          </n-drawer>
        </div>
      </CommonWrapper>
    </template>
    <span>系统设置</span>
  </n-tooltip>
</template>
