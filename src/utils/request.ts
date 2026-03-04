import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import axios from "axios";
import qs from "qs";
import { useAuthStoreHook } from "@/store";
import { useRouteStoreHook } from "@/store";
import { ResultEnum } from "@/enums";
import { local, session } from "./storage";
import { InquiryBox } from "./comm";
import { router } from "@/router";
import { $t } from "./i18n";

/**
 * 权限不足处理：刷新用户信息与路由，并提示用户
 */
async function handlePermissionDenied(msg?: string): Promise<never> {
  const routeStore = useRouteStoreHook();

  await routeStore.reloadPermissionSnapshotOnce();
  window.$message.error(msg || $t("common.noPermission"));

  return Promise.reject(new Error(msg || "Forbidden"));
}

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: import.meta.env.VITE_APP_TIMEOUT,
  headers: { "Content-Type": "application/json;charset=utf-8" },
  paramsSerializer: (params) => qs.stringify(params),
});
// 请求拦截器处理
const reqOnFulfilled = (config: InternalAxiosRequestConfig) => {
  const headers = config.headers || {};
  // 是否需要跳过 token 设置
  const skipToken = headers.isToken === false;
  // 是否需要防止数据重复提交
  const preventRepeatSubmit = headers.repeatSubmit !== false;
  const accessToken = local.get("accessToken");

  if (accessToken && !skipToken) {
    headers.Authorization = `Bearer ${accessToken}`; // 让每个请求携带自定义token 请根据实际情况自行修改
    config.headers = headers;
  }

  const method = config.method?.toLowerCase();

  if (preventRepeatSubmit && (method === "post" || method === "put")) {
    const requestObj = {
      url: config.url,
      data: typeof config.data === "object" ? JSON.stringify(config.data) : config.data,
      time: new Date().getTime(),
    };
    const requestSize = JSON.stringify(requestObj).length; // 请求数据大小
    const limitSize = 5 * 1024 * 1024; // 限制存放数据5M

    if (requestSize >= limitSize) {
      console.warn(`[${config.url}]: 请求数据大小超出允许的5M限制,无法进行防重复提交验证。`);

      return config;
    }
    const sessionObj = session.get("sessionObj");

    if (!sessionObj) {
      session.set("sessionObj", requestObj);
    } else {
      /**
       * - s_url 请求地址
       * - s_data 请求数据
       * - s_time 请求时间
       */
      const { url: s_url, data: s_data, time: s_time } = sessionObj;
      const interval = 1000; // 间隔时间(ms)，小于此时间视为重复提交

      if (
        s_data === requestObj.data &&
        requestObj.time - s_time < interval &&
        s_url === requestObj.url
      ) {
        const message = $t("common.processing");

        console.warn(`[${s_url}]: ` + message);

        return Promise.reject(new Error(message));
      } else {
        session.set("sessionObj", requestObj);
      }
    }
  }

  return config;
};

// 响应拦截器处理
const resOnFulfilled = (response: AxiosResponse) => {
  // 如果响应是二进制流，则直接返回，用于下载文件、Excel 导出等
  if (response.config.responseType === "blob") {
    return response;
  }
  const payload = response.data;
  const { code, data, msg } = payload;

  if (code === ResultEnum.SUCCESS) {
    return data;
  }

  window.$message.error(msg || $t("common.sysError"));

  return Promise.reject(new Error(msg || "Error"));
};

// 请求拦截器
service.interceptors.request.use(reqOnFulfilled, (error: AxiosError) => Promise.reject(error));
// 响应拦截器
service.interceptors.response.use(resOnFulfilled, async (error) => {
  const { config, response } = error;

  if (response?.data) {
    const { code, msg } = response.data;

    if (code === ResultEnum.ACCESS_TOKEN_INVALID) {
      // Token 过期，刷新 Token
      return retryWithRefresh(config);
    } else if (code === ResultEnum.REFRESH_TOKEN_INVALID) {
      // 刷新 Token 过期，跳转登录页
      await handleSessionExpired();

      return Promise.reject(new Error(msg || "Error"));
    } else if (code === ResultEnum.PERMISSION_DENIED) {
      return handlePermissionDenied(msg);
    } else if (code === ResultEnum.ERROR) {
      window.$message.error(msg);

      return Promise.reject(new Error(msg || "Error"));
    } else if (code === ResultEnum.CANNOT_OPERATE) {
      // 禁止用户操作（演示模式配合Nginx拦截使用）
      window.$message.warning($t("common.cannotOperate"));

      return Promise.reject(new Error($t("common.cannotOperate")));
    }
    window.$message.error(msg || $t("common.sysError"));
  } else {
    let message = error.message || $t("common.sysError");

    if (message === "Network Error") {
      message = $t("common.backendError");
    } else if (message.includes("timeout")) {
      message = $t("common.backendTimeout");
    } else if (message.includes("Request failed with status code")) {
      message = $t("common.backendException", { code: message.substring(message.length - 3) });
    }
    window.$message.error(message, { duration: 5 * 1000 });

    return Promise.reject(new Error(message));
  }

  return Promise.reject(error.message);
});

/**
 * 访问令牌过期后，自动刷新 token 并重试请求（单飞 + 最多重试一次）。
 */
async function retryWithRefresh(config: InternalAxiosRequestConfig): Promise<unknown> {
  const retryConfig = config as InternalAxiosRequestConfig & { __retry?: boolean };

  if (retryConfig.__retry) {
    await handleSessionExpired();

    return Promise.reject(new Error("Token Invalid"));
  }

  retryConfig.__retry = true;

  try {
    const authStore = useAuthStoreHook();

    await authStore.refreshTokenOnce();

    retryConfig.headers.Authorization = `Bearer ${local.get("accessToken")}`;

    return service(retryConfig);
  } catch {
    await handleSessionExpired();

    return Promise.reject(new Error("Token refresh failed"));
  }
}

// 处理会话过期
let isSessionExpiredShowing = false;

async function handleSessionExpired() {
  if (isSessionExpiredShowing) return;
  isSessionExpiredShowing = true;

  try {
    await InquiryBox($t("common.sessionTimeout"));
    await useAuthStoreHook().resetAuthStore();
    await router.replace("/login");
  } catch (error) {
    console.error("Error handling session timeout:", error);
  } finally {
    isSessionExpiredShowing = false;
  }
}

/**
 * 请求方法
 */
const request = {
  get: <T>(url: string, params?: unknown): Promise<T> => service.get(url, { params }),
  post: <T = null>(url: string, data?: unknown, params?: unknown): Promise<T> =>
    service.post(url, data, { params }),
  put: <T = null>(url: string, data?: unknown, params?: unknown): Promise<T> =>
    service.put(url, data, { params }),
  del: <T = null>(url: string, params?: unknown): Promise<T> => service.delete(url, { params }),
  patch: <T = null>(url: string, data?: unknown): Promise<T> => service.patch(url, data),
};

// 导出 axios 实例
export default service;
export const { get, post, put, del, patch } = request;
