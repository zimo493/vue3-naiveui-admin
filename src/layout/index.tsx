import type { LayoutMode } from "@/enums/layout";
import { useAppStoreHook } from "@/store";

import left from "./main/Left.vue";
import top from "./main/Top.vue";
import mix from "./main/Mix.vue";

/**
 * 渲染函数
 * @returns 返回JSX元素
 */
export default defineComponent({
  name: "Layout",
  render: () => {
    const appStore = useAppStoreHook();
    const layoutMap: Record<LayoutMode, any> = {
      left,
      top,
      mix,
    };

    return h(layoutMap[appStore.layoutMode]);
  },
});
