interface Window {
  $loadingBar: import("naive-ui").LoadingBarApi;
  $dialog: import("naive-ui").DialogApi;
  $message: import("naive-ui").MessageApi;
  $notification: import("naive-ui").NotificationApi;
}

type Recordable<T = any> = Record<string, T>;

declare namespace App {
  type lang = "zhCN" | "enUS" | "zhTW";
}

/**
 * 分页查询参数
 */
interface BaseQueryParams {
  pageNum: number;
  pageSize: number;
  sortBy?: string;
  order?: string;
}

/**
 * 分页元信息
 */
interface PageMeta {
  pageNum: number;
  pageSize: number;
  total: number;
}

/**
 * 分页响应对象
 */
interface PageResult<T> {
  /** 数据列表 */
  data: T[];
  /** 分页信息，不分页时为 null */
  page: PageMeta | null;
}

/** LocalStorage */
interface Local {
  /** 存储访问token */
  accessToken: string;
  /** 刷新token */
  refreshToken: string;
  /** 语言 */
  lang: App.lang;
  /** 菜单列表是否默认展开第一项 */
  isExpandFirstMenu: boolean;
  /** 手机验证码倒计时 */
  mobileCodeExpireTime: number;
  /** 邮箱验证码倒计时 */
  emailCodeExpireTime: number;

  /** 记住我 */
  remember: {
    username: string;
    password: string;
    rememberMe: boolean;
  };
}

/** SessionStorage */
interface Session {
  sessionObj: {
    url?: string;
    data: any;
    time: number;
  };
}

/** 表格展开、收起 */
interface TableExpand {
  isExpandAll: boolean; // 全部展开
  show: boolean; // 是否显示 用于切换展开\收起
  expandedRowKeys?: Array<number | string>; // 默认展开的行
}

/** 抽屉表单 */
interface FormModal {
  title: string; // 标题
  visible: boolean; // 是否显示
}

/**
 * 下拉选项数据类型
 */
interface OptionItem {
  /** 值 */
  value: string | number;
  /** 文本 */
  label: string;
  /** 子列表  */
  children?: OptionItem[];
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
