import { RouterLink, type RouteRecordRaw } from "vue-router";
import { type MenuOption, NEllipsis } from "naive-ui";
import { $t, isHttpUrl, renderIcon } from ".";
import { defaultIcon } from "@/modules/assets";
import Layout from "@/layout";

/** 菜单/路由递归最大深度，超出时打印警告并终止递归 */
const MAX_DEPTH = 5;

/**
 * Vite 的 import.meta.glob 预扫描结果。
 */
const viewModules = import.meta.glob("@/views/**/*.vue");

// #region 工具函数

/**
 * 判断路由的 component 字段是否为占位字符串 "Layout"。
 *
 * 后端返回的动态路由中，顶层路由的 component 以字符串 "Layout" 表示，
 * 需要在前端替换为真实的 Layout 组件。
 *
 * @param component - 路由的 component 字段（任意类型）
 * @returns 是否为 Layout 占位符
 */
const isLayoutComponent = (component: unknown): boolean =>
  typeof component === "function" || typeof component === "string"
    ? component.toString() === "Layout"
    : false;

/**
 * 根据后端返回的组件路径字符串，在 viewModules 中查找对应的懒加载模块。
 * 若找不到则降级渲染 404 页面，并在控制台打印警告。
 *
 * @param compStr - 后端返回的组件路径，如 "system/user" 或 "/system/user"
 * @returns 对应的懒加载函数
 *
 * @example
 * resolveComponent("system/user")
 * // → viewModules["/src/views/system/user.vue"] 或 () => import("@/views/error/404")
 */
const resolveComponent = (compStr: string) => {
  // 去掉首尾多余的斜杠，统一格式
  const normalizedPath = compStr.replace(/^\/+|\/+$/g, "");
  const modulePath = viewModules[`/src/views/${normalizedPath}.vue`];

  if (modulePath) return modulePath;

  console.warn(`[Route Setup]: 视图组件缺失 /src/views/${normalizedPath}`);

  return () => import("@/views/error/404");
};

/**
 * 拼接任意数量的路径段，并确保结果以 "/" 开头、段与段之间无重复斜杠。
 *
 * @param paths - 若干路径片段
 * @returns 合法的绝对路径字符串
 *
 * @example
 * joinPaths("/system/", "/user/") // → "/system/user"
 * joinPaths("system", "user")     // → "/system/user"
 */
export const joinPaths = (...paths: string[]): string =>
  "/" +
  paths
    .map((p) => p.replace(/^\/+|\/+$/g, "")) // 去除每段首尾斜杠
    .filter(Boolean) // 过滤空字符串（避免产生 "//"）
    .join("/");

/**
 * 将子路由路径与父路由路径拼接为完整路径。
 *
 * - 若 path 为 HTTP 链接或已是绝对路径（以 "/" 开头），直接返回，不做拼接。
 * - 否则将其拼接在 parentPath 之后，并去除 parentPath 末尾的斜杠。
 *
 * @param parentPath - 父路由的完整路径
 * @param path       - 子路由的相对或绝对路径
 * @returns 子路由的完整路径
 *
 * @example
 * resolvePath("/system", "user")     // → "/system/user"
 * resolvePath("/system", "/user")    // → "/user"
 * resolvePath("/system", "https://…") // → "https://…"
 */
const resolvePath = (parentPath: string, path: string): string => {
  if (isHttpUrl(path) || path.startsWith("/")) return path;

  return `${parentPath.replace(/\/$/, "")}/${path}`;
};

// #region 路由解析

/**
 * 递归将多层嵌套的子路由拍平为一维数组。
 *
 * 背景：后端返回的路由是树形结构，但前端采用"顶层挂 Layout、
 * 所有页面组件作为 Layout 的直接 children"的方案（而非真正的多层嵌套），
 * 因此需要将所有子孙路由拍平，同时把相对路径拼接为绝对路径。
 *
 * 处理逻辑：
 * 1. 外链路由跳过（不注册到 Vue Router）。
 * 2. 将相对路径拼接为完整绝对路径。
 * 3. component 为 "Layout" 的中间目录节点，删除 component（不渲染任何组件）。
 * 4. 其余节点通过 resolveComponent 查找真实的懒加载模块。
 * 5. 删除 children，确保 Vue Router 将其视为叶子路由，不产生嵌套渲染。
 * 6. 递归处理子节点，追加到同一个一维数组中。
 *
 * @param routes     - 待处理的路由数组（树形）
 * @param parentPath - 父级路由的完整路径，初始为空字符串
 * @returns 拍平后的路由数组（一维）
 */
