import { type MenuOption } from "naive-ui";
import { store } from "@/store";
import { router } from "@/router";
import { useAuthStoreHook } from "..";
import MenuAPI from "@/api/system/menu";
import constantRoutes from "@/router/modules/routes";
import { $t, isHttpUrl, joinPaths, processMenu, parseDynamicRoutes, toRouteVO } from "@/utils";

export const useRouteStore = defineStore("route-store", {
  state: (): Status.Routes => ({
    menus: [],
    routes: [],
    activeMenu: "",
    isInitAuthRoute: false,
  }),
  actions: {
    _snapshotPromise: null as Promise<boolean> | null,

    /**
     * 刷新权限快照（单飞）
     *
     * - 重置路由
     * - 重新初始化授权路由（内部会刷新用户信息）
     */
    reloadPermissionSnapshotOnce(): Promise<boolean> {
      if (this._snapshotPromise) return this._snapshotPromise;

      this._snapshotPromise = (async () => {
        try {
          this.resetRouteStore();

          return await this.initAuthRoute();
        } finally {
          this._snapshotPromise = null;
        }
      })();

      return this._snapshotPromise;
    },

    /**
     * 获取个人信息，初始化路由
     * @returns Promise<boolean> 返回初始化是否成功
     */
    async initAuthRoute(): Promise<boolean> {
      try {
        this.isInitAuthRoute = false;
        const authStore = useAuthStoreHook();

        // 获取用户信息
        try {
          await authStore.getUserInfo();
        } catch {
          await authStore.resetAuthStore();

          return false;
        }

        // 获取动态路由
        const data = await MenuAPI.getRoutes();

        if (!data) {
          window.$message?.error("获取路由失败!");

          return false;
        }

        // 创建路由
        this.createRoutes(data);

        /**
         * 初始化菜单路由
         *  - 合并公共路由和用户路由
         *  - 转换为 RouteVO 格式
         */
        const publicRoutes: AppRoute.RouteVO[] = constantRoutes
          .flatMap((route) => (route.path === "/" && route.children ? route.children : route))
          .map(toRouteVO);

        this.createMenus(publicRoutes.concat(data));

        // 初始化路由完成
        this.isInitAuthRoute = true;

        return true;
      } catch (error) {
        console.error("初始化路由失败:", error);
        window.$message?.error($t("message.initRouteError"));

        return false;
      }
    },

    /**
     * 创建路由
     * @param userRoutes 用户路由配置
     */
    createRoutes(userRoutes: AppRoute.RouteVO[]) {
      if (!userRoutes?.length) return;
      // 先设置重定向（操作原始 userRoutes，parseDynamicRoutes 之前）
      this.setRedirect(userRoutes);
      const routes = parseDynamicRoutes(userRoutes);

      routes.forEach((route) => {
        router.addRoute(route);
      });

      this.routes = constantRoutes.concat(routes);
    },

    /**
     * 设置重定向
     * @param routes 路由配置
     * @param parentPath 父级路由路径
     */
    setRedirect(routes: AppRoute.RouteVO[], parentPath = "") {
      routes.forEach((route) => {
        if (isHttpUrl(route.path)) return;

        const currentPath = joinPaths(parentPath, route.path);

        if (route.children?.length) {
          // 只找第一个非外链子路由
          const firstValid = route.children.find((item) => !isHttpUrl(item.path));

          if (firstValid) {
            route.redirect = joinPaths(currentPath, firstValid.path);
          }

          this.setRedirect(route.children, currentPath);
        }
      });
    },

    /**
     * 生成侧边菜单
     * @param userRoutes 用户路由配置
     */
    createMenus(userRoutes: AppRoute.RouteVO[]) {
      if (!userRoutes?.length) {
        this.menus = [];

        return;
      }

      this.menus = userRoutes
        .flatMap((route) => processMenu(route))
        .filter(this._isValidMenu) as any;
    },

    /**
     * 判断是否为有效菜单项
     * @param menu 菜单项
     * @returns 是否有效
     */
    _isValidMenu(menu: MenuOption): boolean {
      return menu.key !== undefined && ((menu.children?.length ?? 0) > 0 || !!menu.key);
    },

    /**
     * 设置当前激活的菜单
     * @param key 菜单key
     */
    setActiveMenu(key: string) {
      if (key && key !== this.activeMenu) {
        this.activeMenu = key;
      }
    },

    /**
     * 重置路由至初始状态（仅保留常量路由）
     */
    resetDynamicRoutes() {
      const constantRouteNames = new Set(
        constantRoutes.flatMap((route) => [
          route.name,
          ...(route.children?.map((child) => child.name) ?? []),
        ])
      );

      router.getRoutes().forEach((route) => {
        if (route.name && !constantRouteNames.has(route.name)) {
          router.removeRoute(route.name);
        }
      });
    },

    /**
     * 移除动态路由 + 重置路由存储
     * - 防止退出登录后未刷新页面就登陆其他账号时之前的动态路由依然存在
     */
    resetRouteStore() {
      this.resetDynamicRoutes();
      this.$reset();
    },
  },
});

export const useRouteStoreHook = () => useRouteStore(store);
