import { useAppStoreHook } from "@/store";
import { useResponsive } from "@/hooks/useResponsive";

import Left from "./main/layout-left.vue";
import Top from "./main/layout-top.vue";
import Right from "./main/layout-right.vue";
import MixLeft from "./main/layout-mix-left.vue";
import MixRight from "./main/layout-mix-right.vue";
import Mobile from "./main/layout-mobile.vue";

const layoutMap = {
  Left,
  Top,
  Right,
  MixLeft,
  MixRight,
  Mobile,
};

const appStore = useAppStoreHook();

/**
 * 渲染函数
 * @returns 返回JSX元素
 */
export default defineComponent({
  name: "Layout",
  setup() {
    const { isMobile } = useResponsive();

    return {
      isMobile,
      appStore,
    };
  },
  render() {
    // 移动端则使用移动端布局
    const layoutMode = this.isMobile ? "Mobile" : this.appStore.layoutMode;

    return h(layoutMap[layoutMode]);
  },
});
