import { get } from "@/utils";

const USER_BASE_URL = "/api/v1/users";

export default {
  /**
   * 获取当前登录用户信息
   *
   * @returns 登录用户昵称、头像信息，包括角色和权限
   */
  getInfo: () => get<User.Info>(`${USER_BASE_URL}/me`),
};
