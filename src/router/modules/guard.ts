import { useAppStore, useRouteStore } from "@/store";
import { local } from "@/utils";
import type { Router } from "vue-router";

export const setupRouterGuard = (router: Router) => {
  const appStore = useAppStore();
  const routeStore = useRouteStore();

  router.beforeEach(async (to, from, next) => {
    // 开始 loadingBar
    if (appStore.showProgress) {
      window.$loadingBar?.start();
    }

    // 判断有无TOKEN,登录鉴权
    const isLogin = Boolean(local.get("accessToken"));

    if (!isLogin) {
      if (to.name === "login") {
        next();
      } else {
        next(`/login?redirect=${to.path}`);
      }

      return false;
    }

    // 判断路由有无进行初始化
    if (!routeStore.isInitAuthRoute) {
      await routeStore.initAuthRoute();

      // 动态路由加载完回到根路由
      if (to.name === "404") {
        next({
          path: to.fullPath,
          replace: true,
          query: to.query,
          hash: to.hash,
        });

        return false;
      }
    }

    // 判断当前页是否在login,则定位去首页
    if (to.name === "login") {
      next({ path: "/" });

      return false;
    }

    next();
  });
  router.beforeResolve(async (to) => {
    // // 添加tabs
    // tabStore.addTab(to);
    // // 设置菜单高亮
    routeStore.setActiveMenu(
      typeof to.meta.activeMenu === "string" ? to.meta.activeMenu : to.fullPath
    );
    // // 设置高亮标签;
    // await tabStore.setCurrentTab(to.path as string);
  });

  router.afterEach((to) => {
    console.log(to);

    // 修改网页标题
    document.title = to.meta.title ?? "管理系统";
    // 结束 loadingBar
    if (appStore.showProgress) {
      window.$loadingBar?.finish();
    }
  });
};
