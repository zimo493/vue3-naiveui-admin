import { store } from "@/store";
import { useAuthStoreHook } from "..";

import { router } from "@/router";

import MenuAPI from "@/api/system/menu";
import appRootRoutes, { constantRoutes } from "@/router/modules/ruotes";

import { isHttpUrl, joinPaths, parseDynamicRoutes, processRoute } from "@/utils";

export const useRouteStore = defineStore("route-store", {
  state: (): Status.Routes => {
    return {
      cacheRoutes: [],
      menus: [],
      routes: [],
      activeMenu: "",
      isInitAuthRoute: false,
    };
  },
  actions: {
    /**
     * 获取个人信息，初始化路由
     * @returns void
     */
    async initAuthRoute() {
      this.isInitAuthRoute = false;

      const authStore = useAuthStoreHook();

      /** 先获取用户信息 */
      authStore.getUserInfo().catch(async () => {
        await authStore.resetAuthStore();
      });

      /** 获取动态路由 */
      const data = await MenuAPI.getRoutes();

      if (!data) {
        return window.$message.error("获取路由失败!");
      }

      this.createRoutes(data);
      this.setCacheRoutes(data);
      this.createMenus(data);

      this.isInitAuthRoute = true;
    },

    /**
     * 创建路由
     * @param userRoutes
     * @returns void
     */
    createRoutes(userRoutes: AppRoute.RouteVO[]) {
      this.setRedirect(userRoutes);
      const routes = parseDynamicRoutes(userRoutes);
      const rootRoutes = appRootRoutes;

      rootRoutes.children?.push(...routes);

      router.addRoute(rootRoutes);

      this.routes = [...constantRoutes, ...routes];
    },

    /**
     * 设置重定向
     * @param routes 路由
     * @param parentPath 父级路由路径
     */
    setRedirect(routes: AppRoute.RouteVO[], parentPath = "") {
      routes.forEach((route) => {
        const currentPath = joinPaths(parentPath, route.path);

        if (route.children) {
          // 没有设置重定向则设置成第一个子路由
          if (!route.redirect) {
            const visibleChildren = route.children.filter((child) => !child.meta?.hidden);

            if (visibleChildren.length > 0) {
              const target = visibleChildren[0];

              let redirectPath = joinPaths(currentPath, target.path);

              // 如果子级路由有参数，则拼接参数到重定向路径中
              if (target.meta?.params) {
                redirectPath += "?" + new URLSearchParams(target.meta?.params).toString();
              }

              route.redirect = redirectPath;
            }
          }
          // 如果路由设置了重定向并且重定向到了外部链接，则设置成普通路由
          if (isHttpUrl(route.redirect)) {
            route.redirect =
              currentPath +
              joinPaths(route.children.find((item) => !isHttpUrl(item.path))?.path || "");
          }
          this.setRedirect(route.children, currentPath);
        }
      });
    },

    /**
     * 生成侧边菜单
     * @param userRoutes 路由
     */
    createMenus(userRoutes: AppRoute.RouteVO[]) {
      // 生成最终菜单
      this.menus = userRoutes
        .flatMap((route) => processRoute(route))
        .filter(
          (menu) =>
            menu.key !== undefined && // 过滤无效项
            (menu.children?.length || menu.key) // 有效菜单需有key或子项
        ) as any;
    },

    /** 设置缓存路由 */
    setCacheRoutes(userRoutes: AppRoute.RouteVO[]) {
      const flattenRoutes = (routes: AppRoute.RouteVO[]): string[] => {
        return routes.flatMap((route) => {
          if (route.children?.length) {
            return flattenRoutes(route.children);
          }

          return route.name && route.component ? [route.name] : [];
        });
      };

      this.cacheRoutes = flattenRoutes(userRoutes);
    },

    /** 设置当前激活的菜单 */
    setActiveMenu(key: string) {
      this.activeMenu = key;
    },

    /** 重置路由 */
    resetRouteStore() {
      router.removeRoute("Root");
      this.$reset();
    },
  },
});

export const useRouteStoreHook = () => useRouteStore(store);
