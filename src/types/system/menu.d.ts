declare namespace Menu {
  /** 菜单查询参数 */
  interface Query {
    /** 搜索关键字 */
    keywords?: string;
  }

  /** 菜单视图对象 */
  interface VO {
    /** 子菜单 */
    children?: VO[];
    /** 组件路径 */
    component?: string;
    /** ICON */
    icon?: string;
    /** 菜单ID */
    id: string;
    /** 菜单名称 */
    name?: string;
    /** 父菜单ID */
    parentId?: string;
    /** 按钮权限标识 */
    perm?: string;
    /** 跳转路径 */
    redirect?: string;
    /** 路由名称 */
    routeName?: string;
    /** 路由相对路径 */
    routePath?: string;
    /** 菜单排序(数字越小排名越靠前) */
    sort?: number;
    /** 菜单 */
    type?: string;
    /** 菜单是否可见(1:显示;0:隐藏) */
    visible?: number;
  }

  /** 菜单表单对象 */
  interface Form {
    /** 菜单ID */
    id?: string;
    /** 父菜单ID */
    parentId?: string;
    /** 菜单名称 */
    name?: string;
    /** 菜单是否可见(1-是 0-否) */
    visible: number;
    /** ICON */
    icon?: string;
    /** 排序 */
    sort?: number;
    /** 路由名称 */
    routeName?: string;
    /** 路由路径 */
    routePath?: string;
    /** 组件路径 */
    component?: string;
    /** 跳转路由路径 */
    redirect?: string;
    /** 菜单 */
    type?: string;
    /** 权限标识 */
    perm?: string;
    /** 【菜单】是否开启页面缓存 */
    keepAlive?: number;
    /** 【目录】只有一个子路由是否始终显示 */
    alwaysShow?: number;
    /** 参数 */
    params?: KeyValue[];
  }

  interface KeyValue {
    key: string;
    value: string;
  }
}
