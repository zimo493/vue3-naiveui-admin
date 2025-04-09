/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";

  const component: DefineComponent;
  export default component;
}

// TypeScript 类型提示都为 string： https://github.com/vitejs/vite/issues/6930
interface ImportMetaEnv {
  /** 应用端口 */
  VITE_APP_PORT: number;
  /** API 基础路径(代理前缀) */
  VITE_APP_BASE_API: string;
  /** 超时时间 */
  VITE_APP_TIMEOUT: number;
  /** API 地址 */
  VITE_APP_API_URL: string;
  /** 是否开启 Mock 服务 */
  VITE_MOCK_DEV_SERVER: boolean;
  /** 默认语言 */
  VITE_DEFAULT_LANG: App.lang;
  /** 本地存储前缀 */
  VITE_STORAGE_PREFIX: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * 平台的名称、版本、运行所需的`node`版本、依赖、构建时间的类型提示
 */
declare const __APP_INFO__: {
  pkg: {
    name: string;
    version: string;
    engines: {
      node: string;
    };
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  };
  buildTimestamp: number;
};
