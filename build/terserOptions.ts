import type { TerserOptions } from "vite";

/**
 * Terser压缩配置
 * 用于生产环境代码压缩和优化
 */
export const terserOptions: TerserOptions = {
  compress: {
    keep_infinity: true, // 防止 Infinity 被压缩成 1/0，这可能会导致 Chrome 上的性能问题
    drop_console: true, // 生产环境去除 console
    drop_debugger: true, // 生产环境去除 debugger
  },
  format: { comments: true }, // 删除注释
  mangle: { toplevel: true }, // 是否改变变量名
};
