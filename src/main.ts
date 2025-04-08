import { createApp, type App } from "vue";
import AppVue from "./App.vue";

const app = createApp(AppVue);

/* 注册模块 指令/静态资源 */
Object.values(
  import.meta.glob<{ install: (app: App) => void }>("./modules/*.ts", {
    eager: true,
  })
).map((i) => app.use(i));

app.mount("#app");
