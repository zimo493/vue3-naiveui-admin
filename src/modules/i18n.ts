import type { App } from "vue";
import { local } from "@/utils";
import { createI18n } from "vue-i18n";
import enUS from "../../locales/en_US.json";
import zhCN from "../../locales/zh_CN.json";
import zhTW from "../../locales/zh_TW.json";

const { VITE_DEFAULT_LANG } = import.meta.env;

export const i18n = createI18n({
  legacy: false,
  locale: local.get("lang") || VITE_DEFAULT_LANG, // 默认显示语言
  fallbackLocale: VITE_DEFAULT_LANG,
  messages: {
    zhCN,
    enUS,
    zhTW,
  },
});

export function install(app: App) {
  app.use(i18n);
}
