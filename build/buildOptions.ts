import type { BuildOptions } from "vite";
import { terserOptions, rollupOptions } from ".";

/**
 * Vite构建配置
 * 集中管理所有构建相关的配置
 */
export const buildOptions: BuildOptions = {
  // 消除打包大小超过警告限制
  chunkSizeWarningLimit: 2000,

  // 压缩配置
  minify: "terser",
  terserOptions,

  // Rollup配置
  rollupOptions,
};
