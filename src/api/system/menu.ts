import { del, get, post, put } from "@/utils";
import { MenuTypeEnum } from "@/enums";

// 菜单基础URL
const MENU_BASE_URL = "/api/v1/menus";

export default {
  /**
   * 获取当前用户的路由列表
   *  - 无需传入角色，后端解析token获取角色自行判断是否拥有路由的权限
   */
  getRoutes: () => get<AppRoute.RouteVO[]>(`${MENU_BASE_URL}/routes`),

  /**
   * 获取菜单树形列表
   * @param params 查询参数
   */
  getList: (params: Menu.Query) => get<Menu.VO[]>(`${MENU_BASE_URL}`, params),

  /**
   * 获取菜单下拉数据源
   * @param params 查询参数，types 多个菜单类型以英文逗号分隔
   */
  getOptions: (params?: { types?: string; scope?: number }) =>
    get<OptionItem[]>(`${MENU_BASE_URL}/options`, params),

  /**
   * 获取可作为上级菜单的下拉数据源（按钮不能有子级，不返回）
   */
  getParentOptions: () =>
    get<OptionItem[]>(`${MENU_BASE_URL}/options`, {
      // 本项目 qs 是默认 indices 格式，数组会变成 types[0]=C 后端收不到，故传逗号串（后端 List<String> 按英文逗号拆分）
      types: [MenuTypeEnum.CATALOG, MenuTypeEnum.MENU].join(","),
    }),

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
