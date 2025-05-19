import request, { del, get } from "@/utils";

const AUTH_BASE_URL = "/api/v1/auth";

export default {
  /**
   * 用户登录
   * @param data 登录表单数据
   */
  login: (data: Auth.LoginFormData) => {
    const formData = new FormData();

    formData.append("username", data.username);
    formData.append("password", data.password);
    formData.append("captchaKey", data.captchaKey);
    formData.append("captchaCode", data.captchaCode);

    return request<any, Auth.LoginResult>({
      url: `${AUTH_BASE_URL}/login`,
      method: "post",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  /**
   * 刷新 token
   * @param refreshToken 刷新 token
   */
  refreshToken: (refreshToken: string) =>
    request<any, Auth.LoginResult>({
      url: `${AUTH_BASE_URL}/refresh-token`,
      method: "post",
      params: { refreshToken },
      headers: { isToken: false },
    }),

  /**
   * 获取验证码
   * @return 验证码信息
   */
  getCaptcha: () => get<Auth.CaptchaInfo>(`${AUTH_BASE_URL}/captcha`),

  /**
   * 登出
   * @return void
   */
  logout: () => del<string>(`${AUTH_BASE_URL}/logout`),
};
