import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

// https://github.com/unocss/unocss
export default defineConfig({
  presets: [
    presetUno(), // UnoCSS 的基础预设
    presetAttributify(), // 属性化模式预设，允许你通过属性来使用类名
    presetIcons(), // 图标预设
  ],
  // 自定义快捷类
  shortcuts: {
    "wh-full": "w-full h-full",
    "flex-center": "flex justify-center items-center",
    "flex-col-center": "flex-center flex-col",
    "flex-x-center": "flex justify-center",
    "flex-y-center": "flex items-center",
  },
  transformers: [
    transformerDirectives(), // 启用指令转换器，允许动态绑定 UnoCSS 类
    transformerVariantGroup(), // 启用变体分组转换器，允许对样式变体进行分组。
  ],
});
