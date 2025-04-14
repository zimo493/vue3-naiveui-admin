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

// 表格展开、收起
interface TableExpand {
  isExpandAll: boolean; // 全部展开
  show: boolean; // 是否显示 用于切换展开\收起
  expandedRowKeys?: Array<number | string>; // 默认展开的行
}

// 抽屉表单
interface DrawerModal {
  title: string; // 标题
  visible: boolean; // 是否显示
}

/**
 * 下拉选项数据类型
 */
interface OptionType {
  /** 值 */
  value: string | number;
  /** 文本 */
  label: string;
  /** 子列表  */
  children?: OptionType[];
}

/**
 * 导入结果
 */
interface ExcelResult {
  /** 状态码 */
  code: string;
  /** 无效数据条数 */
  invalidCount: number;
  /** 有效数据条数 */
  validCount: number;
  /** 错误信息 */
  messageList: Array<string>;
}
