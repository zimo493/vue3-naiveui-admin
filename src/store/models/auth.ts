import { store, useDictStoreHook, useRouteStoreHook, useTabStoreHook } from "@/store";
import { local, session } from "@/utils";

import AuthAPI from "@/api/auth";
import UserAPI from "@/api/system/user";
import { router } from "@/router";

export const useAuthStore = defineStore("auth-store", {
  state: (): Status.Auth => {
    return {
      userInfo: {
        roles: [],
        perms: [],
      },
    };
  },
  actions: {
    /**
     * 登录
     * @LoginFormData {LoginFormData} 登录表单数据
     * @returns Promise
     */
    login(LoginFormData: Auth.LoginFormData) {
      return new Promise<void>((resolve, reject) => {
        AuthAPI.login(LoginFormData)
          .then((data) => {
            const { accessToken, refreshToken } = data;

            local.set("accessToken", accessToken); // eyJhbGciOiJIUzI1NiJ9.xxx.xxx
            local.set("refreshToken", refreshToken);
            resolve();
          })
          .catch((error) => reject(error));
      });
    },
    /**
     * 获取用户信息
     * @returns Promise<User.Info>
     */
    getUserInfo() {
      return new Promise<User.Info>((resolve, reject) => {
        UserAPI.getInfo()
          .then((data) => {
            if (!data) {
              return reject("Verification failed, please Login again.");
            }
            Object.assign(this.userInfo, { ...data });
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    /**
     * 退出登录
     * @returns Promise<void>
     */
    logout() {
      return new Promise<void>((resolve, reject) => {
        AuthAPI.logout()
          .then(() => {
            this.resetAuthStore()
              .then(() => window.$message.success("退出成功"))
              .then(async () => await router.replace("/login"));
            resolve();
          })
          .catch((error) => reject(error));
      });
    },

    /**
     * 刷新token
     * @returns Promise<void>
     */
    refreshToken() {
      const refreshToken = local.get("refreshToken") ?? "";

      return new Promise<void>((resolve, reject) => {
        AuthAPI.refreshToken(refreshToken)
          .then((data) => {
            const { accessToken, refreshToken } = data;

            local.set("accessToken", accessToken);
            local.set("refreshToken", refreshToken);
            resolve();
          })
          .catch((error) => {
            console.log(" refreshToken  刷新失败", error);
            reject(error);
          });
      });
    },

    /**
     * 清除用户会话和缓存
     */
    async resetAuthStore() {
      const routeStore = useRouteStoreHook();
      const tabStore = useTabStoreHook();
      const dictStore = useDictStoreHook();

      // 清空路由
      routeStore.resetRouteStore();
      // 清空标签
      tabStore.clearAllTabs();
      // 清空字典
      dictStore.cleanDict();

      // 清除本地缓存
      local.clear();
      session.clear();

      // 重制当前存储库
      this.$reset();
      const route = unref(router.currentRoute);

      // 重定向到登录页
      await router.replace({
        name: "login",
        query: {
          redirect: route.fullPath,
        },
      });
    },
  },
});

/**
 * 用于在组件外部（如在Pinia Store 中）使用 Pinia 提供的 store 实例。
 * 官方文档解释了如何在组件外部使用 Pinia Store：
 * https://pinia.vuejs.org/core-concepts/outside-component-usage.html#using-a-store-outside-of-a-component
 */
export const useAuthStoreHook = () => useAuthStore(store);
