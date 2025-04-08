import { createApp, type App } from "vue";
import AppVue from "./App";
import { installPinia } from "@/store";
import { installRouter } from "@/router";

const setupApp = () => {
  // 创建vue实例
  const app: App<Element> = createApp(AppVue);

  /* 注册模块 指令/静态资源 */
  Object.values(
    import.meta.glob<{ install: (app: App) => void }>("./modules/*.ts", {
      eager: true,
    })
  ).map((i) => app.use(i));

  // 注册模块Pinia
  installPinia(app);

  // 注册模块 VueRouter
  installRouter(app);

  // 挂载
  app.mount("#app");
};

setupApp();
