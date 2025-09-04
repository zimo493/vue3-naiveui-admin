import type { RouteLocationNormalized } from "vue-router";
import { router } from "@/router";
import { store } from "@/store";

export const useTabStore = defineStore("tab-store", {
  state: (): Status.Tab => ({
    pinTabs: [],
    tabs: [],
    cacheRoutes: [],
    currentTabPath: "",
  }),
  getters: {
    allTabs: (state) => [...state.pinTabs, ...state.tabs],
  },
  actions: {
    addTab(route: RouteLocationNormalized) {
      // 创建一个新的路由对象，只包含需要的属性，避免枚举整个组件实例
      const { path, name, fullPath, query } = route;
      const meta = route.meta || {};
      const { hidden, affix, title, icon, params, keepAlive } = meta;

      if (keepAlive) this.addCache(fullPath);

      // 根据meta确定是否不添加，可用于错误页,登录页等
      if (hidden) return;

      // 如果标签名称已存在则不添加
      if (this.hasExistTab(fullPath)) return;

      // 创建一个简化的路由对象
      const tab = {
        path,
        name,
        fullPath,
        query,
        meta: { hidden, affix, title, icon, params, keepAlive },
      } as RouteLocationNormalized;

      // 根据meta.affix传递到不同的分组中
      if (affix) this.pinTabs.push(tab);
      else this.tabs.push(tab);
    },
    async closeTab(path: string) {
      const tabsLength = this.tabs.length;

      // 如果动态标签大于一个,才会标签跳转
      if (this.tabs.length > 1) {
        // 获取关闭的标签索引
        const index: number = this.getTabIndex(path);
        const isLast: boolean = index + 1 === tabsLength;
        let pushedTab = "";

        // 如果是关闭的当前页面，路由跳转到原先标签的后一个标签
        if (this.currentTabPath === path && !isLast) {
          // 跳转到后一个标签
          pushedTab = this.tabs[index + 1].path;
        } else if (this.currentTabPath === path && isLast) {
          // 已经是最后一个了，就跳转前一个
          pushedTab = this.tabs[index - 1].path;
        }
        await router.push(pushedTab);
      }
      // 删除标签
      this.tabs = this.tabs.filter((item: RouteLocationNormalized) => item.path !== path);
      // 删除后如果清空了，就跳转到默认首页
      if (tabsLength - 1 === 0) await router.push("/");
      await this.setCurrentTab(this.currentTabPath);
      this.delCache(path);
    },

    closeOtherTabs(path: string) {
      const index = this.getTabIndex(path);

      this.tabs = this.tabs.filter((_: RouteLocationNormalized, i: number) => i === index);
      this.setCache(this.tabs);
    },
    closeLeftTabs(path: string) {
      const index = this.getTabIndex(path);

      this.tabs = this.tabs.filter((_: RouteLocationNormalized, i: number) => i >= index);
      this.setCache(this.tabs);
    },
    closeRightTabs(path: string) {
      const index = this.getTabIndex(path);

      this.tabs = this.tabs.filter((_: RouteLocationNormalized, i: number) => i <= index);
      this.setCache(this.tabs);
    },
    clearAllTabs() {
      this.tabs.length = 0;
      this.pinTabs.length = 0;
      this.cacheRoutes.length = 0;
      this.$reset();
    },
    async closeAllTabs() {
      this.tabs.length = 0;
      this.cacheRoutes.length = 0;
      await router.push("/");
    },

    hasExistTab(path: string) {
      const _tabs = [...this.tabs, ...this.pinTabs];

      return _tabs.some((item) => item.fullPath === path);
    },
    /* 设置当前激活的标签 */
    async setCurrentTab(path: string) {
      await nextTick();
      this.currentTabPath = path;
    },
    getTabIndex(path: string) {
      return this.tabs.findIndex((item: RouteLocationNormalized) => item.path === path);
    },
    /** 关闭当前标签打开新标签 */
    async closeCurrentTabOpenNew(path: string) {
      await this.closeTab(this.currentTabPath);
      await router.push(path);
    },

    /** 添加缓存 */
    addCache(path: string) {
      if (!this.cacheRoutes.includes(path)) {
        this.cacheRoutes.push(path);
      }
    },
    /** 移除缓存 */
    delCache(path: string) {
      this.cacheRoutes = this.cacheRoutes.filter((item) => item !== path);
    },

    /** 设置缓存 */
    setCache(routes: RouteLocationNormalized[]) {
      this.cacheRoutes = routes.filter((item) => item.meta?.keepAlive).map((item) => item.fullPath);
    },
  },
  persist: { storage: sessionStorage },
});

export const useTabStoreHook = () => useTabStore(store);
