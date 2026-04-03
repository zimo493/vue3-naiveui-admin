import { useAppStoreHook, useRouteStoreHook, useTabStoreHook } from "@/store";
import { local } from "@/utils";
import type { Router } from "vue-router";

const { pkg } = __APP_INFO__;

// 白名单
const whiteList = ["/login", "/fitScreen", "/test"];

export const setupRouterGuard = (router: Router) => {
  const appStore = useAppStoreHook();
  const routeStore = useRouteStoreHook();
  const tabStore = useTabStoreHook();

  router.beforeEach(async (to) => {
    // 开始 loadingBar
    if (appStore.showProgress) {
      window.$loadingBar?.start();
    }

    // 判断有无TOKEN,登录鉴权
    const isLogin = Boolean(local.get("accessToken"));

    if (!isLogin) {
      if (whiteList.includes(to.path)) {
        return true;
      } else {
        return `/login?redirect=${to.path}`;
      }
    }

    // 判断路由有无进行初始化
    if (!routeStore.isInitAuthRoute) {
      const isInitAuthRoute = await routeStore.initAuthRoute();

      if (!isInitAuthRoute) {
        return false;
      }

      // addRoute 后重新触发导航，让 router 用完整路由表重新匹配
      return { path: to.fullPath, replace: true, query: to.query, hash: to.hash };
    }

    // 判断当前页是否在login,则定位去首页
    if (to.name === "Login") {
      return { path: "/" };
    }

    return true;
  });

  router.beforeResolve(async (to) => {
    // 添加tabs
    tabStore.addTab(to);
    // 设置菜单高亮
    routeStore.setActiveMenu(
      typeof to.meta.activeMenu === "string" ? to.meta.activeMenu : to.fullPath.split("?")[0]
    );
    // 设置高亮标签
    await tabStore.setCurrentTab(to.fullPath);
  });

  router.afterEach((to) => {
    // 修改网页标题
    document.title = to.meta?.title ? to.meta?.title : pkg.name;
    // 结束 loadingBar
    if (appStore.showProgress) {
      window.$loadingBar?.finish();
    }
  });
};
