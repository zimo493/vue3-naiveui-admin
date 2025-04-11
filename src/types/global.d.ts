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
  /** 数据列表 */
  list: T;
  /** 总数 */
  total: number;
}

// LocalStorage
interface Local {
  /* 存储访问token */
  accessToken: string;
  /* 刷新token */
  refreshToken: string;
  /* 语言 */
  lang: App.lang;
}

// SessionStorage
interface Session {
  sessionObj: {
    url?: string;
    data: any;
    time: number;
  };
}

// 抽屉表单
interface DrawerModal {
  title: string; // 标题
  visible: boolean; // 是否显示
}
