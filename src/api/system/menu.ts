import { del, get, post, put } from "@/utils";

// 菜单基础URL
const MENU_BASE_URL = "/api/v1/menus";

export default {
  /**
   * 获取当前用户的路由列表
   *  - 无需传入角色，后端解析token获取角色自行判断是否拥有路由的权限
   */
  getRoutes: () => get<AppRoute.RouteVO[]>(`${MENU_BASE_URL}/routes/naiveui`),

  /**
   * 获取菜单树形列表
   * @param params 查询参数
   */
  getList: (params: Menu.Query) => get<Menu.VO[]>(`${MENU_BASE_URL}`, params),

  /**
   * 获取菜单下拉数据源
   * @param onlyParent 是否只返回一级菜单
   */
  getOptions: (onlyParent?: boolean) =>
    get<OptionType[]>(`${MENU_BASE_URL}/options`, { onlyParent }),

  /**
   * 获取菜单表单数据
   * @param id 菜单id
   */
  getFormData: (id: string) => get<Menu.Form>(`${MENU_BASE_URL}/${id}/form`),

  /**
   * 添加菜单
   * @param data 菜单表单数据
   */
  create: (data: Menu.Form) => post(`${MENU_BASE_URL}`, data),

  /**
   * 修改菜单
   * @param id 菜单id
   * @param data 菜单表单数据
   */
  update: (id: string, data: Menu.Form) => put(`${MENU_BASE_URL}/${id}`, data),

  /**
   * 删除菜单
   * @param id 菜单id
   */
  deleteById: (id: string) => del(`${MENU_BASE_URL}/${id}`),
};
