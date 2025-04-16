import { del, get, post, put } from "@/utils";

const DICT_BASE_URL = "/api/v1/dicts";

export default {
  /**
   * 获取字典分页列表
   *
   * @returns 字典分页结果
   * @param dictCode
   * @param params
   */
  getDictItemPage: (dictCode: string, params: DictData.Query) =>
    get<PageResult<DictData.VO[]>>(`${DICT_BASE_URL}/${dictCode}/items/page`, params),

  /**
   * 获取字典项列表
   */
  getDictItems: (dictCode: string) => get<DictData.Option[]>(`${DICT_BASE_URL}/${dictCode}/items`),

  /**
   * 新增字典项
   */
  createDictItem: (dictCode: string, data: DictData.Form) =>
    post(`${DICT_BASE_URL}/${dictCode}/items`, data),

  /**
   * 获取字典项表单数据
   *
   * @param dictCode 字典编码
   * @param id 字典项ID
   * @returns 字典项表单数据
   */
  getDictItemFormData: (dictCode: string, id: string) =>
    get<DictData.Form>(`${DICT_BASE_URL}/${dictCode}/items/${id}/form`),

  /**
   * 修改字典项
   */
  updateDictItem: (dictCode: string, id: string, data: DictData.Form) =>
    put(`${DICT_BASE_URL}/${dictCode}/items/${id}`, data),

  /**
   * 删除字典项
   */
  deleteDictItems: (dictCode: string, ids: string) =>
    del(`${DICT_BASE_URL}/${dictCode}/items/${ids}`),
};
