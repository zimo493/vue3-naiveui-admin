import { RouterLink, type RouteRecordRaw } from "vue-router";
import { type MenuOption, NEllipsis } from "naive-ui";
import { $t, isHttpUrl, renderIcon } from ".";
import { defaultIcon } from "@/modules/assets";
import Layout from "@/layout";

const MAX_DEPTH = 5; // 最大递归深度

const viewModules = import.meta.glob("@/views/**/*.vue");

/**
 * 解析动态路由配置，将所有深层子路由全部拉平为一维数组
 * @param rawRoutes - 输入的路由数组
 * @returns 扁平化后的路由数组
 */
export const parseDynamicRoutes = (rawRoutes: AppRoute.RouteVO[]): RouteRecordRaw[] =>
  // 遍历处理顶层路由
  rawRoutes
    .map((route) => {
      if (isHttpUrl(route.path)) return null;

      const record: RouteRecordRaw = { ...route } as RouteRecordRaw;

      // 顶层路由挂载 Layout 容器
      if (record.component && record.component.toString() === "Layout") {
        record.component = Layout;
      }

      // 将所有子孙路由拍平，全部挂载到当前顶层 Layout 的 children 下
      if (route.children && route.children.length > 0) {
        record.children = flattenChildren(route.children, route.path);
      }

      return record;
    })
    .filter(Boolean) as RouteRecordRaw[]; // 过滤掉 null

/**
 * 处理单个路由配置，生成菜单项
 * @param route 输入的路由配置
 * @param parentPath 当前路由的父路径
 * @param depth 当前递归深度
 * @returns 生成的菜单项数组
 */
export const processMenu = (route: AppRoute.RouteVO, parentPath = "", depth = 0): MenuOption[] => {
  if (depth > MAX_DEPTH) {
    console.warn(`菜单层级超过${MAX_DEPTH}层，路径：${route.path}`);

    return [];
  }

  const { meta = {}, children = [], name = "" } = route;
  const { alwaysShow, title, icon, params, hidden } = meta;

  // 隐藏节点直接跳过
  if (hidden) return [];

  const currentPath = resolvePath(parentPath, route.path ?? "");

  // 单子节点提升
  const hoisted = tryHoistSingleChild(children, alwaysShow, currentPath, depth, icon);

  if (hoisted) return hoisted;

  // 构建子菜单
  const childItems = children.length > 0 ? buildChildItems(children, currentPath, depth) : [];

  // 无子菜单且路径为空的节点不显示（除非 alwaysShow）
  if (childItems.length === 0 && !currentPath && !alwaysShow) return [];

  const menuItem: MenuOption = {
    label: generateLabel(currentPath, String(name), title, params, childItems.length > 0),
    key: currentPath,
    icon: getMenuIcon(icon),
    ...(childItems.length > 0 && { children: childItems }),
  };

  return [menuItem];
};

/**
 * 尝试将单子节点提升为当前节点（alwaysShow 时跳过）
 * 返回提升后的菜单项数组，无法提升时返回 null
 */
const tryHoistSingleChild = (
  children: AppRoute.RouteVO[],
  alwaysShow: boolean | undefined,
  currentPath: string,
  depth: number,
  parentIcon?: string
): MenuOption[] | null => {
  if (children.length !== 1 || alwaysShow) return null;

  const childResult = processMenu(children[0], currentPath, depth + 1);

  if (childResult.length !== 1) return null;

  return childResult.map((item) => ({
    ...item,
    icon: item.icon || getMenuIcon(parentIcon),
  }));
};

/**
 * 递归构建子菜单项
 */
const buildChildItems = (
  children: AppRoute.RouteVO[],
  currentPath: string,
  depth: number
): MenuOption[] =>
  children.flatMap((child) => processMenu(child, currentPath, depth + 1)).filter(Boolean);

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

/**
 * 渲染省略菜单名称
 * @param VNode
 * @returns VNode
 */
const renderEllipsis = (VNode: VNode): VNode => h(NEllipsis, null, { default: () => VNode });

/**
 * 拼接路径，处理开头和结尾的斜杠
 */
export const joinPaths = (...paths: string[]): string =>
  "/" +
  paths
    .map((path) => path.replace(/^\/+|\/+$/g, "")) // 去除开头和结尾的斜杠
    .filter(Boolean) // 过滤空路径
    .join("/");

/**
 * 辅助函数：处理相对路径拼接
 * @param parentPath - 父路由的路径
 * @param path - 子路由的路径
 * @returns 完整的路径
 */
const resolvePath = (parentPath: string, path: string): string => {
  if (isHttpUrl(path) || path.startsWith("/")) return path;

  return `${parentPath.replace(/\/$/, "")}/${path}`;
};

/**
 * 核心扁平化逻辑：将所有深层子路由全部拉平为一维数组
 * @param routes - 输入的路由数组
 * @param parentPath - 当前路由的父路径，默认为空字符串
 * @returns 扁平化后的路由数组
 */
const flattenChildren = (routes: AppRoute.RouteVO[], parentPath = ""): RouteRecordRaw[] => {
  const flatList: RouteRecordRaw[] = [];

  routes.forEach((route) => {
    if (isHttpUrl(route.path)) return;

    // 获取完整的路径 (如：父级是 /system，子级是 user，拼接为 /system/user)
    const currentPath = resolvePath(parentPath, route.path);
    const record: RouteRecordRaw = { ...route, path: currentPath } as RouteRecordRaw;

    // 处理组件映射
    if (record.component) {
      const compStr = record.component.toString();

      // 中间层的空目录节点
      if (compStr !== "Layout") {
        const normalizedPath = compStr.replace(/^\/+|\/+$/g, "");
        const modulePath = viewModules[`/src/views/${normalizedPath}.vue`];

        if (modulePath) {
          record.component = modulePath;
        } else {
          console.warn(`[Route Setup]: 视图组件缺失 /src/views/${normalizedPath}`);
          record.component = () => import("@/views/error/404");
        }
      } else {
        // 清除无用的中间层虚拟组件引用
        delete record.component;
      }
    }

    // 彻底删除 children 属性，确保 Vue Router 不会进行嵌套渲染
    delete record.children;

    // 将处理好的路由推入一维数组
    flatList.push(record);

    // 如果它还有自己的子路由，继续递归并拉平到当前的 flatList 中
    if (route.children && route.children.length > 0) {
      flatList.push(...flattenChildren(route.children, currentPath));
    }
  });

  return flatList;
};

/**
 * 将 RouteRecordRaw 转换为 RouteVO
 * @param route RouteRecordRaw
 * @returns RouteVO
 */
export const toRouteVO = (route: RouteRecordRaw): AppRoute.RouteVO => ({
  path: route.path,
  name: String(route.name),
  meta: route.meta,
  component: undefined,
  children: (route.children ?? []).map(toRouteVO),
});
