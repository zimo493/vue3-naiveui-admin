import { store } from "@/store";
import { local } from "@/utils";

import AuthAPI from "@/api/auth";
import UserAPI from "@/api/system/user";

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
            // clearSessionAndCache();
            window.$message.success("退出成功");
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
    clearSessionAndCache() {
      return new Promise<void>((resolve) => {
        // clearToken();
        // usePermissionStoreHook().resetRouter();
        // useDictStoreHook().clearDictCache();
        // this.userInfo = {
        //   roles: [],
        //   perms: [],
        // };
        this.$reset();
        local.clear();
        resolve();
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
