import { defineConfig, loadEnv } from "vite";

import {
  cssOptions,
  pluginsOptions,
  optimizeDepsOptions,
  serverOptions,
  resolveOptions,
  buildOptions,
} from "./build";

import { name, version, engines, dependencies, devDependencies } from "./package.json";

// 平台的名称、版本、运行所需的 node 版本、依赖、构建时间的类型提示
const __APP_INFO__ = {
  pkg: { name, version, engines, dependencies, devDependencies },
  buildTimestamp: Date.now(),
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  const env = loadEnv(mode, __dirname);

  return {
    base: env.VITE_BASE_URL, // 基础路径
    resolve: resolveOptions(__dirname), // 路径解析配置
    server: serverOptions(env), // 开发服务器配置
    css: cssOptions, // CSS预处理器配置
    plugins: pluginsOptions, // 插件配置
    optimizeDeps: optimizeDepsOptions, // 依赖优化配置
    build: buildOptions, // 构建配置
    // 全局常量定义
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
  };
});
