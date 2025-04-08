import type { RouteRecordRaw } from "vue-router";

// 公共路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "登录",
      withoutTab: true,
    },
  },
  {
    path: "/403",
    name: "403",
    component: () => import("@/views/error/403"),
    meta: { title: "用户无权限", withoutTab: true },
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/error/404"),
    meta: {
      title: "找不到页面",
      icon: "icon-park-outline:ghost",
      withoutTab: true,
    },
  },
  {
    path: "/500",
    name: "500",
    component: () => import("@/views/error/500"),
    meta: {
      title: "服务器错误",
      icon: "icon-park-outline:close-wifi",
      withoutTab: true,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/error/404"),
    name: "404",
    meta: {
      title: "找不到页面",
      withoutTab: true,
      icon: "icon-park-outline:ghost",
    },
  },
];
