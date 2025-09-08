import { store } from "@/store";

export const useWatermarkStore = defineStore("watermark-store", {
  state: (): Status.Watermark => ({
    config: {
      fullscreen: true,
      fontSize: 16,
      rotate: -15,
      fontColor: "rgba(128,128,128,.3)",
      cross: true,
      fontStyle: "normal",
      fontWeight: 400,
      globalRotate: 0,
      lineHeight: 16,
      height: 200,
      width: 380,
      xGap: 0,
      yGap: 0,
      xOffset: 150,
      yOffset: 150,
      zIndex: 10,
      textAlign: "left",
    },
  }),
  actions: {
    reset() {
      this.$reset();
    },
  },
  persist: true, // 持久化存储，默认存储在 localStorage
});

export const useWatermarkStoreHook = () => useWatermarkStore(store);
