import type { App } from "vue";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

export * from "./models/app";
export * from "./models/auth";
export * from "./models/route";
export * from "./models/tab";
export * from "./models/dict";
export * from "./models/watermark";

const store = createPinia();

// 持久化插件
store.use(piniaPluginPersistedstate);

// 安装pinia全局状态库
export const installPinia = (app: App) => {
  app.use(store);
};

export { store };
