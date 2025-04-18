import { del, get, post, put } from "@/utils";

const CONFIG_BASE_URL = "/api/v1/config";

export default {
  /** 系统配置分页 */
  getPage: (params?: Config.Query) =>
    get<PageResult<Config.VO[]>>(`${CONFIG_BASE_URL}/page`, params),

  /** 系统配置表单数据 */
  getFormData: (id: string) => get<Config.Form>(`${CONFIG_BASE_URL}/${id}/form`),

  /** 新增系统配置 */
  create: (data: Config.Form) => post(`${CONFIG_BASE_URL}`, data),

  /** 更新系统配置 */
  update: (id: string, data: Config.Form) => put(`${CONFIG_BASE_URL}/${id}`, data),

  /**
   * 删除系统配置
   *
   * @param id
   */
  deleteById: (id: string) => del(`${CONFIG_BASE_URL}/${id}`),

  /** 刷新缓存 */
  refreshCache: () => put(`${CONFIG_BASE_URL}/refresh`),
};
