import { type PluginOption } from "vite";
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

// 自定义html插件
import { htmlPlugin } from "./htmlPlugin";

/**
 * 插件配置
 * 集中管理所有Vite插件
 *
 * @param env 环境变量（VITE_MOCK_ENABLED 为 "true" 时挂载本地 mock 服务）
 * @param buildTimestamp 构建时间戳
 */
export const pluginsOptions = (env: ImportMetaEnv, buildTimestamp: number): PluginOption[] => [
  vue(),
  vueJsx(),
  // 本地 mock：仅开发态、且 VITE_MOCK_ENABLED=true 时启用
  ...(env.VITE_MOCK_ENABLED === "true" ? [mockDevServerPlugin()] : []),
  UnoCSS(),
  htmlPlugin(buildTimestamp),
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
];
