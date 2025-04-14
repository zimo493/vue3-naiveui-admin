import { RouterLink, type RouteRecordRaw } from "vue-router";
import { type MenuOption, NEllipsis } from "naive-ui";
import { isHttpUrl, renderIcon } from ".";
import { defaultIcon } from "@/modules/assets";

const MAX_DEPTH = 5; // 最大递归深度

/**
 * 解析后端返回的路由数据并转换为 Vue Router 兼容的路由配置
 *
 * @param rawRoutes 后端返回的原始路由数据
 * @returns 解析后的路由配置数组
 */
export const parseDynamicRoutes = (rawRoutes: AppRoute.RouteVO[]): RouteRecordRaw[] => {
  const parsedRoutes: RouteRecordRaw[] = [];

  const modules = import.meta.glob("@/views/**/*.vue");

  rawRoutes.forEach((route) => {
    const normalizedRoute = { ...route } as RouteRecordRaw;

    if (normalizedRoute.component?.toString() === "Layout") {
      normalizedRoute.component = undefined;
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

// 核心递归处理路由函数
export const processRoute = (
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
  const { alwaysShow, title, icon, params, hidden } = meta;

  // 如果菜单项被标记为隐藏，则不显示在菜单中
  if (hidden) {
    return [];
  }

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
// 图标处理函数 没有图标时使用本地默认图标
const getMenuIcon = (icon?: string) => (icon ? renderIcon(icon) : renderIcon(defaultIcon));

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

// 路径解析函数
const resolvePath = (parentPath: string, currentPath: string): string => {
  if (!currentPath) return parentPath;
  if (isHttpUrl(currentPath) || currentPath.startsWith("/")) return currentPath;

  return parentPath ? `${parentPath}/${currentPath}` : currentPath;
};

/**
 * 渲染省略菜单名称
 * @param VNode
 * @returns VNode
 */
export const renderEllipsis = (VNode: VNode): VNode => h(NEllipsis, null, { default: () => VNode });

/**
 * 拼接路径，处理开头和结尾的斜杠
 */
export const joinPaths = (...paths: string[]): string => {
  return (
    "/" +
    paths
      .map((path) => path.replace(/^\/+|\/+$/g, "")) // 去除开头和结尾的斜杠
      .filter(Boolean) // 过滤空路径
      .join("/")
  );
};
