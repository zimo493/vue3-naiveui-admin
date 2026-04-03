import { type BuildOptions } from "vite";

/**
 * Vite构建配置
 * 集中管理所有构建相关的配置
 */
export const buildOptions: BuildOptions = {
  // 消除打包大小超过警告限制
  chunkSizeWarningLimit: 2000,

  // 压缩配置
  minify: "terser",
  terserOptions: {
    compress: {
      keep_infinity: true, // 防止 Infinity 被压缩成 1/0，这可能会导致 Chrome 上的性能问题
      drop_console: true, // 生产环境去除 console
      drop_debugger: true, // 生产环境去除 debugger
    },
    format: { comments: true }, // 删除注释
    mangle: { toplevel: true }, // 是否改变变量名
  },

  // Rollup配置
  rollupOptions: {
    output: {
      chunkFileNames: "js/[name]-[hash].js",
      entryFileNames: "js/[name]-[hash].js",
      assetFileNames: "assets/[ext]/[name]-[hash].[ext]", // 统一资源文件路径
      manualChunks: (id) => {
        /** 核心框架 */
        if (/[\\/]node_modules[\\/](vue|vue-router|pinia)[\\/]/.test(id)) {
          return "vue-core";
        }

        /** 国际化相关 */
        if (/[\\/]node_modules[\\/]vue-i18n[\\/]/.test(id)) {
          return "i18n-core";
        }
        if (/[\\/]locales[\\/]/.test(id)) {
          return "i18n-locales";
        }

        /** 完整打包 ECharts 避免继承链断裂 */
        if (/[\\/]node_modules[\\/]echarts[\\/]/.test(id)) {
          return "echarts";
        }

        /** 编辑器 */
        if (/[\\/]node_modules[\\/]@wangeditor-next[\\/]/.test(id)) {
          return id.includes("plugin") ? "editor-plugins" : "editor-core";
        }

        /** 代码高亮 */
        if (/[\\/]node_modules[\\/]highlight\.js[\\/]/.test(id)) {
          return "highlight";
        }

        /** 图片裁剪 */
        if (/[\\/]node_modules[\\/]vue-cropper[\\/]/.test(id)) {
          return "cropper";
        }

        /** 大型工具库独立分包 */
        if (/[\\/]node_modules[\\/]lodash-es[\\/]/.test(id)) {
          return "lodash";
        }
        if (/[\\/]node_modules[\\/]@vueuse[\\/]/.test(id)) {
          return "vueuse";
        }

        /** 其他工具库合并打包 */
        if (
          /[\\/]node_modules[\\/](axios|dayjs|radash|colord|qs|js-cookie|jsencrypt|nprogress)[\\/]/.test(
            id
          )
        ) {
          return "utils";
        }

        /** 图标库 */
        if (/[\\/]node_modules[\\/](@iconify|unplugin-icons)[\\/]/.test(id)) {
          return "icons";
        }

        /** Excel相关 */
        if (/[\\/]node_modules[\\/]exceljs[\\/]/.test(id)) {
          return "excel";
        }

        /** WebSocket相关 */
        if (/[\\/]node_modules[\\/]@stomp[\\/]/.test(id)) {
          return "websocket";
        }
      },
    },
  },
};
