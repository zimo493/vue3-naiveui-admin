import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import UnoCSS from "@unocss/vite";
import Icons from "unplugin-icons/vite";
import { FileSystemIconLoader } from "unplugin-icons/loaders";

// https://github.com/antfu/unplugin-icons
import IconsResolver from "unplugin-icons/resolver";

import { resolve } from "node:path";

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
    base: env.VITE_BASE_URL,
    resolve: {
      alias: { "@": resolve(__dirname, "./src") },
    },
    server: {
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
      UnoCSS(),
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
          enabled: false,
          filepath: "./.eslintrc-auto-import.json",
          globalsPropValue: true,
        },

        // 是否在 vue 模板中自动导入
        vueTemplate: true,
        // 指定自动导入函数TS类型声明文件路径 (false:关闭自动生成)
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
        // 指定自定义组件位置(默认:src/components)
        dirs: ["src/components", "src/**/components"],
        // 指定自动导入组件TS类型声明文件路径 (false:关闭自动生成)
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
        "@wangeditor/editor",
        "@wangeditor/editor-for-vue",
      ],
    },
    // 构建
    build: {
      chunkSizeWarningLimit: 2000, // 消除打包大小超过500kb警告
      minify: "terser", // Vite 2.6.x 以上需要配置 minify: "terser", terserOptions 才能生效
      terserOptions: {
        compress: {
          keep_infinity: true, // 防止 Infinity 被压缩成 1/0，这可能会导致 Chrome 上的性能问题
          drop_console: true, // 生产环境去除 console
          drop_debugger: true, // 生产环境去除 debugger
        },
        format: { comments: false }, // 删除注释
        mangle: { toplevel: true }, // 是否改变变量名
      },
      rollupOptions: {
        output: {
          chunkFileNames: "js/[name]-[hash].js", // 生成chunk文件名的名称
          entryFileNames: "js/[name]-[hash].js", // 包的入口文件名称
          assetFileNames: "[ext]/[name]-[hash].[ext]", // 资源文件像 字体，图片等
        },
      },
    },

    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
  };
});
