import type { RouteRecordRaw } from "vue-router";
import { homeIcon } from "@/modules/assets";

// 公共路由
export default <RouteRecordRaw[]>[
  {
    path: "/",
    name: "Root",
    redirect: "/home",
    component: () => import("@/layout"),
    children: [
      {
        path: "/home",
        component: () => import("@/views/index/index.vue"),
        name: "Home", // 用于 `i18n` 国际化翻译键
        meta: { title: "首页", icon: homeIcon, affix: true },
      },
      {
        path: "/profile",
        name: "Profile",
        component: () => import("@/views/profile"),
        meta: {
          title: "个人中心",
          icon: "material-symbols:person-edit-sharp",
          hidden: true,
        },
      },
    ],
  },
  {
    path: "/test",
    name: "Test",
    component: () => import("@/views/test.vue"),
    meta: { title: "组件测试页", icon: "icon-park-outline:test-tube", hidden: true },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: { title: "登录", hidden: true },
  },
  {
    path: "/fitScreen",
    name: "FitScreen",
    component: () => import("@/views/fitScreen/index.vue"),
    meta: { title: "数据大屏", hidden: true },
  },
  {
    path: "/403",
    name: "Forbidden",
    component: () => import("@/views/error/403"),
    meta: { title: "用户无权限", hidden: true },
  },
  {
    path: "/404",
    name: "NotFound",
    component: () => import("@/views/error/404"),
    meta: { title: "找不到页面", icon: "icon-park-outline:ghost", hidden: true },
  },
  {
    path: "/500",
    name: "ServerError",
    component: () => import("@/views/error/500"),
    meta: { title: "服务器错误", icon: "icon-park-outline:close-wifi", hidden: true },
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/error/404"),
    name: "NotFoundRoute",
    meta: { title: "找不到页面", icon: "icon-park-outline:ghost", hidden: true },
  },
];
