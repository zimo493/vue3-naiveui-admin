import { createApp, type App } from "vue";
import { installPinia } from "@/store";
import { installRouter } from "@/router";
import { setupWebSocket } from "@/plugins/websocket";

import AppVue from "@/App";
import AppLoading from "@/components/common/AppLoading.vue";

// 载入全局loading加载状态
const appLoading: App<Element> = createApp(AppLoading);

const setupApp = () => {
  // 创建vue实例
  const app: App<Element> = createApp(AppVue);

  appLoading.mount("#appLoading");

  /* 注册模块 指令/静态资源 */
  Object.values(
    import.meta.glob<{ install: (app: App) => void }>("./modules/*.ts", {
      eager: true,
    })
  ).map((i) => app.use(i));

  // 注册模块Pinia
  installPinia(app);

  // 注册模块 VueRouter
  installRouter(app)
    .then(() => console.info("路由初始化完成"))
    .then(() => setupWebSocket())
    .finally(() => appLoading.unmount());

  // 挂载
  app.mount("#app");
};

setupApp();
