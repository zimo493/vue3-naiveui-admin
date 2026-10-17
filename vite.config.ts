import { resolve } from "node:path";
import { defineConfig, loadEnv, type Plugin } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import UnoCSS from "@unocss/vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import { FileSystemIconLoader } from "unplugin-icons/loaders";
import { mockDevServerPlugin } from "vite-plugin-mock-dev-server";

import {
  name,
  version,
  engines,
  dependencies,
  devDependencies,
} from "./package.json" with { type: "json" };

// 平台信息与构建时间戳，注入为全局常量 __APP_INFO__
const __APP_INFO__ = {
  pkg: { name, version, engines, dependencies, devDependencies },
  buildTimestamp: Date.now(),
};

/**
 * 在 head 注入构建时间戳
 */
const htmlPlugin = (buildTimestamp: number): Plugin => ({
  name: "html-plugin",
  apply: "build",
  transformIndexHtml: (html: string) =>
    html.replace(/<head(.*?)>/i, `<head$1><meta name="buildTime" content="${buildTimestamp}">`),
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 按 mode 加载 .env 文件
  const env = loadEnv(mode, __dirname) as ImportMetaEnv;

  return {
    // 基础路径：子路径部署由 VITE_BASE_URL 指定，未配置时等价于 /
    base: env.VITE_BASE_URL,
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    server: {
      // 允许 IP 访问
      host: "0.0.0.0",
      port: Number(env.VITE_APP_PORT),
      // 启动后自动打开浏览器
      open: true,
      // 开发代理：mock 未覆盖的接口才会走到 target
      proxy: {
        [env.VITE_API_BASE]: {
          changeOrigin: true,
          target: env.VITE_PROXY_TARGET,
          rewrite: (path: string) => path.replace(new RegExp("^" + env.VITE_API_BASE), ""),
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ["legacy-js-api"],
        },
      },
    },
    plugins: [
      vue(),
      vueJsx(),
      // 本地 mock：VITE_MOCK_ENABLED=true 时挂载；
      // VITE_MOCK_BUILD=true 时额外产出可独立部署的 mock 服务（pnpm build:mock → .deploy/mock-server）
      ...(env.VITE_MOCK_ENABLED === "true"
        ? [
            mockDevServerPlugin(
              env.VITE_MOCK_BUILD === "true"
                ? {
                    build: {
                      serverPort: Number(env.VITE_MOCK_PORT) || 8082,
                      // 产物写到项目根下的 .deploy/mock-server，不混进前端 dist
                      dist: resolve(__dirname, ".deploy/mock-server"),
                    },
                  }
                : {}
            ),
          ]
        : []),
      UnoCSS(),
      htmlPlugin(__APP_INFO__.buildTimestamp),
      AutoImport({
        imports: [
          "vue",
          "pinia",
          "vue-router",
          "@vueuse/core",
          "vue-i18n",
          {
            "naive-ui": ["useDialog", "useMessage", "useNotification", "useLoadingBar"],
          },
        ],
        include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
        eslintrc: {
          enabled: true,
          filepath: "./.eslintrc-auto-import.json",
          globalsPropValue: true,
        },
        // 是否在 vue 模板中自动导入
        vueTemplate: true,
        // 自动导入函数 TS 类型声明文件路径（false 关闭生成）
        dts: "src/typings/auto-imports.d.ts",
      }),
      Components({
        resolvers: [
          NaiveUiResolver(),
          IconsResolver({
            prefix: false,
            customCollections: ["svg-icons"],
          }),
        ],
        // 自定义组件位置（默认 src/components）
        dirs: ["src/components", "src/**/components"],
        // 自动导入组件 TS 类型声明文件路径（false 关闭生成）
        dts: "src/typings/components.d.ts",
      }),
      Icons({
        defaultStyle: "display:inline-block",
        compiler: "vue3",
        customCollections: {
          "svg-icons": FileSystemIconLoader("src/assets/svg-icons", (svg) =>
            svg.replace(/^<svg /, '<svg fill="currentColor" width="1.2em" height="1.2em"')
          ),
        },
      }),
    ],
    optimizeDeps: {
      include: [
        "vue",
        "vue-router",
        "pinia",
        "axios",
        "echarts",
        "@vueuse/core",
        "@iconify/vue",
        "@wangeditor-next/editor",
        "@wangeditor-next/editor-for-vue",
      ],
    },
    build: {
      // 消除打包大小超过警告限制
      chunkSizeWarningLimit: 2000,
      // 压缩配置
      minify: "terser",
      terserOptions: {
        compress: {
          // 防止 Infinity 被压缩成 1/0，这可能会导致 Chrome 上的性能问题
          keep_infinity: true,
          drop_console: true,
          drop_debugger: true,
        },
        format: { comments: true },
        mangle: { toplevel: true },
      },
      rollupOptions: {
        output: {
          chunkFileNames: "js/[name]-[hash].js",
          entryFileNames: "js/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
          manualChunks: (id) => {
            // 核心框架
            if (/[\\/]node_modules[\\/](vue|vue-router|pinia)[\\/]/.test(id)) {
              return "vue-core";
            }

            // 国际化相关
            if (/[\\/]node_modules[\\/]vue-i18n[\\/]/.test(id)) {
              return "i18n-core";
            }
            if (/[\\/]locales[\\/]/.test(id)) {
              return "i18n-locales";
            }

            // 完整打包 ECharts 避免继承链断裂
            if (/[\\/]node_modules[\\/]echarts[\\/]/.test(id)) {
              return "echarts";
            }

            // 编辑器
            if (/[\\/]node_modules[\\/]@wangeditor-next[\\/]/.test(id)) {
              return id.includes("plugin") ? "editor-plugins" : "editor-core";
            }

            // 代码高亮
            if (/[\\/]node_modules[\\/]highlight\.js[\\/]/.test(id)) {
              return "highlight";
            }

            // 图片裁剪
            if (/[\\/]node_modules[\\/]vue-cropper[\\/]/.test(id)) {
              return "cropper";
            }

            // 大型工具库独立分包
            if (/[\\/]node_modules[\\/]lodash-es[\\/]/.test(id)) {
              return "lodash";
            }
            if (/[\\/]node_modules[\\/]@vueuse[\\/]/.test(id)) {
              return "vueuse";
            }

            // 其他工具库合并打包
            if (
              /[\\/]node_modules[\\/](axios|dayjs|radash|colord|qs|js-cookie|jsencrypt|nprogress)[\\/]/.test(
                id
              )
            ) {
              return "utils";
            }

            // 图标库
            if (/[\\/]node_modules[\\/](@iconify|unplugin-icons)[\\/]/.test(id)) {
              return "icons";
            }

            // Excel 相关
            if (/[\\/]node_modules[\\/]exceljs[\\/]/.test(id)) {
              return "excel";
            }

            // WebSocket 相关
            if (/[\\/]node_modules[\\/]@stomp[\\/]/.test(id)) {
              return "websocket";
            }
          },
        },
      },
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
  };
});
