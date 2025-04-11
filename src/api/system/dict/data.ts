import { get } from "@/utils";

const DICT_BASE_URL = "/api/v1/dicts";

export default {
  /**
   * 获取字典分页列表
   *
   * @param queryParams 查询参数
   * @returns 字典分页结果
   */
  getDictItemPage: (dictCode: string, params: DictData.Query) =>
    get<PageResult<DictData.VO[]>>(`${DICT_BASE_URL}/${dictCode}/items/page`, params),

  /**
   * 获取字典项列表
   */
  getDictItems: (dictCode: string) => get<DictData.Option[]>(`${DICT_BASE_URL}/${dictCode}/items`),
};
