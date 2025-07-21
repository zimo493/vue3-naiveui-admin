import type { GlobalThemeOverrides } from "naive-ui";

/** 默认主色 */
export const primaryColor = "#ac29e1";
/** 默认信息色 */
export const infoColor = "#3d8bf2";
/** 默认成功色 */
export const successColor = "#1fb56f";
/** 默认警告色 */
export const warningColor = "#ffb020";
/** 默认错误色 */
export const errorColor = "#f54e4e";

/** 默认主题配置 */
const themeConfig: GlobalThemeOverrides = {
  common: {
    primaryColor,
    primaryColorHover: "#b644e5",
    primaryColorPressed: "#9b1dce",
    primaryColorSuppl: "#8e1abd",
    infoColor,
    infoColorHover: "#5a9cf4",
    infoColorPressed: "#207af0",
    infoColorSuppl: "#106fec",
    successColor,
    successColorHover: "#23cf7f",
    successColorPressed: "#1b9b5f",
    successColorSuppl: "#188954",
    warningColor,
    warningColorHover: "#ffbb3f",
    warningColorPressed: "#ffa501",
    warningColorSuppl: "#ec9800",
    errorColor,
    errorColorHover: "#f76b6b",
    errorColorPressed: "#f33131",
    errorColorSuppl: "#f21e1e",
  },
};

export default themeConfig;
