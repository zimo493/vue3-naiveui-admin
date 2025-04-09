// import type { MenuOption } from "naive-ui";
import { useAuthStore } from "..";

import MenuAPI from "@/api/system/menu";
import { RouterLink, type RouteRecordRaw } from "vue-router";
import appRootRoutes from "@/router/modules/ruotes";

import { router } from "@/router";
import { isHttpUrl, renderIcon } from "@/utils";
import { NEllipsis, type MenuOption } from "naive-ui";

export const useRouteStore = defineStore("route-store", {
  state: (): Status.Routes => {
    return {
      cacheRoutes: [],
      menus: [],
      activeMenu: "",
      isInitAuthRoute: false,
    };
  },
  actions: {
    /**
     * 初始化路由
     * @returns void
     */
    async initAuthRoute() {
      this.isInitAuthRoute = false;

      const authStore = useAuthStore();

      /** 先获取用户信息 */
      await authStore.getUserInfo();

      const threeRoutes = await this.generateRoutes();

      if (!threeRoutes) {
        window.$message.error("获取路由失败!");

        return;
      }

      this.createRoutes(threeRoutes);
      this.createMenus(threeRoutes);
      this.setCacheRoutes(threeRoutes);

      this.isInitAuthRoute = true;
    },

    /**
     * 获取路由
     * @returns 路由
     */
    async generateRoutes() {
      const data = await MenuAPI.getRoutes();

      if (!data) return;

      return data;
    },

    /**
     * 创建路由
     * @param routes 路由
     * @returns void
     */
    createRoutes(rawRoutes: AppRoute.RouteVO[]) {
      this.setRedirect(rawRoutes);
      const routes = parseDynamicRoutes(rawRoutes);
      const rootRoutes = appRootRoutes;

      rootRoutes.children?.push(...routes);

      router.addRoute(rootRoutes);
    },

    setRedirect(routes: AppRoute.RouteVO[]) {
      routes.forEach((route) => {
        if (route.children) {
          if (!route.redirect) {
            // Filter out a collection of child elements that are not hidden
            const visibleChilds = route.children.filter((child) => child.meta?.hidden);

            // Redirect page to the path of the first child element by default
            let target = visibleChilds[0];

            route.redirect = target?.path;
          }

          this.setRedirect(route.children);
        }
      });
    },

    /**
     * 生成侧边菜单
     * @param userRoutes 路由
     */
    createMenus(userRoutes: AppRoute.RouteVO[]) {
      const MAX_DEPTH = 5; // 最大递归深度

      // 路径解析函数
      const resolvePath = (parentPath: string, currentPath: string): string => {
        if (!currentPath) return parentPath;
        if (isHttpUrl(currentPath) || currentPath.startsWith("/")) return currentPath;

        return parentPath ? `${parentPath}/${currentPath}` : currentPath;
      };

      // 图标处理函数 没有图标时使用本地默认图标
      const getMenuIcon = (icon?: string) => (icon ? renderIcon(icon) : renderIcon("local:cool"));

      // 标签生成函数
      const generateLabel = (
        fullPath: string,
        title: string = "未命名菜单",
        params?: Recordable,
        hasChildren?: boolean
      ) => {
        if (isHttpUrl(fullPath)) {
          return () => renderEllipsis(h("a", { href: fullPath, target: "_blank" }, title));
        }

        return hasChildren
          ? () => renderEllipsis(h("span", null, title))
          : () =>
              renderEllipsis(
                h(RouterLink, { to: { path: fullPath, query: params } }, { default: () => title })
              );
      };

      // 核心递归处理函数
      const processRoute = (
        route: AppRoute.RouteVO,
        parentPath: string = "",
        depth: number = 0
      ): MenuOption[] => {
        if (depth > MAX_DEPTH) {
          console.warn(`菜单层级超过${MAX_DEPTH}层，路径：${route.path}`);

          return [];
        }

        const currentPath = resolvePath(parentPath, route.path || "");
        const { meta = {}, children = [] } = route;
        const { alwaysShow, title, icon, params } = meta;

        // 处理单子节点情况
        if (children.length === 1 && !alwaysShow) {
          const childResult = processRoute(children[0], currentPath, depth + 1);

          // 只有当子节点最终生成一个菜单项时才提升
          if (childResult.length === 1) {
            return childResult.map((item) => ({
              ...item,
              // 继承父级图标（如果子级没有图标）
              icon: item.icon || getMenuIcon(icon),
            }));
          }
        }

        // 构造菜单项
        const menuItem: MenuOption = {
          label: generateLabel(currentPath, title, params, children.length > 0),
          key: currentPath,
          icon: getMenuIcon(icon),
          children: [],
        };

        // 处理子菜单
        if (children.length > 0) {
          const childItems = children
            .flatMap((child) => processRoute(child, currentPath, depth + 1))
            .filter(Boolean);

          if (childItems.length > 0) {
            menuItem.children = childItems;
          } else {
            delete menuItem.children;
          }
        }

        // 空子节点处理
        if (!menuItem.children?.length) {
          delete menuItem.children;

          // 没有实际路径的节点不显示
          if (!currentPath && !alwaysShow) return [];
        }

        return [menuItem];
      };

      // 生成最终菜单
      this.menus = userRoutes
        .flatMap((route) => processRoute(route))
        .filter(
          (menu) =>
            menu.key !== undefined && // 过滤无效项
            !menu.hidden && // 过滤隐藏项
            (menu.children?.length || menu.key) // 有效菜单需有key或子项
        ) as any;
    },

    // 设置缓存路由
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

    // 设置当前激活的菜单
    setActiveMenu(key: string) {
      this.activeMenu = key;
    },
  },
});

/**
 * 解析后端返回的路由数据并转换为 Vue Router 兼容的路由配置
 *
 * @param rawRoutes 后端返回的原始路由数据
 * @returns 解析后的路由配置数组
 */
const parseDynamicRoutes = (rawRoutes: AppRoute.RouteVO[]): RouteRecordRaw[] => {
  const parsedRoutes: RouteRecordRaw[] = [];

  const modules = import.meta.glob("@/views/**/*.vue");

  rawRoutes.forEach((route) => {
    const normalizedRoute = { ...route } as RouteRecordRaw;

    if (normalizedRoute.component?.toString() === "Layout") {
      normalizedRoute.component = () => import("@/components/common/Views.vue");
    }

    // 处理组件路径
    else if (normalizedRoute.component && normalizedRoute.component.toString() !== "Layout") {
      const component = modules[`/src/views/${normalizedRoute.component}.vue`];

      if (component) {
        normalizedRoute.component = component;
      } else {
        // 修复：使用函数包装 import 语句
        normalizedRoute.component = () => import("@/views/error/404");
      }
    }
    // 递归解析子路由
    if (normalizedRoute.children) {
      normalizedRoute.children = parseDynamicRoutes(route.children);
    }

    parsedRoutes.push(normalizedRoute);
  });

  return parsedRoutes;
};

/**
 * 渲染省略菜单名称
 * @param VNode
 * @returns VNode
 */
const renderEllipsis = (VNode: VNode): VNode => h(NEllipsis, null, { default: () => VNode });
