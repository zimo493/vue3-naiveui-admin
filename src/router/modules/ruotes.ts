import type { RouteRecordRaw } from "vue-router";

const appRootRoutes: RouteRecordRaw = {
  path: "/",
  name: "Root",
  redirect: "/",
  component: () => import("@/layout"),
  children: [
    {
      path: "/",
      component: () => import("@/views/index/index.vue"),
      name: "Index", // 用于 keep-alive, 必须与SFC自动推导或者显示声明的组件name一致
      // https://cn.vuejs.org/guide/built-ins/keep-alive.html#include-exclude
      meta: {
        title: "首页",
        icon: "fluent-emoji-flat:house",
        affix: true,
        keepAlive: true,
      },
    },
    {
      path: "/profile",
      name: "Profile",
      component: () => import("@/views/profile"),
      meta: { title: "个人中心", icon: "material-symbols:person-edit-sharp" },
    },
  ],
};

// 公共路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/index.vue"),
    meta: { title: "登录", hidden: true },
  },
  {
    path: "/403",
    name: "403",
    component: () => import("@/views/error/403"),
    meta: { title: "用户无权限", hidden: true },
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/error/404"),
    meta: { title: "找不到页面", icon: "icon-park-outline:ghost", hidden: true },
  },
  {
    path: "/500",
    name: "500",
    component: () => import("@/views/error/500"),
    meta: { title: "服务器错误", icon: "icon-park-outline:close-wifi", hidden: true },
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/error/404"),
    name: "404",
    meta: { title: "找不到页面", icon: "icon-park-outline:ghost", hidden: true },
  },
];

export default appRootRoutes;
