import { defineComponent, h } from "vue";

/**
 * 渲染函数
 * @returns 返回JSX元素
 */
export default defineComponent({
  name: "Layout",
  render: () => {
    return h("div", null, "layout");
  },
});
