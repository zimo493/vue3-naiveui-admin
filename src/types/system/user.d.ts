declare namespace User {
  interface Info {
    /** 用户ID */
    userId?: string;

    /** 用户名 */
    username?: string;

    /** 昵称 */
    nickname?: string;

    /** 头像URL */
    avatar?: string;

    /** 角色 */
    roles: string[];

    /** 权限 */
    perms: string[];
  }

  /**
   * 用户分页查询对象
   */
  interface Query extends PageQuery {
    /** 搜索关键字 */
    keywords?: string;

    /** 用户状态 */
    status?: number;

    /** 部门ID */
    deptId?: number;

    /** 开始时间 */
    createTime?: [string, string];
  }

  /** 用户分页对象 */
  interface VO {
    /** 用户ID */
    id: string;
    /** 用户头像URL */
    avatar?: string;
    /** 创建时间 */
    createTime?: Date;
    /** 部门名称 */
    deptName?: string;
    /** 用户邮箱 */
    email?: string;
    /** 性别 */
    gender?: number;
    /** 手机号 */
    mobile?: string;
    /** 用户昵称 */
    nickname?: string;
    /** 角色名称，多个使用英文逗号(,)分割 */
    roleNames?: string;
    /** 用户状态(1:启用;0:禁用) */
    status?: number;
    /** 用户名 */
    username?: string;
  }

  /** 用户表单类型 */
  export interface Form {
    /** 用户ID */
    id?: string;
    /** 用户头像 */
    avatar?: string;
    /** 部门ID */
    deptId?: string;
    /** 邮箱 */
    email?: string;
    /** 性别 */
    gender?: number;
    /** 手机号 */
    mobile?: string;
    /** 昵称 */
    nickname?: string;
    /** 角色ID集合 */
    roleIds?: number[];
    /** 用户状态(1:正常;0:禁用) */
    status?: number;
    /** 用户名 */
    username?: string;
  }

  /** 个人中心用户信息 */
  export interface ProfileVO {
    /** 用户ID */
    id?: string;

    /** 用户名 */
    username?: string;

    /** 昵称 */
    nickname?: string;

    /** 头像URL */
    avatar?: string;

    /** 性别 */
    gender?: number;

    /** 手机号 */
    mobile?: string;

    /** 邮箱 */
    email?: string;

    /** 部门名称 */
    deptName?: string;

    /** 角色名称，多个使用英文逗号(,)分割 */
    roleNames?: string;

    /** 创建时间 */
    createTime?: Date;
  }

  /** 个人中心用户信息表单 */
  interface ProfileForm {
    /** 用户ID */
    id?: string;

    /** 用户名 */
    username?: string;

    /** 昵称 */
    nickname?: string;

    /** 头像URL */
    avatar?: string;

    /** 性别 */
    gender?: number;

    /** 手机号 */
    mobile?: string;

    /** 邮箱 */
    email?: string;
  }

  /** 修改密码表单 */
  interface PasswordChangeForm {
    /** 原密码 */
    oldPassword?: string;
    /** 新密码 */
    newPassword?: string;
    /** 确认新密码 */
    confirmPassword?: string;
  }

  /** 修改手机表单 */
  interface MobileUpdateForm {
    /** 手机号 */
    mobile?: string;
    /** 验证码 */
    code?: string;
  }

  /** 修改邮箱表单 */
  interface EmailUpdateForm {
    /** 邮箱 */
    email?: string;
    /** 验证码 */
    code?: string;
  }
}