const flattenChildren = (routes: AppRoute.RouteVO[], parentPath = ""): RouteRecordRaw[] => {
  const result: RouteRecordRaw[] = [];

  for (const route of routes) {
    // 外链路由不注册到 Vue Router，由菜单直接以 <a> 标签渲染
    if (isHttpUrl(route.path)) continue;

    // 将相对路径拼接为绝对路径，例如 "user" → "/system/user"
    const currentPath = resolvePath(parentPath, route.path);
    const record = { ...route, path: currentPath } as RouteRecordRaw;

    if (record.component) {
      const compStr = record.component.toString();

      if (isLayoutComponent(compStr)) {
        // 中间目录节点（如 /system）不对应任何页面组件，删除 component 即可
        delete record.component;
      } else {
        // 叶子节点：将字符串路径替换为真实的懒加载模块
        record.component = resolveComponent(compStr);
      }
    }

    // 删除 children，Vue Router 将此记录视为叶子路由，不产生额外嵌套层
    delete record.children;
    result.push(record);

    // 递归拍平子路由，追加到同一个一维数组
    if (route.children?.length) {
      result.push(...flattenChildren(route.children, currentPath));
    }
  }

  return result;
};

/**
 * 将后端返回的动态路由配置解析为 Vue Router 可直接注册的路由记录。
 *
 * 策略：
 * - 顶层路由（component 为 "Layout"）替换为真实的 Layout 组件。
 * - 顶层路由的所有子孙路由通过 flattenChildren 拍平为一维数组，
 *   作为 Layout 的直接 children 注册，避免多层 router-view 嵌套。
 * - 外链路由（HTTP URL）直接过滤，不注册到 Vue Router。
 *
 * @param rawRoutes - 后端返回的原始动态路由数组（RouteVO 格式）
 * @returns 可传入 router.addRoute() 的路由记录数组
 */
export const parseDynamicRoutes = (rawRoutes: AppRoute.RouteVO[]): RouteRecordRaw[] =>
  rawRoutes
    .filter((route) => !isHttpUrl(route.path)) // 过滤外链
    .map((route) => {
      const record = { ...route } as RouteRecordRaw;

      // 顶层路由挂载真实 Layout 组件
      if (isLayoutComponent(record.component)) {
        record.component = Layout;
      }

      // 子孙路由全部拍平，挂载在当前顶层路由的 children 下
      if (route.children?.length) {
        record.children = flattenChildren(route.children, route.path);
      }

      return record;
    });

// #region 菜单生成

/**
 * 获取菜单图标渲染函数。
 * 若路由未配置图标，则回退到项目默认图标，确保菜单视觉一致性。
 *
 * @param icon - 图标名称（Iconify 格式）或 undefined
 * @returns 渲染函数
 */
const getMenuIcon = (icon?: string) => renderIcon(icon ?? defaultIcon);

/**
 * 生成 Naive UI 菜单项的 label 渲染函数。
 *
 * 根据路径类型分三种情况处理：
 * - **外链**：渲染为 `<a>` 标签，点击在新标签页打开。
 * - **目录节点**（有子菜单）：渲染为 `<span>`，点击展开子菜单。
 * - **叶子节点**：渲染为 `<RouterLink>`，点击跳转页面。
 *
 * 所有文字内容均通过 $t() 做国际化处理，无对应翻译时回退到 title。
 *
 * @param fullPath    - 当前菜单项的完整路径（或外链 URL）
 * @param name        - 路由 name，用作 i18n key（route.{name}）
 * @param title       - 菜单显示文字（i18n 的默认值）
 * @param params      - 路由查询参数，透传给 RouterLink
 * @param hasChildren - 是否存在子菜单
 * @returns Naive UI 菜单 label 渲染函数
 */
const generateLabel = (
  fullPath: string,
  name: string,
  title = "???",
  params?: Recordable,
  hasChildren?: boolean
) => {
  // 外链：新标签页打开
  if (isHttpUrl(fullPath)) {
    return () =>
      renderEllipsis(h("a", { href: fullPath, target: "_blank" }, $t(`route.${name}`, title)));
  }

  // 目录节点：纯文字，点击展开子菜单
  if (hasChildren) {
    return () => renderEllipsis(h("span", {}, $t(`route.${name}`, title)));
  }

  // 叶子节点：RouterLink 跳转
  return () =>
    renderEllipsis(
      h(RouterLink, { to: { path: fullPath, query: params } }, () => $t(`route.${name}`, title))
    );
};

/**
 * 用 NEllipsis 包裹菜单文字节点，使菜单收起时文字超长部分自动省略显示。
 *
 * @param node - 待包裹的 VNode
 * @returns 包裹后的 VNode
 */
const renderEllipsis = (node: VNode): VNode => h(NEllipsis, null, { default: () => node });

