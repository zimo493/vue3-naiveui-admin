import request, { del, get, post, put } from "@/utils";
import type { AxiosProgressEvent } from "axios";

const USER_BASE_URL = "/api/v1/users";

export default {
  /**
   * 获取当前登录用户信息
   *
   * @returns 登录用户昵称、头像信息，包括角色和权限
   */
  getInfo: () => get<User.Info>(`${USER_BASE_URL}/me`),

  /**
   * 获取用户分页列表
   *
   * @param params 查询参数
   */
  getPage: (params: User.Query) => get<PageResult<User.VO[]>>(`${USER_BASE_URL}/page`, params),

  /**
   * 获取用户表单详情
   *
   * @param userId 用户ID
   * @returns 用户表单详情
   */
  getFormData: (userId: string) => get<User.Form>(`${USER_BASE_URL}/${userId}/form`),

  /**
   * 添加用户
   *
   * @param data 用户表单数据
   */
  create: (data: User.Form) => post<string>(`${USER_BASE_URL}`, data),

  /**
   * 修改用户
   *
   * @param id 用户ID
   * @param data 用户表单数据
   */
  update: (id: string, data: User.Form) => put<string>(`${USER_BASE_URL}/${id}`, data),

  /**
   * 修改用户密码
   *
   * @param id 用户ID
   * @param password 新密码
   */
  resetPassword: (id: string, password: string) =>
    put<string>(`${USER_BASE_URL}/${id}/password/reset`, null, { password }),

  /**
   * 批量删除用户，多个以英文逗号(,)分割
   *
   * @param ids 用户ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds: (ids: string) => del<string>(`${USER_BASE_URL}/${ids}`),

  /** 下载用户导入模板 */
  downloadTemplate: () =>
    request({
      url: `${USER_BASE_URL}/template`,
      method: "get",
      responseType: "blob",
    }),

  /**
   * 导出用户
   *
   * @param params 查询参数
   */
  export: (params: User.Query) =>
    request({
      url: `${USER_BASE_URL}/export`,
      method: "get",
      params,
      responseType: "blob",
    }),

  /**
   * 导入用户
   *
   * @param deptId 部门ID
   * @param file 导入文件
   * @param onUploadProgress 进度回调
   */
  import(deptId: string, file: File, onUploadProgress?: (e: AxiosProgressEvent) => void) {
    const formData = new FormData();

    formData.append("file", file);

    return request<any, ExcelResult>({
      url: `${USER_BASE_URL}/import`,
      method: "post",
      params: { deptId },
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    });
  },

  /** 获取个人中心用户信息 */
  getProfile: () => get<User.ProfileVO>(`${USER_BASE_URL}/profile`),

  /** 修改个人中心用户信息 */
  updateProfile: (data: User.ProfileForm) => put<string>(`${USER_BASE_URL}/profile`, data),

  /** 修改个人中心用户密码 */
  changePassword: (data: User.PasswordChangeForm) => put<string>(`${USER_BASE_URL}/password`, data),

  /** 发送短信验证码（绑定或更换手机号）*/
  sendMobileCode: (mobile: string) => post(`${USER_BASE_URL}/mobile/code`, null, { mobile }),

  /** 绑定或更换手机号 */
  bindOrChangeMobile: (data: User.MobileUpdateForm) => put<string>(`${USER_BASE_URL}/mobile`, data),

  /** 发送邮箱验证码（绑定或更换邮箱）*/
  sendEmailCode: (email: string) => post<string>(`${USER_BASE_URL}/email/code`, null, { email }),

  /** 绑定或更换邮箱 */
  bindOrChangeEmail: (data: User.EmailUpdateForm) => put<string>(`${USER_BASE_URL}/email`, data),

  /**
   *  获取用户下拉列表
   */
  getOptions: () => get<OptionType[]>(`${USER_BASE_URL}/options`),
};
