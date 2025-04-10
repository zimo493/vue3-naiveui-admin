declare namespace AppRoute {
  /** RouteVO，路由对象 */
  interface RouteVO {
    /** 子路由列表 */
    children: RouteVO[];
    /** 组件路径 */
    component?: string;
    /** 路由属性 */
    meta?: AppRoute.RouteMeta;
    /** 路由名称 */
    name?: string;
    /** 路由路径 */
    path: string;
    /** 跳转链接 */
    redirect?: string;
  }

  /** 单个路由所携带的meta标识 */
  interface RouteMeta {
    /**
     * 菜单名称
     * @example 'Dashboard'
     */
    title?: string;

    /**
     * 菜单图标
     * @example 'el-icon-edit'
     */
    icon?: string;

    /**
     * 是否隐藏菜单
     * true 隐藏, false 显示
     * @default false
     */
    hidden?: boolean;

    /**
     * 始终显示父级菜单，即使只有一个子菜单
     * true 显示父级菜单, false 隐藏父级菜单，显示唯一子节点
     * @default false
     */
    alwaysShow?: boolean;

    /**
     * 是否缓存页面
     * true 缓存, false 不缓存
     * @default false
     */
    keepAlive?: boolean;

    /** 路由参数 */
    params?: Recordable;
    /** 是否固定在tab */
    affix?: boolean;
  }
}
