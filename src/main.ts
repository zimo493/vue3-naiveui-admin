import { type App, createApp } from "vue";
import { installPinia } from "@/store";
import { installRouter } from "@/router";
import { setupWebSocket } from "@/plugins/websocket";

import AppVue from "@/App";
import AppLoading from "@/components/common/AppLoading.vue";

/** 载入全局loading加载状态 */
const appLoading: App<Element> = createApp(AppLoading);

appLoading.mount("#appLoading");

/** 创建vue实例 */
const app: App<Element> = createApp(AppVue);

/** 注册模块 指令/静态资源 */
Object.values(
  import.meta.glob<{ install: (app: App) => void }>("./modules/*.ts", {
    eager: true,
  })
).map((i) => app.use(i));

/** 注册模块 Pinia */
installPinia(app);

/** 注册模块 VueRouter */
installRouter(app)
  .then(setupWebSocket)
  .finally(() => appLoading.unmount());

/** 挂载 App */
app.mount("#app");
