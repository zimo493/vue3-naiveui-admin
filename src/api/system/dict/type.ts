import { del, get, post, put } from "@/utils";

const DICT_BASE_URL = "/api/v1/dicts";

export default {
  /**
   * 字典分页列表
   * @param params 查询参数
   */
  getPage: (params: DictType.Query) =>
    get<PageResult<DictType.VO[]>>(`${DICT_BASE_URL}/page`, params),

  /**
   * 字典列表
   */
  getList: () => get<OptionType[]>(`${DICT_BASE_URL}`),

  /**
   * 字典表单数据
   * @param id 字典id
   */
  getFormData: (id: string) => get<DictType.Form>(`${DICT_BASE_URL}/${id}/form`),

  /**
   * 新增字典
   * @param data 字典表单数据
   */
  create: (data: DictType.Form) => post(`${DICT_BASE_URL}`, data),

  /**
   * 修改字典
   * @param id 字典id
   * @param data 字典表单数据
   */
  update: (id: string, data: DictType.Form) => put(`${DICT_BASE_URL}/${id}`, data),

  /**
   * 删除字典
   * @param ids 字典id，多个以英文逗号(,)分隔
   */
  deleteByIds: (ids: string) => del(`${DICT_BASE_URL}/${ids}`),
};
