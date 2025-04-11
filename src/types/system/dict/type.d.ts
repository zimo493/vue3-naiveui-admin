declare namespace DictType {
  // 查询
  interface Query extends PageQuery {
    /**
     * 关键字(字典名称/编码)
     */
    keywords?: string;

    /**
     * 字典状态（1:启用，0:禁用）
     */
    status?: number;
  }
  interface VO {
    /**
     * 字典ID
     */
    id: string;
    /**
     * 字典名称
     */
    name: string;
    /**
     * 字典编码
     */
    dictCode: string;
    /**
     * 字典状态（1:启用，0:禁用）
     */
    status: number;
  }
}
