import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import axios from "axios";
import qs from "qs";
import { useAuthStoreHook, useRouteStoreHook } from "@/store";
import { router } from "@/router";
import { ResultEnum } from "@/enums";
import { $t, InquiryBox, local } from ".";

// #region 防重复提交

interface RequestRecord {
  url: string | undefined;
  data: string;
  time: number;
}

/** 用 Map 按请求 key 存储最近一次提交记录，支持并发多条请求各自独立去重 */
const pendingRequests = new Map<string, RequestRecord>();

/** 两次相同请求的最小间隔（ms），小于此值视为重复提交 */
const REPEAT_INTERVAL_MS = 1000;

/** 请求体积上限，超过此值跳过去重检测（避免序列化开销） */
const MAX_BODY_SIZE = 5 * 1024 * 1024;

/**
 * 生成请求唯一键，格式为 `METHOD::url`。
 * 用于在 Map 中区分不同接口的提交记录。
 */
function buildRequestKey(config: InternalAxiosRequestConfig): string {
  return `${config.method?.toUpperCase()}::${config.url}`;
}

/**
 * 检测当前请求是否为重复提交。
 *
 * 与上一次同 key 请求对比：url、请求体、时间间隔三者同时满足时视为重复，直接 throw 中断请求。
 * 否则将本次请求记录写入 Map，供下次对比使用。
 */
function checkRepeatSubmit(config: InternalAxiosRequestConfig): void {
  const key = buildRequestKey(config);
  const data = typeof config.data === "object" ? JSON.stringify(config.data) : (config.data ?? "");

  if (JSON.stringify({ url: config.url, data }).length >= MAX_BODY_SIZE) {
    console.warn(`[${config.url}]: 请求数据超过 5M，跳过防重复提交检测`);

    return;
  }

  const prev = pendingRequests.get(key);
  const now = Date.now();

  if (prev && prev.data === data && now - prev.time < REPEAT_INTERVAL_MS) {
    const message = $t("common.processing");

    console.warn(`[${key}]: ${message}`);
    throw new Error(message);
  }

  pendingRequests.set(key, { url: config.url, data, time: now });
}

/**
 * 响应完成（无论成功或失败）后，从 Map 中移除对应请求记录。
 * 确保同一接口在前次请求结束后可以重新正常提交。
 */
function clearRepeatSubmit(config: InternalAxiosRequestConfig): void {
  pendingRequests.delete(buildRequestKey(config));
}

// #region Token 刷新单飞

/**
 * 全局唯一的 token 刷新 Promise。
 *
 * 当多个请求同时收到 401 时，只有第一个会真正发起刷新请求，
 * 其余请求共享同一个 Promise 排队等待结果，避免并发触发多次刷新。
 * 刷新完成（无论成功失败）后重置为 null，供下次使用。
 */
let refreshPromise: Promise<void> | null = null;

/**
 * 确保 token 刷新只执行一次（singleflight 模式）。
 *
 * 若刷新已在进行中，直接返回现有 Promise；否则发起新的刷新并缓存 Promise。
 */
async function ensureTokenRefreshed(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = useAuthStoreHook()
      .refreshTokenOnce()
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

// #region 会话过期

/**
 * 全局唯一的会话过期处理 Promise。
 *
 * 防止多个请求同时触发会话过期时，弹出多个确认框或重复跳转登录页。
 * 处理完成后重置为 null，以应对用户重新登录后再次过期的场景。
 */
let sessionExpiredPromise: Promise<void> | null = null;

/**
 * 处理会话过期：弹出提示 → 清空鉴权状态 → 跳转登录页。
 *
 * 并发调用时共享同一个 Promise，确保流程只执行一次。
 */
async function handleSessionExpired(): Promise<void> {
  if (sessionExpiredPromise) return sessionExpiredPromise;

  sessionExpiredPromise = (async () => {
    try {
      await InquiryBox($t("common.sessionTimeout"));
      await useAuthStoreHook().resetAuthStore();
      await router.replace("/login");
    } catch (error) {
      console.error("处理会话过期时出错:", error);
    } finally {
      sessionExpiredPromise = null;
    }
  })();

  return sessionExpiredPromise;
}

// #region 权限不足

/**
 * 处理权限不足（403）：重新加载权限快照以同步最新权限，并向用户展示错误提示。
 *
 * 权限快照刷新完成后仍 reject，由业务层决定是否做进一步处理（如页面跳转）。
 */
async function handlePermissionDenied(msg?: string): Promise<never> {
  await useRouteStoreHook().reloadPermissionSnapshotOnce();
  window.$message.error(msg || $t("common.noPermission"));

  return Promise.reject(new Error(msg || "Forbidden"));
}

// #region Axios 实例配置

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: import.meta.env.VITE_APP_TIMEOUT,
  headers: { "Content-Type": "application/json;charset=utf-8" },
  paramsSerializer: (params) => qs.stringify(params),
});

