import leftMenu from "./main/Left.vue";
import topMenu from "./main/Top.vue";
import mixMenu from "./main/Mix.vue";
import { useAppStoreHook } from "@/store";

/**
 * 渲染函数
 * @returns 返回JSX元素
 */
export default defineComponent({
  name: "Layout",
  render: () => {
    const appStore = useAppStoreHook();
    const layoutMap = {
      leftMenu,
      topMenu,
      mixMenu,
    };

    return h(layoutMap[appStore.layoutMode]);
  },
});
