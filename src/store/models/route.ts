import { type MenuOption } from "naive-ui";
import { store } from "@/store";
import { router } from "@/router";
import { useAuthStoreHook } from "..";
import MenuAPI from "@/api/system/menu";
import constantRoutes from "@/router/modules/routes";
import { $t, isHttpUrl, joinPaths, processMenu, parseDynamicRoutes, toRouteVO } from "@/utils";

/**
 * 权限快照刷新的单飞 Promise。
 * 值为 null 时表示当前没有正在进行的刷新任务。
 */
let _snapshotPromise: Promise<boolean> | null = null;

export const useRouteStore = defineStore("route-store", {
  state: (): Status.Routes => ({
    menus: [],
    routes: [],
    activeMenu: "",
    isInitAuthRoute: false,
  }),

  actions: {
    /**
     * 刷新权限快照（单飞模式）。
     *
     * "单飞"（Single Flight）：同一时刻若已有刷新任务在进行，
     * 后续调用直接复用同一个 Promise，不重复发起请求。
     * 任务完成（无论成功或失败）后自动清除 Promise，允许下次正常触发。
     *
     * 典型使用场景：
     * - Token 续签后需要重新拉取权限。
     * - 403 页面提供"刷新权限"按钮。
     * - 多个组件同时检测到权限失效并发触发刷新。
     *
     * @returns 初始化是否成功
     */
    reloadPermissionSnapshotOnce(): Promise<boolean> {
      // 已有进行中的任务，直接复用，防止重复请求
      if (_snapshotPromise) return _snapshotPromise;

      _snapshotPromise = this.initAuthRoute()
        .catch(() => false) // 捕获 initAuthRoute 未处理的异常，统一返回 false
        .finally(() => {
          // 任务结束后无论成败都清空，允许下次正常触发
          _snapshotPromise = null;
        });

      return _snapshotPromise;
    },

    /**
     * 拉取用户信息并完整初始化动态路由与菜单。
     *
     * 执行流程：
     * 1. 重置 isInitAuthRoute 标志，防止路由守卫误判为已初始化。
     * 2. 获取用户信息（含角色/权限），失败则清除登录态并返回 false。
     * 3. 请求当前用户的动态路由列表，失败则提示并返回 false。
     * 4. 注册动态路由到 Vue Router（createRoutes）。
     * 5. 合并公共路由与动态路由，生成侧边菜单（createMenus）。
     * 6. 标记初始化完成，返回 true。
     *
     * @returns 初始化是否成功
     */
    async initAuthRoute(): Promise<boolean> {
      // 重置标志，确保路由守卫在本次初始化完成前不会放行
      this.isInitAuthRoute = false;

      const authStore = useAuthStoreHook();

      // 1: 获取用户信息（角色、权限等）
      try {
        await authStore.getUserInfo();
      } catch {
        // 获取失败通常意味着 Token 失效，清除登录态，由守卫跳转登录页
        await authStore.resetAuthStore();

        return false;
      }

      // 2: 获取当前用户有权访问的动态路由列表
      const data = await MenuAPI.getRoutes();

      if (!data) {
        window.$message?.error("获取路由失败!");

        return false;
      }

      // 3: 注册路由 & 生成菜单
      try {
        // 注册动态路由到 Vue Router，同时设置各级 redirect
        this.createRoutes(data);

        // 将常量路由中的公共页面（首页、个人中心等）转换为 RouteVO，
        // 与动态路由合并后统一生成侧边菜单，确保公共页面也出现在菜单中。
        // 注意：Root（"/"）本身是 Layout 容器，不作为菜单项，只取其 children。
        const publicRoutes: AppRoute.RouteVO[] = constantRoutes
          .flatMap((route) => (route.path === "/" && route.children ? route.children : route))
          .map(toRouteVO);

        this.createMenus(publicRoutes.concat(data));

        // 标记初始化完成，路由守卫后续调用可直接放行
        this.isInitAuthRoute = true;

        return true;
      } catch (error) {
        console.error("[Route]: 初始化路由失败", error);
        window.$message?.error($t("message.initRouteError"));

        return false;
      }
    },

    /**
     * 将动态路由注册到 Vue Router，并更新 store 中的路由快照。
     *
     * 执行顺序：
     * 1. 先调用 setRedirect 设置各层 redirect（操作原始 RouteVO，
     *    必须在 parseDynamicRoutes 拍平之前，否则树形结构已被破坏）。
     * 2. 调用 parseDynamicRoutes 将 RouteVO 转换为 RouteRecordRaw。
     * 3. 逐条 addRoute 注册到运行时路由表。
     * 4. 将常量路由与动态路由合并保存，供其他模块（如面包屑）读取。
     *
     * @param userRoutes - 后端返回的用户动态路由（RouteVO 格式，树形结构）
     */
    createRoutes(userRoutes: AppRoute.RouteVO[]) {
      if (!userRoutes.length) return;

      // 先设置 redirect，再拍平（保证树形结构完整时进行递归）
      this.setRedirect(userRoutes);

      const routes = parseDynamicRoutes(userRoutes);

      routes.forEach((route) => router.addRoute(route));

      // 保存完整路由快照（常量 + 动态），供面包屑、标签页等功能使用
      this.routes = constantRoutes.concat(routes);
    },

    /**
     * 递归为路由树中每个有子路由的节点设置 redirect，
     * 使其默认重定向到第一个非外链子路由。
     *
     * 作用：用户访问父级路径（如 /system）时，自动跳转到第一个子页面
     * （如 /system/user），避免出现空白页或 404。
     *
     * 注意：外链路由（HTTP URL）不设置 redirect，直接跳过。
     *
     * @param routes     - 待处理的路由数组（树形）
     * @param parentPath - 父级路由的完整路径，递归时传入，初始为空字符串
     */
    setRedirect(routes: AppRoute.RouteVO[], parentPath = "") {
      for (const route of routes) {
        // 外链路由不参与 redirect 逻辑
        if (isHttpUrl(route.path)) continue;

        const currentPath = joinPaths(parentPath, route.path);

        if (route.children?.length) {
          // 找第一个非外链子路由作为 redirect 目标
          const firstValid = route.children.find((item) => !isHttpUrl(item.path));

          if (firstValid) {
            route.redirect = joinPaths(currentPath, firstValid.path);
          }

          // 递归处理子层级
          this.setRedirect(route.children, currentPath);
        }
      }
    },

    /**
     * 根据路由配置生成 Naive UI 侧边菜单数据。
     *
     * 处理逻辑：
     * - 调用 processMenu 将每条 RouteVO 转换为 MenuOption。
     * - 过滤掉 key 为 undefined 的无效项（通常是 hidden 路由或异常数据）。
     *
     * 菜单数据存入 state.menus，由侧边栏组件直接消费。
     *
     * @param userRoutes - 已合并公共路由的完整路由列表（RouteVO 格式）
     */
    createMenus(userRoutes: AppRoute.RouteVO[]) {
      this.menus = userRoutes
        .flatMap((route) => processMenu(route))
        .filter((menu): menu is MenuOption => menu.key !== undefined) as any;
    },

    /**
     * 设置当前高亮的菜单项 key。
     *
     * 由 beforeResolve 钩子调用，key 通常取自 route.fullPath（去掉 query）
     * 或 route.meta.activeMenu（用于在子页面中手动指定高亮的父菜单）。
     *
     * 相同 key 不重复赋值，避免触发不必要的响应式更新。
     *
     * @param key - 菜单项的 key（与路由 fullPath 对应）
     */
    setActiveMenu(key: string) {
      if (key && key !== this.activeMenu) {
        this.activeMenu = key;
      }
    },

    /**
     * 从 Vue Router 中移除所有动态路由，仅保留常量路由。
     *
     * 实现方式：
     * 1. 收集所有常量路由（含其直接子路由）的 name 到 Set。
     * 2. 遍历当前运行时路由表，将不在 Set 中的路由逐一 removeRoute。
     *
     * 使用场景：退出登录或切换账号时，需要清除上一个用户的权限路由，
     * 防止新账号在未刷新页面的情况下访问到旧账号的页面。
     */
    resetDynamicRoutes() {
      // 构建常量路由 name 白名单（含一级子路由，如 Home、Profile）
      const constantNames = new Set(
        constantRoutes.flatMap((route) => [
          route.name,
          ...(route.children?.map((c) => c.name) ?? []),
        ])
      );

      // 移除所有不在白名单中的路由
      router.getRoutes().forEach((route) => {
        if (route.name && !constantNames.has(route.name)) {
          router.removeRoute(route.name);
        }
      });
    },

    /**
     * 完整重置路由模块：移除动态路由 + 重置 store 状态至初始值。
     *
     * 应在以下时机调用：
     * - 用户主动退出登录。
     * - Token 失效被动登出。
     * - 切换账号前的清理。
     *
     * 调用顺序：先 resetDynamicRoutes（操作 Vue Router），
     * 再 $reset（清空 Pinia state），避免组件在 state 清空后
     * 仍短暂读取到旧的菜单/路由数据。
     */
    resetRouteStore() {
      this.resetDynamicRoutes();
      this.$reset();
    },
  },
});

/** 在 setup 外部（如路由守卫）获取 route store 实例的便捷函数 */
export const useRouteStoreHook = () => useRouteStore(store);
