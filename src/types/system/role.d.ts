declare namespace Role {
  /** 角色分页查询参数 */
  interface Query extends PageQuery {
    /** 搜索关键字 */
    keywords?: string;
  }
  /** 角色分页对象 */
  interface VO {
    /** 角色ID */
    id: string;
    /** 角色编码 */
    code?: string;
    /** 角色名称 */
    name?: string;
    /** 排序 */
    sort?: number;
    /** 角色状态 */
    status?: number;
    /** 创建时间 */
    createTime?: Date;
    /** 修改时间 */
    updateTime?: Date;
  }

  /** 角色表单对象 */
  interface Form {
    /** 角色ID */
    id?: string;
    /** 角色编码 */
    code?: string;
    /** 数据权限 */
    dataScope?: number;
    /** 角色名称 */
    name?: string;
    /** 排序 */
    sort?: number;
    /** 角色状态(1-正常；0-停用) */
    status?: number;
  }
}