/**
 * 尝试将"仅有一个可见子节点"的父节点提升（hoist），直接渲染子节点。
 *
 * 适用场景：某个目录路由只有一个子页面，此时不需要在菜单中显示
 * 父目录层级，直接将子页面提升为同级菜单项，减少不必要嵌套。
 *
 * 满足以下任一条件时跳过提升：
 * - 子节点数量不等于 1
 * - 父节点设置了 alwaysShow: true（强制展示父目录）
 * - 子节点处理后结果不是恰好一个菜单项（如子节点本身被隐藏）
 *
 * 提升时若子节点没有自己的图标，则继承父节点的图标。
 *
 * @param children    - 父路由的子路由列表
 * @param alwaysShow  - 是否强制显示父目录（来自 meta.alwaysShow）
 * @param currentPath - 父路由的完整路径（作为子路由的 parentPath）
 * @param depth       - 当前递归深度
 * @param parentIcon  - 父路由的图标（子节点无图标时继承）
 * @returns 提升后的菜单项数组；无法提升时返回 null
 */
const tryHoistSingleChild = (
  children: AppRoute.RouteVO[],
  alwaysShow: boolean | undefined,
  currentPath: string,
  depth: number,
  parentIcon?: string
): MenuOption[] | null => {
  if (children.length !== 1 || alwaysShow) return null;

  const result = processMenu(children[0], currentPath, depth + 1);

  // 子节点处理后不是恰好一个菜单项（如被 hidden 过滤），则放弃提升
  if (result.length !== 1) return null;

  // 子节点无图标时继承父节点图标
  return result.map((item) => ({ ...item, icon: item.icon ?? getMenuIcon(parentIcon) }));
};

/**
 * 将单个路由配置（RouteVO）转换为 Naive UI 侧边菜单项（MenuOption）。
 *
 * 处理逻辑：
 * 1. 超出最大递归深度时终止，避免死循环。
 * 2. hidden 为 true 的路由不出现在菜单中（如登录页、错误页）。
 * 3. 仅有一个非隐藏子节点时尝试提升（见 tryHoistSingleChild）。
 * 4. 无子菜单且路径为空（通常是异常数据）且非 alwaysShow 时跳过。
 * 5. 正常情况下生成包含 label / key / icon / children 的菜单项。
 *
 * @param route      - 路由配置（RouteVO 格式）
 * @param parentPath - 父路由完整路径，递归时传入，初始为空字符串
 * @param depth      - 当前递归深度，初始为 0
 * @returns 对应的 Naive UI 菜单项数组（通常为 0 或 1 个元素）
 */
export const processMenu = (route: AppRoute.RouteVO, parentPath = "", depth = 0): MenuOption[] => {
  if (depth > MAX_DEPTH) {
    console.warn(`[Menu]: 菜单层级超过 ${MAX_DEPTH} 层，路径：${route.path}`);

    return [];
  }

  const { meta = {}, children = [], name = "" } = route;
  const { alwaysShow, title, icon, params, hidden } = meta;

  // 隐藏节点（如登录页、错误页）不加入菜单
  if (hidden) return [];

  const currentPath = resolvePath(parentPath, route.path ?? "");

  // 尝试单子节点提升，成功则直接返回，不再构建父节点
  const hoisted = tryHoistSingleChild(children, alwaysShow, currentPath, depth, icon);

  if (hoisted) return hoisted;

  // 递归构建子菜单项
  const childItems =
    children.length > 0
      ? children.flatMap((child) => processMenu(child, currentPath, depth + 1))
      : [];

  // 无子菜单、路径为空、且未强制显示时，此节点无意义，跳过
  if (!childItems.length && !currentPath && !alwaysShow) return [];

  return [
    {
      label: generateLabel(currentPath, String(name), title, params, childItems.length > 0),
      key: currentPath,
      icon: getMenuIcon(icon),
      // 有子菜单时才挂载 children，避免 Naive UI 将其渲染为可展开目录
      ...(childItems.length > 0 && { children: childItems }),
    },
  ];
};

// #region 类型转换

/**
 * 将 Vue Router 的 RouteRecordRaw 转换为项目内部使用的 RouteVO 格式。
 *
 * 主要用于将常量路由（constantRoutes）中的公共路由（首页、个人中心等）
 * 统一转换为 RouteVO，以便与后端返回的动态路由合并后一起生成侧边菜单。
 *
 * 转换时清空 component 字段（菜单生成不需要组件引用），
 * 并递归转换 children。
 *
 * @param route - Vue Router 路由记录
 * @returns 对应的 RouteVO 对象
 */
export const toRouteVO = (route: RouteRecordRaw): AppRoute.RouteVO => ({
  path: route.path,
  name: String(route.name ?? ""),
  meta: route.meta,
  component: undefined,
  children: (route.children ?? []).map(toRouteVO),
});
