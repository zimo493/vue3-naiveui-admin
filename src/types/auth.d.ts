/* 登录类型数据 */
declare namespace Auth {
  /** 登录表单数据 */
  interface LoginFormData {
    /** 用户名 */
    username: string;
    /** 密码 */
    password: string;
    /** 验证码缓存key */
    captchaKey: string;
    /** 验证码 */
    captchaCode: string;
    /** 记住我 */
    rememberMe: boolean;
  }

  /** 登录响应 */
  interface LoginResult {
    /** 访问令牌 */
    accessToken: string;
    /** 刷新令牌 */
    refreshToken: string;
    /** 令牌类型 */
    tokenType: string;
    /** 过期时间(秒) */
    expiresIn: number;
  }

  /** 验证码信息 */
  interface CaptchaInfo {
    /** 验证码缓存key */
    captchaKey: string;
    /** 验证码图片Base64字符串 */
    captchaBase64: string;
  }
}
