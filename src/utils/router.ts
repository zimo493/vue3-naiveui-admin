import { RouterLink, type RouteRecordRaw } from "vue-router";
import { type MenuOption, NEllipsis } from "naive-ui";
import { $t, isHttpUrl, pathToHump, renderIcon } from ".";
import { defaultIcon } from "@/modules/assets";

const MAX_DEPTH = 5; // 最大递归深度

/**
 * 解析后端返回的路由数据并转换为 Vue Router 兼容的路由配置
 *
 * @param rawRoutes 后端返回的原始路由数据
 * @returns 解析后的路由配置数组
 */
export const parseDynamicRoutes = (rawRoutes: AppRoute.RouteVO[]): RouteRecordRaw[] => {
  // 预加载所有视图组件
  const viewModules = import.meta.glob("@/views/**/*.vue");

  // 内部递归解析函数
  const parse = (routes: AppRoute.RouteVO[]): RouteRecordRaw[] => {
    return routes.reduce<RouteRecordRaw[]>((parsed, route) => {
      // 跳过HTTP链接路径
      if (isHttpUrl(route.path)) return parsed;

      // 创建路由配置副本
      const record: RouteRecordRaw = { ...route } as RouteRecordRaw;

      // 处理组件映射
      if (record.component) {
        const compStr = record.component.toString();

        if (compStr === "Layout") {
          // 明确设置Layout组件标识
          record.component = undefined;
        } else {
          // 标准化组件路径：移除首尾斜杠，确保路径一致性
          const normalizedPath = compStr.replace(/^\/+|\/+$/g, "");

          // 匹配视图组件
          const modulePath = viewModules[`/src/views/${normalizedPath}.vue`];

          if (modulePath) {
            record.component = modulePath;
          } else {
            record.component = () => import("@/views/error/404");
          }
        }
      }

      // 递归处理子路由
      if (route.children?.length) {
        record.children = parse(route.children);
      }

      parsed.push(record);

      return parsed;
    }, []);
  };

  return parse(rawRoutes);
};

// 核心递归处理路由函数
export const processRoute = (route: AppRoute.RouteVO, parentPath = "", depth = 0): MenuOption[] => {
  if (route.component === "Layout") {
    route.name = pathToHump(route.path);
  }

  if (depth > MAX_DEPTH) {
    console.warn(`菜单层级超过${MAX_DEPTH}层，路径：${route.path}`);

    return [];
  }

  const currentPath = resolvePath(parentPath, route.path || "");
  const { meta = {}, children = [], name = "" } = route;
  const { alwaysShow, title, icon, params, hidden } = meta;

  // console.log(name, 111);

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
    label: generateLabel(currentPath, name, title, params, children.length > 0),
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
  name: string,
  title = "???",
  params?: Recordable,
  hasChildren?: boolean
) => {
  if (isHttpUrl(fullPath)) {
    return () =>
      renderEllipsis(
        h("a", { href: fullPath, target: "_blank" }, $t(`route.${String(name)}`, title))
      );
  }

  return hasChildren
    ? () => renderEllipsis(h("span", {}, $t(`route.${String(name)}`, title)))
    : () =>
        renderEllipsis(
          h(
            RouterLink,
            { to: { path: fullPath, query: params } },
            { default: () => $t(`route.${String(name)}`, title) }
          )
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

/**
 * 查找并合并路由数组
 * @param data 所有缓存路由数据
 * @param elements 目标元素
 * @returns 合并后的路由数组
 */
export const findAndMergeRouteArrays = (data: string[][], elements: string[]): string[] => {
  const foundArrays = elements
    .map((element) => data.find((arr) => arr.includes(element)))
    .filter(Boolean) as string[][];

  // 使用Set去重并合并
  const mergedSet = new Set<string>();

  foundArrays.forEach((arr) => {
    arr.forEach((item) => mergedSet.add(item));
  });

  return Array.from(mergedSet);
};
