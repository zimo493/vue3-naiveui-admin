import "uno.css";
import "@/styles/index.css";

import { addCollection } from "@iconify/vue";

/**
 * 离线图标集合（按"实际用到的图标"生成：91 个、约 76KB）
 *
 * 图标名在 src 与 mock 里都是运行时字符串，走不了 unplugin-icons 的编译期导入，
 * 不注册的话 <Icon> 会向 api.iconify.design 实时拉取，域名不可达时图标即空白；
 * 这里注册进 @iconify/vue，运行时不再依赖外网。新增图标名后重新生成 src/assets/menu-icons.json。
 */
import menuIcons from "@/assets/menu-icons.json";

Object.values(menuIcons).forEach((collection) => addCollection(collection as any));

export const defaultIcon = "ep:menu";
export const homeIcon = "ant-design:home-filled";

// 全局引入的静态资源
export const install = () => {};
