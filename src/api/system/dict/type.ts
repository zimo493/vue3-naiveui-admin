import { get } from "@/utils";

const DICT_BASE_URL = "/api/v1/dicts";

export default {
  /**
   * 字典分页列表
   *
   * @param params 查询参数
   * @returns 字典分页结果
   */
  getPage: (params: DictType.Query) =>
    get<PageResult<DictType.VO[]>>(`${DICT_BASE_URL}/page`, params),
};
