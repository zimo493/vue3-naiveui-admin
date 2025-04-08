import { zhCN, dateZhCN, darkTheme, NConfigProvider } from "naive-ui";

import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import java from "highlight.js/lib/languages/java";
import json from "highlight.js/lib/languages/json";
import xml from "highlight.js/lib/languages/xml";
import sql from "highlight.js/lib/languages/sql";

import { RouterView } from "vue-router";
import NaiveProvider from "@/components/common/NaiveProvider.vue";
import { useAppStore } from "@/store";

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
    const appStore = useAppStore();

    return (
      <NConfigProvider
        class="wh-full"
        inlineThemeDisabled
        theme={appStore.colorMode === "dark" ? darkTheme : null}
        locale={zhCN}
        date-locale={dateZhCN}
        themeOverrides={appStore.theme}
        hljs={hljs}
      >
        <NaiveProvider>
          <RouterView />
        </NaiveProvider>
      </NConfigProvider>
    );
  },
});
