import { useAppStoreHook } from "@/store";

import left from "./main/Left.vue";

const layoutMap = {
  left,
  top: defineAsyncComponent(() => import("./main/Top.vue")),
  right: defineAsyncComponent(() => import("./main/Right.vue")),
  mixLeft: defineAsyncComponent(() => import("./main/MixLeft.vue")),
  mixRight: defineAsyncComponent(() => import("./main/MixRight.vue")),
};

const appStore = useAppStoreHook();

/**
 * 渲染函数
 * @returns 返回JSX元素
 */
export default defineComponent({
  name: "Layout",
  render: () => h(layoutMap[appStore.layoutMode]),
});
