import { get } from "@/utils";

// 菜单基础URL
const MENU_BASE_URL = "/api/v1/menus";

export default {
  /**
   * 获取当前用户的路由列表
   * 无需传入角色，后端解析token获取角色自行判断是否拥有路由的权限
   *
   * @returns 路由列表
   */
  getRoutes: () => get<AppRoute.RouteVO[]>(`${MENU_BASE_URL}/routes`),
};
