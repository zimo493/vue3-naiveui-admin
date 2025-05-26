import { resolve } from "node:path";

/**
 * 路径解析配置
 * @param dirname 项目根目录
 */
export const resolveOptions = (dirname: string) => {
  return {
    alias: {
      "@": resolve(dirname, "./src"),
    },
  };
};
