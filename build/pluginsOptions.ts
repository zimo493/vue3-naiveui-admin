import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import UnoCSS from "@unocss/vite";
import Icons from "unplugin-icons/vite";
import { FileSystemIconLoader } from "unplugin-icons/loaders";
import IconsResolver from "unplugin-icons/resolver";
import type { PluginOption } from "vite";

/**
 * 插件配置
 * 集中管理所有Vite插件
 */
export const pluginsOptions: PluginOption[] = [
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
