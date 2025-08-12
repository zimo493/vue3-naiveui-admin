import type { App, Directive, DirectiveBinding } from "vue";

// 根据浏览器大小推断缩放比例
const getScale = (width: number, height: number): number => {
  // 添加输入验证，避免无效值
  if (width <= 0 || height <= 0) {
    console.warn("Invalid width or height provided to getScale function");

    return 1; // 返回默认缩放比例
  }

  const ww: number = window.innerWidth / width;
  const wh: number = window.innerHeight / height;

  // 是否为有限数值
  if (!isFinite(ww) || !isFinite(wh)) {
    console.warn("Invalid width or height provided to getScale function");

    return 1;
  }

  // 添加最小值限制，避免返回过小的缩放值
  return Math.min(ww, wh);
};
// 设置响应式
const resize = (el: HTMLElement, width: number, height: number) => {
  return (): void => {
    el.style.transform = `scale(${getScale(width, height)}) translate(-50%, -50%)`;
  };
};

export function install(app: App) {
  const fitScreen: Directive<HTMLElement, { width?: number; height?: number }> = {
    mounted(el: HTMLElement, binding: DirectiveBinding): void {
      const value = binding.value ?? {};
      const { width = 1920, height = 1080 } = value;

      Object.assign(el.style, {
        top: "50%",
        left: "50%",
        zIndex: "999",
        width: `${width}px`,
        height: `${height}px`,
        position: "fixed",
        transition: "all 0.3s",
        transformOrigin: "top left",
        transform: `scale(${getScale(width, height)}) translate(-50%, -50%)`,
      });

      window.addEventListener("resize", resize(el, width, height));
    },
    unmounted(el: HTMLElement, binding: DirectiveBinding): void {
      const value = binding.value ?? {};
      const { width = 1920, height = 1080 } = value;

      window.removeEventListener("resize", resize(el, width, height));
    },
  };

  app.directive("fitScreen", fitScreen);
}
