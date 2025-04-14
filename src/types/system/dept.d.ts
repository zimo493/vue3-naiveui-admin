declare namespace Dept {
  /** 部门查询参数 */
  interface Query {
    /** 搜索关键字 */
    keywords?: string;
    /** 状态 */
    status?: number;
  }

  /** 部门类型 */
  interface VO {
    /** 子部门 */
    children?: VO[];
    /** 创建时间 */
    createTime?: Date;
    /** 部门ID */
    id: string;
    /** 部门名称 */
    name?: string;
    /** 部门编号 */
    code?: string;
    /** 父部门ID */
    parentid?: string;
    /** 排序 */
    sort?: number;
    /** 状态(1:启用；0:禁用) */
    status?: number;
    /** 修改时间 */
    updateTime?: Date;
  }

  /** 部门表单类型 */
  interface Form {
    /** 部门ID(新增不填) */
    id?: string;
    /** 部门名称 */
    name?: string;
    /** 部门编号 */
    code?: string;
    /** 父部门ID */
    parentId?: string;
    /** 排序 */
    sort?: number;
    /** 状态(1:启用；0：禁用) */
    status?: number;
  }
}
