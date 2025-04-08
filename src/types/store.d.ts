/* Store仓库状态类型 */
declare namespace Status {
  /** app-store */
  interface App {
    footerText: string;
    primaryColor: string;
    infoColor: string;
    successColor: string;
    warningColor: string;
    errorColor: string;
    theme: import("naive-ui").GlobalThemeOverrides;
    followPrimary: boolean; // 信息色是否跟随主题色
    collapsed: boolean;
    grayMode: boolean;
    colorWeak: boolean;
    fixed: boolean; // 是否固定头部和底部
    loadFlag: boolean;
    showLogo: boolean;
    showTabs: boolean;
    showFooter: boolean;
    showProgress: boolean;
    showBreadcrumb: boolean;
    showBreadcrumbIcon: boolean;
    showWatermark: boolean;
    transitionAnimation: TransitionAnimation;
    layoutMode: LayoutMode;
    contentFullScreen: boolean;
    sideWidth: number;
    sideCollapsedWidth: number;
    lang: App.lang;
    siderTrigger: "bar" | "arrow-circle";
  }
  type TransitionAnimation =
    | ""
    | "fade-slide"
    | "fade-bottom"
    | "fade-scale"
    | "zoom-fade"
    | "zoom-out"
    | "fade"
    | "fade-gradient";

  interface TransitionSelectorOptions {
    label: string;
    value: TransitionAnimation;
  }

  interface SiderTriggerOptipns {
    label: string;
    value: "bar" | "arrow-circle";
  }

  // 主题颜色类型
  type ThemeColorType = "primary" | "info" | "success" | "warning" | "error";

  type LayoutMode = "leftMenu" | "topMenu" | "mixLeftMenu" | "rightMenu" | "mixRightMenu";
}
