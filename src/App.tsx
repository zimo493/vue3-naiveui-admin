import { darkTheme, NConfigProvider } from "naive-ui";

import { ThemeMode } from "./enums";
import { RouterView } from "vue-router";
import { useAppStoreHook } from "@/store";
import { naiveI18nOptions } from "@/utils";

import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import java from "highlight.js/lib/languages/java";
import json from "highlight.js/lib/languages/json";
import xml from "highlight.js/lib/languages/xml";
import sql from "highlight.js/lib/languages/sql";

import NaiveProvider from "@/components/NaiveProvider.vue";
import Watermark from "@/components/Watermark.vue";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("java", java);
hljs.registerLanguage("json", json);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("sql", sql);

/**
 * 渲染函数
 * @returns 返回JSX元素
 */
export default defineComponent({
  name: "App",
  render: () => {
    const appStore = useAppStoreHook();

    /**
     * naive-ui语言包
     */
    const naiveLocale = computed(() =>
      naiveI18nOptions[appStore.lang] ? naiveI18nOptions[appStore.lang] : naiveI18nOptions.enUS
    );

    return (
      <NConfigProvider
        class="wh-full"
        inlineThemeDisabled
        theme={appStore.colorMode === ThemeMode.DARK ? darkTheme : null}
        locale={naiveLocale.value.locale}
        date-locale={naiveLocale.value.dateLocale}
        themeOverrides={appStore.theme}
        hljs={hljs}
      >
        <NaiveProvider>
          <RouterView />
          <Watermark showWatermark={appStore.showWatermark} />
        </NaiveProvider>
      </NConfigProvider>
    );
  },
});
