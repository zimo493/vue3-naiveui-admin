import type { App } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import { constantRoutes } from "./modules/ruotes";
import { setupRouterGuard } from "./modules/guard";

export const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
});

// 安装vue路由
export const installRouter = async (app: App) => {
  // 添加路由守卫
  setupRouterGuard(router);
  app.use(router);
  await router.isReady(); // https://router.vuejs.org/zh/api/index.html#isready
};
