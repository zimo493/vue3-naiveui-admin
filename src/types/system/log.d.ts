declare namespace Log {
  /**
   * 日志分页查询对象
   */
  export interface Query extends BaseQueryParams {
    /** 搜索关键字 */
    keywords?: string;
    /** 操作时间 */
    createTime?: [string, string];
  }

  /**
   * 系统日志分页VO
   */
  export interface VO {
    /** 主键 */
    id: string;
    /** 日志模块 */
    module: string;
    /** 日志内容 */
    content: string;
    /** 请求路径 */
    requestUri: string;
    /** 请求方法 */
    method: string;
    /** IP 地址 */
    ip: string;
    /** 地区 */
    region: string;
    /** 浏览器 */
    browser: string;
    /** 终端系统 */
    os: string;
    /** 执行时间(毫秒) */
    executionTime: number;
    /** 操作人 */
    operator: string;
  }

  /**  访问趋势视图对象 */
  interface VisitTrendVO {
    /** 日期列表 */
    dates: string[];
    /** 浏览量(PV) */
    pvList: number[];
    /** 访客数(UV) */
    uvList: number[];
    /** IP数 */
    ipList: number[];
  }

  /** 访问趋势查询参数 */
  interface VisitTrendQuery {
    /** 开始日期 */
    startDate: string;
    /** 结束日期 */
    endDate: string;
  }

  /**  访问统计 */
  interface VisitStatsVO {
    /** 今日访客数(UV) */
    todayUvCount: number;
    /** 总访客数 */
    totalUvCount: number;
    /** 访客数同比增长率（相对于昨天同一时间段的增长率） */
    uvGrowthRate: number;
    /** 今日浏览量(PV) */
    todayPvCount: number;
    /** 总浏览量 */
    totalPvCount: number;
    /** 同比增长率（相对于昨天同一时间段的增长率） */
    pvGrowthRate: number;
  }
}
