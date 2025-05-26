import type { CSSOptions } from "vite";

/**
 * CSS预处理器配置
 */
export const cssOptions: CSSOptions = {
  preprocessorOptions: {
    scss: {
      silenceDeprecations: ["legacy-js-api"],
    },
  },
};
