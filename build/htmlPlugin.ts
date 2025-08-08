import type { Plugin } from "vite";

/**
 * 自定义html插件添加构建时间戳
 * @returns vite插件
 */
export const htmlPlugin = (buildTimestamp: number): Plugin => {
  return {
    name: "html-plugin",
    apply: "build",
    transformIndexHtml(html: string) {
      return html.replace("<head>", `<head>\n<meta name="buildTime" content="${buildTimestamp}">`);
    },
  };
};
