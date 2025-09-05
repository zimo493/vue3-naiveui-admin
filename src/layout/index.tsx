import { useAppStoreHook } from "@/store";

import Left from "./main/layout-left.vue";
import Top from "./main/layout-top.vue";
import Right from "./main/layout-right.vue";
import MixLeft from "./main/layout-mix-left.vue";
import MixRight from "./main/layout-mix-right.vue";

const layoutMap = {
  Left,
  Top,
  Right,
  MixLeft,
  MixRight,
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
