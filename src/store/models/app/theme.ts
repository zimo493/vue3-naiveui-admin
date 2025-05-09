import type { GlobalThemeOverrides } from "naive-ui";

/** 默认主色 */
export const primaryColor = "#ac29e1";
/** 默认信息色 */
export const infoColor = "#70c0e8";
/** 默认成功色 */
export const successColor = "#18a058";
/** 默认警告色 */
export const warningColor = "#f0a020";
/** 默认错误色 */
export const errorColor = "#d03050";

/** 默认主题配置 */
const themeConfig: GlobalThemeOverrides = {
  common: {
    primaryColor,
    primaryColorHover: "#b644e5",
    primaryColorPressed: "#9b1dce",
    primaryColorSuppl: "#8e1abd",
    infoColor,
    infoColorHover: "#8accec",
    infoColorPressed: "#56b4e4",
    infoColorSuppl: "#44ade1",
    successColor,
    successColorHover: "#1cbb67",
    successColorPressed: "#148549",
    successColorSuppl: "#117440",
    warningColor,
    warningColorHover: "#f2ac3d",
    warningColorPressed: "#e2910f",
    warningColorSuppl: "#cf850e",
    errorColor,
    errorColorHover: "#d64965",
    errorColorPressed: "#b82a46",
    errorColorSuppl: "#a72640",
  },
};

export default themeConfig;
