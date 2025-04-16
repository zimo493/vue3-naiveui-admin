declare namespace Notice {
  /** 通知公告分页查询参数 */
  interface Query extends PageQuery {
    /** 标题 */
    title?: string;
    /** 发布状态(0：未发布，1：已发布，-1：已撤回) */
    publishStatus?: number;
    isRead?: number;
  }

  /** 通知公告表单对象 */
  interface Form {
    id?: string;
    /** 通知标题 */
    title?: string;
    /** 通知内容 */
    content?: string;
    /** 通知类型 */
    type?: number;
    /** 优先级(L：低，M：中，H：高) */
    level?: string;
    /** 目标类型(1-全体 2-指定) */
    targetType?: number;
    /** 目标ID合集 */
    targetUserIds?: string[];
  }

  /** 通知公告分页对象 */
  interface VO {
    id: string;
    /** 通知标题 */
    title?: string;
    /** 通知内容 */
    content?: string;
    /** 通知类型 */
    type?: number;
    /** 发布人 */
    publisherId?: bigint;
    /** 优先级(0-低 1-中 2-高) */
    priority?: number;
    /** 目标类型(0-全体 1-指定) */
    targetType?: number;
    /** 发布状态(0-未发布 1已发布 2已撤回) */
    publishStatus?: number;
    /** 创建时间 */
    createTime?: Date;
    /** 发布时间 */
    publishTime?: Date;
    /** 撤回时间 */
    revokeTime?: Date;
    /** 通知等级 */
    level?: string;
  }

  interface DetailVO {
    /** 通知ID */
    id?: string;
    /** 通知标题 */
    title?: string;
    /** 通知内容 */
    content?: string;
    /** 通知类型 */
    type?: number;
    /** 发布人 */
    publisherName?: string;
    /** 优先级(L-低 M-中 H-高) */
    level?: string;
    /** 发布时间 */
    publishTime?: Date;
    /** 发布状态 */
    publishStatus?: number;
    /** 目标ID合集 */
    targetUserIds?: string[];
  }
}
