declare namespace Config {
  interface Query extends BaseQueryParams {
    /** 搜索关键字 */
    keywords?: string;
  }

  /** 系统配置表单对象 */
  interface Form {
    /** 主键 */
    id?: string;
    /** 配置名称 */
    configName?: string;
    /** 配置键 */
    configKey?: string;
    /** 配置值 */
    configValue?: string;
    /** 描述、备注 */
    remark?: string;
  }

  /** 系统配置分页对象 */
  interface VO {
    /** 主键 */
    id: string;
    /** 配置名称 */
    configName?: string;
    /** 配置键 */
    configKey?: string;
    /** 配置值 */
    configValue?: string;
    /** 描述、备注 */
    remark?: string;
  }
}
