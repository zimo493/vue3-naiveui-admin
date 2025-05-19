import { del, get, post, put } from "@/utils";

const DICT_BASE_URL = "/api/v1/dicts";

export default {
  /**
   * 获取字典分页列表
   * @param dictCode 字典编码
   * @param params 查询参数
   */
  getDictItemPage: (dictCode: string, params: DictData.Query) =>
    get<PageResult<DictData.VO[]>>(`${DICT_BASE_URL}/${dictCode}/items/page`, params),

  /**
   * 获取字典项列表
   * @param dictCode 字典编码
   */
  getDictItems: (dictCode: string) => get<DictData.Option[]>(`${DICT_BASE_URL}/${dictCode}/items`),

  /**
   * 新增字典项
   * @param dictCode 字典编码
   * @param data 字典项表单数据
   */
  createDictItem: (dictCode: string, data: DictData.Form) =>
    post(`${DICT_BASE_URL}/${dictCode}/items`, data),

  /**
   * 获取字典项表单数据
   *
   * @param dictCode 字典编码
   * @param id 字典项id
   */
  getDictItemFormData: (dictCode: string, id: string) =>
    get<DictData.Form>(`${DICT_BASE_URL}/${dictCode}/items/${id}/form`),

  /**
   * 修改字典项
   * @param dictCode 字典编码
   * @param id 字典项id
   * @param data 字典项表单数据
   */
  updateDictItem: (dictCode: string, id: string, data: DictData.Form) =>
    put(`${DICT_BASE_URL}/${dictCode}/items/${id}`, data),

  /**
   * 删除字典项
   * @param dictCode 字典编码
   * @param ids 字典项id集合
   */
  deleteDictItems: (dictCode: string, ids: string) =>
    del(`${DICT_BASE_URL}/${dictCode}/items/${ids}`),
};