// #region 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const headers = config.headers ?? {};
    const skipToken = headers.isToken === false; // 跳过 token
    const preventRepeat = headers.repeatSubmit !== false; // 阻止重复提交
    const accessToken = local.get("accessToken");

    // 将 access token 注入 Authorization 请求头
    if (accessToken && !skipToken) {
      headers.Authorization = `Bearer ${accessToken}`;
      config.headers = headers;
    }

    const method = config.method?.toLowerCase();

    // POST / PUT 请求默认开启防重复提交检测，重复时直接 throw 中断请求
    if (preventRepeat && (method === "post" || method === "put")) {
      checkRepeatSubmit(config);
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// #region 响应拦截器

service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 响应完成后清理防重复提交记录，允许后续正常提交
    clearRepeatSubmit(response.config);

    // 二进制流直接透传，用于文件下载、Excel 导出等场景
    if (response.config.responseType === "blob") {
      return response;
    }

    const { code, data, msg } = response.data ?? {};

    // 业务成功，返回 data 字段，由调用方直接使用
    if (code === ResultEnum.SUCCESS) {
      return data;
    }

    // 业务失败，展示错误信息并 reject，统一由调用方 catch 处理
    window.$message.error(msg || $t("common.sysError"));

    return Promise.reject(new Error(msg || "Error"));
  },

  async (error: AxiosError<{ code: ResultEnum; msg: string }>) => {
    const { config, response } = error;

    // 无论请求成功或失败，均清理防重复提交记录
    if (config) clearRepeatSubmit(config);

    if (response?.data) {
      const { code, msg } = response.data;

      switch (code) {
        // access token 过期：尝试刷新 token 后自动重试原请求
        case ResultEnum.ACCESS_TOKEN_INVALID:
          return retryWithRefresh(config!);

        // refresh token 过期：无法续期，跳转登录页重新鉴权
        case ResultEnum.REFRESH_TOKEN_INVALID:
          await handleSessionExpired();

          return Promise.reject(new Error(msg || "Refresh token invalid"));

        // 权限不足：刷新权限快照并提示用户
        case ResultEnum.PERMISSION_DENIED:
          return handlePermissionDenied(msg);

        // 演示模式禁止操作（配合 Nginx 拦截使用）
        case ResultEnum.CANNOT_OPERATE:
          window.$message.warning($t("common.cannotOperate"));

          return Promise.reject(new Error($t("common.cannotOperate")));

        // 其他业务错误：统一展示后端返回的错误信息
        default:
          window.$message.error(msg || $t("common.sysError"));

          return Promise.reject(new Error(msg || "Error"));
      }
    }

    // 网络层错误（无 response）：将原始错误信息映射为用户友好文案
    const rawMessage = error.message || $t("common.sysError");
    const message = normalizeNetworkError(rawMessage);

    window.$message.error(message, { duration: 5000 });

    return Promise.reject(new Error(message));
  }
);

/**
 * 将 axios 网络层原始错误信息映射为用户友好的提示文案。
 *
 * 覆盖三类常见场景：断网、请求超时、HTTP 状态码异常。
 */
function normalizeNetworkError(message: string): string {
  if (message === "Network Error") return $t("common.backendError");
  if (message.includes("timeout")) return $t("common.backendTimeout");
  if (message.includes("Request failed with status code")) {
    const code = message.slice(-3);

    return $t("common.backendException", { code });
  }

  return message;
}

// #region Token 过期重试（单飞）

/** 扩展 axios 请求配置，标记该请求是否已经过重试，防止无限循环 */
type RetryableConfig = InternalAxiosRequestConfig & { __retry?: boolean };

/**
 * access token 过期后，自动刷新 token 并重试原请求（单飞 + 最多重试一次）。
 *
 * - `__retry` 标记用于防止重试请求再次触发刷新，形成无限循环。
 * - 刷新通过 `ensureTokenRefreshed` 实现单飞，多个并发的 401 只触发一次刷新。
 * - 刷新失败或重试后仍报错，均视为会话彻底失效，触发登出流程。
 */
async function retryWithRefresh(config: InternalAxiosRequestConfig): Promise<unknown> {
  const retryConfig = config as RetryableConfig;

  if (retryConfig.__retry) {
    // 已重试过仍失败，说明 refresh token 也已失效，执行登出
    await handleSessionExpired();

    return Promise.reject(new Error("Token invalid after retry"));
  }

  retryConfig.__retry = true;

  try {
    await ensureTokenRefreshed();
    retryConfig.headers.Authorization = `Bearer ${local.get("accessToken")}`;

    return service(retryConfig);
  } catch {
    await handleSessionExpired();

    return Promise.reject(new Error("Token refresh failed"));
  }
}

// #region 导出 Axios 实例

export default service;

/**
 * 语义化请求方法，统一封装 axios 的 get / post / put / del / patch。
 *
 * 泛型 `T` 对应后端响应 `data` 字段的类型（响应拦截器已将 `data` 直接返回）。
 *
 * @example
 * const user = await get<UserVO>('/api/user', { id: 1 })
 * const result = await post<void>('/api/user', { name: 'Mo' })
 */
export const request = {
  get: <T>(url: string, params?: unknown): Promise<T> => service.get(url, { params }),
  post: <T>(url: string, data?: unknown, params?: unknown): Promise<T> =>
    service.post(url, data, { params }),
  put: <T>(url: string, data?: unknown, params?: unknown): Promise<T> =>
    service.put(url, data, { params }),
  del: <T>(url: string, params?: unknown, data?: unknown): Promise<T> =>
    service.delete(url, { params, data }),
  patch: <T>(url: string, data?: unknown): Promise<T> => service.patch(url, data),
};

export const { get, post, put, del, patch } = request;
