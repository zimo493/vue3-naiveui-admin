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
    showTabsIcon: boolean;
    showFooter: boolean;
    showProgress: boolean;
    showBreadcrumb: boolean;
    showBreadcrumbIcon: boolean;
    showWatermark: boolean;
    transitionAnimation: TransitionAnimation;
    layoutMode: import("@/enums").LayoutMode;
    contentFullScreen: boolean;
    sideWidth: number;
    sideCollapsedWidth: number;
    lang: App.lang;
    sideTrigger: "bar" | "arrow-circle";
    borderRadius: string;
    placement: import("naive-ui").MessageProviderProps["placement"];
    inverted: boolean;
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

  interface SideBarTriggerOptions {
    label: string;
    value: "bar" | "arrow-circle";
  }

  /** 主题颜色类型 */
  type ThemeColorType = "primary" | "info" | "success" | "warning" | "error";

  /** auth-store */
  interface Auth {
    userInfo: User.Info;
  }

  /** route-store */
  interface Routes {
    /** 是否初始化过路由 */
    isInitAuthRoute: boolean;
    /** 菜单列表 */
    menus: import("naive-ui").MenuOption[];
    /** 激活的菜单 */
    activeMenu: string;
    /** 缓存的路由 */
    cacheRoutes: string[];
    /** 所有需要缓存的路由 */
    allCacheRoutes: string[][];
    routes: import("vue-router").RouteRecordRaw[];
  }

  /** tab-store */
  interface Tab {
    pinTabs: import("vue-router").RouteLocationNormalized[];
    tabs: import("vue-router").RouteLocationNormalized[];
    currentTabPath: string;
  }
}
