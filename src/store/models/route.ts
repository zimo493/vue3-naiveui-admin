import { store } from "@/store";
import { useAuthStoreHook } from "..";
import { router } from "@/router";
import MenuAPI from "@/api/system/menu";
import appRootRoutes, { constantRoutes } from "@/router/modules/ruotes";
import {
  $t,
  isHttpUrl,
  joinPaths,
  processRoute,
  convertRouterType,
  parseDynamicRoutes,
} from "@/utils";

export const useRouteStore = defineStore("route-store", {
  state: (): Status.Routes => {
    return {
      menus: [],
      routes: [],
      activeMenu: "",
      isInitAuthRoute: false,
    };
  },
  actions: {
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

        // 批量处理路由相关操作
        this._processRouteData(data);
        this.isInitAuthRoute = true;

        return true;
      } catch (error) {
        console.error("初始化路由失败:", error);
        window.$message?.error($t("message.initRouteError"));

        return false;
      }
    },

    /**
     * 批量处理路由数据
     * @param userRoutes 用户路由数据
     */
    _processRouteData(userRoutes: AppRoute.RouteVO[]) {
      this.createRoutes(userRoutes).then((routes) => {
        this.createMenus(routes); // 创建菜单
      });
    },

    /**
     * 创建路由
     * @param userRoutes 用户路由配置
     */
    createRoutes(userRoutes: AppRoute.RouteVO[]) {
      return new Promise<AppRoute.RouteVO[]>((resolve) => {
        if (!userRoutes?.length) resolve([]);

        this.setRedirect(userRoutes);
        const routes = parseDynamicRoutes(userRoutes);

        router.addRoute({
          ...appRootRoutes,
          children: (appRootRoutes.children ?? []).concat(routes),
        });

        const routeVO = [
          ...convertRouterType(appRootRoutes.children ?? []),
          ...convertRouterType(constantRoutes),
          ...userRoutes,
        ];

        this.routes = routeVO;

        resolve(routeVO);
      });
    },

    /**
     * 设置重定向
     * @param routes 路由配置
     * @param parentPath 父级路由路径
     */
    setRedirect(routes: AppRoute.RouteVO[], parentPath = "") {
      routes.forEach((route) => {
        const currentPath = joinPaths(parentPath, route.path);

        if (route.children?.length) {
          this._setRouteRedirect(route, currentPath);
          this.setRedirect(route.children, currentPath);
        }
      });
    },

    /**
     * 设置单个路由的重定向
     * @param route 路由配置
     * @param currentPath 当前路径
     */
    _setRouteRedirect(route: AppRoute.RouteVO, currentPath: string) {
      // 设置默认重定向到第一个可见子路由
      if (!route.redirect) {
        const visibleChildren = route.children?.filter((child) => !child.meta?.hidden) || [];

        if (visibleChildren.length > 0) {
          const target = visibleChildren[0];
          let redirectPath = joinPaths(currentPath, target.path);

          // 拼接路由参数
          if (target.meta?.params) {
            const params = new URLSearchParams(target.meta.params).toString();

            redirectPath += `?${params}`;
          }

          route.redirect = redirectPath;
        }
      }

      // 处理外部链接重定向
      if (route.redirect && isHttpUrl(route.redirect)) {
        const internalChild = route.children?.find((item) => !isHttpUrl(item.path));

        route.redirect = currentPath + joinPaths(internalChild?.path || "");
      }
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
        .flatMap((route) => processRoute(route))
        .filter(this._isValidMenu) as any;
    },

    /**
     * 判断是否为有效菜单项
     * @param menu 菜单项
     * @returns 是否有效
     */
    _isValidMenu(menu: any): boolean {
      return menu.key !== undefined && (menu.children?.length > 0 || menu.key);
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
     * 重置路由存储
     */
    resetRouteStore() {
      try {
        router.removeRoute("Root");
      } catch (error) {
        console.warn("移除根路由失败:", error);
      }
      this.$reset();
    },
  },
});

export const useRouteStoreHook = () => useRouteStore(store);
