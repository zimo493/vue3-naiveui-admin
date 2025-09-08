import { type ServerOptions } from "vite";

/**
 * 开发服务器配置
 * @param env 环境变量
 */
export const serverOptions = (env: ImportMetaEnv): ServerOptions => ({
  // 允许IP访问
  host: "0.0.0.0",
  // 应用端口 (默认:3000)
  port: Number(env.VITE_APP_PORT),
  // 运行是否自动打开浏览器
  open: true,
  proxy: {
    /** 代理前缀为 /dev-api 的请求  */
    [env.VITE_APP_BASE_API]: {
      changeOrigin: true,
      // 接口地址
      target: env.VITE_APP_API_URL,
      rewrite: (path: string) => path.replace(new RegExp("^" + env.VITE_APP_BASE_API), ""),
    },
  },
});
