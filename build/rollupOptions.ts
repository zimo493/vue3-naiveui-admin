import { type OutputOptions } from "rollup";

/**
 * Rollup构建输出配置
 * 用于控制打包输出和代码分割策略
 */
export const rollupOutputOptions: OutputOptions = {
  chunkFileNames: "js/[name]-[hash].js",
  entryFileNames: "js/[name]-[hash].js",
  assetFileNames: "assets/[ext]/[name]-[hash].[ext]", // 统一资源文件路径
  manualChunks: (id) => {
    /** 核心框架 */
    if (/[\\/]node_modules[\\/](vue|vue-router|vue-i18n|pinia)[\\/]/.test(id)) {
      return "vue-core";
    }

    /** 完整打包 ECharts 避免继承链断裂 */
    if (/[\\/]node_modules[\\/]echarts[\\/]/.test(id)) {
      return "echarts";
    }

    /** 编辑器 */
    if (/[\\/]node_modules[\\/]@wangeditor-next[\\/]/.test(id)) {
      return id.includes("plugin") ? "editor-plugins" : "editor-core";
    }

    /** 工具库 */
    if (/[\\/]node_modules[\\/](axios|@vueuse|lodash-es|dayjs|radash)[\\/]/.test(id)) {
      return "utils";
    }

    /** 图标库 */
    if (/[\\/]node_modules[\\/](@iconify|unplugin-icons)[\\/]/.test(id)) {
      return "icons";
    }
  },
};

/**
 * 完整的Rollup配置
 */
export const rollupOptions = {
  output: rollupOutputOptions,
};
