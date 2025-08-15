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
      // 使用正则匹配 <head> 标签（不区分大小写），确保有属性时也能匹配
      return html.replace(
        /<head(.*?)>/i,
        `<head$1><meta name="buildTime" content="${buildTimestamp}">`
      );
    },
  };
};
