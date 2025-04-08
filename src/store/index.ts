import type { App } from "vue";
import piniaPluginPersist from "pinia-plugin-persist";

export * from "./models/app";
// 安装pinia全局状态库
export const installPinia = (app: App) => {
  const pinia = createPinia();

  pinia.use(piniaPluginPersist);
  app.use(pinia);
};
