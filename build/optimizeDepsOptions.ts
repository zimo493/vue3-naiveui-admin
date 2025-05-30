import { type DepOptimizationOptions } from "vite";

/**
 * 依赖优化配置
 * 用于控制Vite的依赖预构建行为
 */
export const optimizeDepsOptions: DepOptimizationOptions = {
  include: [
    "vue",
    "vue-router",
    "pinia",
    "axios",
    "echarts",
    "@vueuse/core",
    "@iconify/vue",
    "@wangeditor-next/editor",
    "@wangeditor-next/editor-for-vue",
  ],
};
