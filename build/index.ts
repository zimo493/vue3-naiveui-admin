/**
 * 构建配置统一导出入口
 * 集中管理所有构建相关的配置
 */

// 导出各个子配置
export * from "./rollupOptions";
export * from "./terserOptions";
export * from "./cssOptions";
export * from "./pluginsOptions";
export * from "./optimizeDepsOptions";
export * from "./serverOptions";
export * from "./resolveOptions";

// 导出完整构建配置
export * from "./buildOptions";
