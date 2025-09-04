import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import axios from "axios";
import qs from "qs";
import { useAuthStoreHook } from "@/store";
import { ResultEnum } from "@/enums";
import { local, session } from "./storage";
import { InquiryBox, tansParams } from "./comm";
import { router } from "@/router";
import { $t } from "./i18n";

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: import.meta.env.VITE_APP_TIMEOUT,
  headers: { "Content-Type": "application/json;charset=utf-8" },
  paramsSerializer: (params) => qs.stringify(params),
});
// 请求拦截器处理
const reqOnFulfilled = (config: InternalAxiosRequestConfig) => {
  // 是否需要设置 token
  const isToken = (config.headers || {}).isToken === false;

  // 是否需要防止数据重复提交
  const isRepeatSubmit = (config.headers || {}).repeatSubmit === false;
  const accessToken = local.get("accessToken");

  if (accessToken && !isToken) {
    config.headers.Authorization = "Bearer " + accessToken; // 让每个请求携带自定义token 请根据实际情况自行修改
  }

  // get请求映射params参数
  if (config.method?.toLocaleLowerCase() === "get" && config.params) {
    let url = config.url + "?" + tansParams(config.params);

    url = url.slice(0, -1);
    config.params = {};
    config.url = url;
  }

  if (
    !isRepeatSubmit &&
    (config.method?.toLocaleLowerCase() === "post" || config.method?.toLocaleLowerCase() === "put")
  ) {
    const requestObj = {
      url: config.url,
      data: typeof config.data === "object" ? JSON.stringify(config.data) : config.data,
      time: new Date().getTime(),
    };
    const requestSize = Object.keys(JSON.stringify(requestObj)).length; // 请求数据大小
    const limitSize = 5 * 1024 * 1024; // 限制存放数据5M

    if (requestSize >= limitSize) {
      console.warn(`[${config.url}]: 请求数据大小超出允许的5M限制,无法进行防重复提交验证。`);

      return config;
    }
    const sessionObj = session.get("sessionObj");

    if (!sessionObj) {
      session.set("sessionObj", requestObj);
    } else {
      const s_url = sessionObj.url; // 请求地址
      const s_data = sessionObj.data; // 请求数据
      const s_time = sessionObj.time; // 请求时间
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
  const { code, data, msg } = response.data;

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
      return handleTokenRefresh(config);
    } else if (code === ResultEnum.REFRESH_TOKEN_INVALID) {
      // 刷新 Token 过期，跳转登录页
      await handleSessionExpired();

      return Promise.reject(new Error(msg || "Error"));
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
    let { message } = error;

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

// get 请求
export async function get<T>(url: string, params?: unknown): Promise<T> {
  return await service.get<any, T>(url, { params });
}

// post 请求
export async function post<T = null>(url: string, data?: unknown, params?: unknown): Promise<T> {
  return await service.post<any, T>(url, data, { params });
}

// put 请求
export async function put<T = null>(url: string, data?: unknown, params?: unknown): Promise<T> {
  return await service.put<any, T>(url, data, { params });
}

// delete 请求
export async function del<T = null>(url: string, params?: unknown): Promise<T> {
  return await service.delete<any, T>(url, { params });
}

// patch 请求
export async function patch<T = null>(url: string, data?: unknown): Promise<T> {
  return await service.patch<any, T>(url, data);
}

// 导出 axios 实例
export default service;

// 是否正在刷新标识，避免重复刷新
let isRefreshing = false;
// 因 Token 过期导致的请求等待队列
const waitingQueue: Array<() => void> = [];

// 刷新 Token 处理
async function handleTokenRefresh(config: InternalAxiosRequestConfig) {
  return new Promise((resolve) => {
    // 封装需要重试的请求
    const retryRequest = () => {
      config.headers.Authorization = `Bearer ${local.get("accessToken")}`;
      resolve(service(config));
    };

    waitingQueue.push(retryRequest);
    if (!isRefreshing) {
      isRefreshing = true;
      useAuthStoreHook()
        .refreshToken()
        .then(() => {
          // 依次重试队列中所有请求, 重试后清空队列
          waitingQueue.forEach((callback) => callback());
          waitingQueue.length = 0;
        })
        .catch(async (error) => {
          console.error("handleTokenRefresh error", error);
          // 刷新 Token 失败，跳转登录页
          await handleSessionExpired();
        })
        .finally(() => (isRefreshing = false));
    }
  });
}
// 处理会话过期
async function handleSessionExpired() {
  InquiryBox($t("common.sessionTimeout"))
    .then(async () => {
      await useAuthStoreHook().resetAuthStore();
      await router.replace("/login");
    })
    .catch((error) => {
      console.error("Error handling session timeout:", error);
    });
}
