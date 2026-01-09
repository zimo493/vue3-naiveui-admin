import { del, get, post, put } from "@/utils";

const CONFIG_BASE_URL = "/api/v1/configs";

export default {
  /**
   * 系统配置分页列表
   * @param params 查询参数
   */
  getPage: (params?: Config.Query) => get<PageResult<Config.VO>>(`${CONFIG_BASE_URL}`, params),

  /**
   * 获取系统配置表单数据
   * @param id 系统配置id
   */
  getFormData: (id: string) => get<Config.Form>(`${CONFIG_BASE_URL}/${id}/form`),

  /**
   * 新增系统配置
   * @param data 系统配置表单数据
   */
  create: (data: Config.Form) => post(`${CONFIG_BASE_URL}`, data),

  /**
   * 修改系统配置
   * @param id 系统配置id
   * @param data 系统配置表单数据
   */
  update: (id: string, data: Config.Form) => put(`${CONFIG_BASE_URL}/${id}`, data),

  /**
   * 删除系统配置
   * @param id 系统配置id
   */
  deleteById: (id: string) => del(`${CONFIG_BASE_URL}/${id}`),

  /**
   * 刷新系统配置缓存
   */
  refreshCache: () => put(`${CONFIG_BASE_URL}/refresh`),
};
