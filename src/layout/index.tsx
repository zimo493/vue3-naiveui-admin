import { useAppStoreHook } from "@/store";

import left from "./main/Left.vue";
import top from "./main/Top.vue";
import right from "./main/Right.vue";
import mixLeft from "./main/MixLeft.vue";
import mixRight from "./main/MixRight.vue";

const layoutMap = { left, top, right, mixLeft, mixRight };

const appStore = useAppStoreHook();

/**
 * 渲染函数
 * @returns 返回JSX元素
 */
export default defineComponent({
  name: "Layout",
  render: () => h(layoutMap[appStore.layoutMode]),
});
