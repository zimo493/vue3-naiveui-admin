import type { MessageProviderProps } from "naive-ui";
import { colord } from "colord";
import { set } from "radash";
import { store as pinia } from "@/store";
import { LayoutMode, ThemeMode } from "@/enums";
import theme, {
  primaryColor,
  infoColor,
  successColor,
  warningColor,
  errorColor,
} from "@/utils/theme";
import { local, setLocale } from "@/utils";

const docEle = ref(document.documentElement);

const { isFullscreen, toggle } = useFullscreen(docEle);

const { system, store } = useColorMode();

const { VITE_DEFAULT_LANG } = import.meta.env;

export const useAppStore = defineStore("app-store", {
  state: (): Status.App => {
    return {
      footerText: "Copyright © 2021 - 2025 youlai.tech All Rights Reserved.",
      theme,
      lang: VITE_DEFAULT_LANG,
      primaryColor,
      infoColor,
      successColor,
      warningColor,
      errorColor,
      borderRadius: "4px",
      followPrimary: false,
      collapsed: false,
      grayMode: false,
      colorWeak: false,
      fixed: true, // 是否固定头部和底部
      loadFlag: true,
      showLogo: true,
      showTabs: true,
      showTabsIcon: true,
      showFooter: false,
      showProgress: true,
      showBreadcrumb: true,
      showBreadcrumbIcon: true,
      showWatermark: false,
      watermarkText: "",
      transitionAnimation: "fade-slide",
      layoutMode: LayoutMode.LEFT,
      contentFullScreen: false,
      sideWidth: 200,
      sideCollapsedWidth: 50,
      sideTrigger: "bar",
      placement: "top",
      inverted: false, // 菜单反转样式
    };
  },
  getters: {
    storeColorMode: () => store.value,
    colorMode: () => (store.value === ThemeMode.AUTO ? system.value : store.value),
    fullScreen: () => isFullscreen.value,
  },
  actions: {
    // 重置所有设置
    resetAllTheme() {
      this.theme = theme;
      this.primaryColor = primaryColor;
      this.infoColor = infoColor;
      this.successColor = successColor;
      this.warningColor = warningColor;
      this.errorColor = errorColor;
      this.borderRadius = "4px";
      this.followPrimary = false;
      this.collapsed = false;
      this.grayMode = false;
      this.colorWeak = false;
      this.fixed = true;
      this.loadFlag = true;
      this.showLogo = true;
      this.showTabs = true;
      this.showTabsIcon = true;
      this.showLogo = true;
      this.showFooter = false;
      this.showBreadcrumb = true;
      this.showBreadcrumbIcon = true;
      this.showWatermark = false;
      this.watermarkText = "";
      this.transitionAnimation = "fade-slide";
      this.layoutMode = LayoutMode.LEFT;
      this.contentFullScreen = false;
      this.sideWidth = 200;
      this.sideCollapsedWidth = 50;
      this.sideTrigger = "bar";
      this.placement = "top";
      this.inverted = false;

      // 重置所有配色
      this.setPrimaryColor();
      this.setInfoColor();
      this.setSuccessColor();
      this.setWarningColor();
      this.setErrorColor();
      this.setBorderRadius("4px");
    },

    /* 设置语言 */
    setAppLang(lang: App.lang) {
      setLocale(lang);
      local.set("lang", lang);
      this.lang = lang;
      this.reloadPage();
    },
    /* 设置题色 */
    setColor(type: Status.ThemeColorType, color: string) {
      const hoverColor = colord(color).lighten(0.06).toHex();
      const pressedColor = colord(color).darken(0.06).toHex();
      const supplColor = colord(color).darken(0.1).toHex();

      set(this.theme, `common.${type}Color`, color);
      set(this.theme, `common.${type}ColorHover`, hoverColor);
      set(this.theme, `common.${type}ColorPressed`, pressedColor);
      set(this.theme, `common.${type}ColorSuppl`, supplColor);
    },
    /* 设置主色 */
    setPrimaryColor() {
      if (this.followPrimary) this.handleFollowPrimary(true);
      this.setColor("primary", this.primaryColor);
    },
    /* 设置信息色 */
    setInfoColor() {
      this.setColor("info", this.infoColor);
    },
    /* 设置成功色 */
    setSuccessColor() {
      this.setColor("success", this.successColor);
    },
    /* 设置警告色 */
    setWarningColor() {
      this.setColor("warning", this.warningColor);
    },
    /* 设置错误色 */
    setErrorColor() {
      this.setColor("error", this.errorColor);
    },
    /** 信息色跟随主色 */
    handleFollowPrimary(checked: boolean) {
      this.followPrimary = checked;
      this.infoColor = checked ? this.primaryColor : infoColor;
      this.setInfoColor();
    },
    setColorMode(mode: ThemeMode) {
      store.value = mode;
    },
    /* 切换侧边栏收缩 */
    toggleCollapse() {
      this.collapsed = !this.collapsed;
    },
    /* 切换全屏 */
    async toggleFullScreen() {
      await toggle();
    },
    /**
     * @description: 页面内容重载
     * @param delay - 延迟毫秒数
     */
    reloadPage(delay = 600) {
      this.loadFlag = false;

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          this.loadFlag = true;
          resolve();
        }, delay);
      });
    },
    /* 切换色弱模式 */
    toggleColorWeak() {
      docEle.value.classList.toggle("color-weak");
      this.colorWeak = docEle.value.classList.contains("color-weak");
    },
    /* 切换灰色模式 */
    toggleGrayMode() {
      docEle.value.classList.toggle("gray-mode");
      this.grayMode = docEle.value.classList.contains("gray-mode");
    },
    /* 设置边框圆角 */
    setBorderRadius(radius: string) {
      this.borderRadius = radius;
      set(this.theme, "common.borderRadius", radius);
    },
    /* 修改消息提示位置 */
    setPlacement(position: MessageProviderProps["placement"]) {
      this.placement = position;
      window.$message.info("我会显示在这里哦😊");
    },
  },
  persist: true, // 持久化存储，默认存储在 localStorage
});

export const useAppStoreHook = () => useAppStore(pinia);
