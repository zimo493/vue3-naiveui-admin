import { Icon } from "@iconify/vue";
import { NIcon } from "naive-ui";

import { defaultIcon } from "@/modules/assets";

type IconProps = import("naive-ui").IconProps;

/** 本地图标，按需从 src/assets/svg-icons 取 */
const localSvgs = import.meta.glob("@/assets/svg-icons/*.svg", {
  query: "?raw",
  import: "default",
  eager: true,
});

export const renderIcon = (icon?: string, props?: IconProps) => {
  if (!icon) return;

  return () => createIcon(icon, props);
};

export const createIcon = (icon?: string, props?: IconProps) => {
  if (!icon) return;

  if (icon.startsWith("local:")) {
    const svgName = icon.replace("local:", "");
    const target = localSvgs[`/src/assets/svg-icons/${svgName}.svg`];

    // 本地文件不存在就退默认图标，别留个空白占位
    if (!target) {
      return h(NIcon, props, { default: () => h(Icon, { icon: defaultIcon }) });
    }

    return h(NIcon, { ...props, innerHTML: target });
  }

  // 后端菜单沿用的是 Element 图标名（el-icon-Xxx），iconify 里没有这个名字，
  // 交给 <Icon> 只会渲染出空占位，这里统一退到默认图标
  if (icon.startsWith("el-icon-")) {
    return h(NIcon, props, { default: () => h(Icon, { icon: defaultIcon }) });
  }

  return h(NIcon, props, { default: () => h(Icon, { icon }) });
};
