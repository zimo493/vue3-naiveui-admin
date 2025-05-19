import { del, get, post, put } from "@/utils";

const ROLE_BASE_URL = "/api/v1/roles";

export default {
  /**
   * 获取角色分页数据
   * @param params 查询参数
   */
  getPage: (params?: Role.Query) => get<PageResult<Role.VO[]>>(`${ROLE_BASE_URL}/page`, params),

  /**
   * 获取角色下拉数据源
   */
  getOptions: () => get<OptionType[]>(ROLE_BASE_URL + "/options"),

  /**
   * 获取角色的菜单id集合
   * @param roleId 角色id
   */
  getRoleMenuIds: (roleId: string) => get<string[]>(`${ROLE_BASE_URL}/${roleId}/menuIds`),

  /**
   * 分配菜单权限
   * @param roleId 角色id
   * @param data 菜单id集合
   */
  updateRoleMenus: (roleId: string, data: string[]) =>
    put(`${ROLE_BASE_URL}/${roleId}/menus`, data),

  /**
   * 获取角色表单数据
   * @param id 角色id
   */
  getFormData: (id: string) => get<Role.Form>(`${ROLE_BASE_URL}/${id}/form`),

  /**
   * 添加角色
   * @param data 角色表单数据
   */
  create: (data: Role.Form) => post(`${ROLE_BASE_URL}`, data),

  /**
   * 更新角色
   * @param id 角色id
   * @param data 角色表单数据
   */
  update: (id: string, data: Role.Form) => put(`${ROLE_BASE_URL}/${id}`, data),

  /**
   * 批量删除角色
   * @param ids 角色id字符串，多个以英文逗号(,)分割
   */
  deleteByIds: (ids: string) => del(`${ROLE_BASE_URL}/${ids}`),
};
