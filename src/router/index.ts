import type { App } from "vue";
import { createRouter, createWebHistory } from "vue-router";

export const router = createRouter({
  history: createWebHistory(),
  routes: [],
});

// 安装vue路由
export const installRouter = async (app: App) => {
  app.use(router);
  await router.isReady(); // https://router.vuejs.org/zh/api/index.html#isready
};
