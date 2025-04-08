import type { App, Directive } from "vue";

interface CopyHTMLElement extends HTMLElement {
  _copyText: string;
}

export function install(app: App) {
  const { isSupported, copy } = useClipboard();
  const permissionWrite = usePermission("clipboard-write");

  function clipboardEnable() {
    if (!isSupported.value) {
      window.$message.error("您的浏览器不支持剪贴板API");

      return false;
    }

    if (permissionWrite.value !== "granted") {
      window.$message.error("目前不允许使用剪贴板API");

      return false;
    }

    return true;
  }

  function copyHandler(this: any) {
    if (!clipboardEnable()) return;
    copy(this._copyText).then(() => {});
    window.$message.success("复制成功");
  }

  function updateClipboard(el: CopyHTMLElement, text: string) {
    el._copyText = text;
    el.addEventListener("click", copyHandler);
  }

  const copyDirective: Directive<CopyHTMLElement, string> = {
    mounted(el, binding) {
      updateClipboard(el, binding.value);
    },
    updated(el, binding) {
      updateClipboard(el, binding.value);
    },
    unmounted(el) {
      el.removeEventListener("click", copyHandler);
    },
  };

  app.directive("copy", copyDirective);
}
