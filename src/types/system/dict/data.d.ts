declare namespace DictData {
  interface Query extends PageQuery {
    /** 关键字(字典数据值/标签) */
    keywords?: string;

    /** 字典编码 */
    dictCode?: string;
  }

  interface VO {
    /**
     * 字典ID
     */
    id: string;
    /**
     * 字典编码
     */
    dictCode: string;
    /**
     * 字典数据值
     */
    value: string;
    /**
     * 字典数据标签
     */
    label: string;
    /**
     * 状态（1:启用，0:禁用)
     */
    status: number;
    /**
     * 字典排序
     */
    sort?: number;
  }

  export interface Form {
    /**
     * 字典ID
     */
    id?: string;
    /**
     * 字典编码
     */
    dictCode?: string;
    /**
     * 字典数据值
     */
    value?: string;
    /**
     * 字典数据标签
     */
    label?: string;
    /**
     * 状态（1:启用，0:禁用)
     */
    status?: number;
    /**
     * 字典排序
     */
    sort?: number;

    /**
     * 标签类型
     */
    tagType?: "success" | "warning" | "info" | "primary" | "danger" | "";
  }

  /** 字典项列表 */
  interface Option {
    /** 字典数据值 */
    value: string;

    /** 字典数据标签 */
    label: string;

    /** 标签类型 */
    tagType?: "" | "success" | "info" | "warning" | "danger" | "primary";
  }
}
