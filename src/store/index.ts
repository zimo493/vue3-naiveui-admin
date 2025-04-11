import type { App } from "vue";
import piniaPluginPersist from "pinia-plugin-persist";

export * from "./models/app";
export * from "./models/auth";
export * from "./models/route";
export * from "./models/tab";
export * from "./models/dict";

const store = createPinia();

// 安装pinia全局状态库
export const installPinia = (app: App) => {
  store.use(piniaPluginPersist);
  app.use(store);
};

export { store };
