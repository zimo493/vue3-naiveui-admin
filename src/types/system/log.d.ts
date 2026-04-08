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
    /** 日志ID */
    id: number;
    /** 模块 */
    module?: string;
    /** 操作类型 */
    actionType?: string;
    /** 操作标题 */
    title?: string;
    /** 自定义日志内容 */
    content?: string;
    /** 操作人ID */
    operatorId?: number;
    /** 操作人名称 */
    operatorName?: string;
    /** 请求路径 */
    requestUri?: string;
    /** 请求方法 */
    requestMethod?: string;
    /** IP地址 */
    ip?: string;
    /** 地区 */
    region?: string;
    /** 设备 */
    device?: string;
    /** 浏览器 */
    browser?: string;
    /** 操作系统 */
    os?: string;
    /** 状态：0失败 1成功 */
    status?: number;
    /** 执行时间(毫秒) */
    executionTime?: number;
    /** 错误信息 */
    errorMsg?: string;
    /** 操作时间 */
    createTime?: string;
  }

  /**  访问趋势视图对象 */
  interface VisitTrendVO {
    /** 日期列表 */
    dates: string[];
    /** 浏览量(PV) */
    pvList: number[];
    /** 访客数(UV) */
    uvList: number[];
  }

  /** 访问趋势查询参数 */
  interface VisitTrendQuery {
    /** 开始日期 */
    startDate: string;
    /** 结束日期 */
    endDate: string;
  }

  /**  访问统计 */
  interface VisitOverviewVO {
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
