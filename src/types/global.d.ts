interface Window {
  $loadingBar: import("naive-ui").LoadingBarApi;
  $dialog: import("naive-ui").DialogApi;
  $message: import("naive-ui").MessageApi;
  $notification: import("naive-ui").NotificationApi;
}

type ThemeColor = "default" | "error" | "primary" | "info" | "success" | "warning";

type Recordable<T = any> = Record<string, T>;

declare namespace App {
  type lang = "zhCN" | "enUS" | "zhTW";
}

/**
 * 响应数据
 */
interface Result<T> {
  code: number;
  msg: string;
  data: T;
}

/**
 * 分页查询参数
 */
interface PageQuery {
  pageNum: number;
  pageSize: number;
}

/**
 * 分页响应对象
 */
interface PageResult<T> {
  code: number;
  msg: string;
  /** 数据列表 */
  rows: T;
  /** 总数 */
  total: number;
}

// LocalStorage
interface Local {
  /* 存储访问token */
  accessToken: string;
  /* 语言 */
  lang: App.lang;
}

// SessionStorage
interface Session {}
