import { $t } from "@/utils";
import type { App, Directive } from "vue";

interface CopyHTMLElement extends HTMLElement {
  _copyText: string;
  _msg: string;
}

/**
 * TODO 1.剪贴板API兼容性
 * - 剪贴板API（如 navigator.clipboard ）在部分浏览器中只有在 HTTPS 或 localhost 下才可用。
 * - 如果你部署到服务器后用 HTTP 访问，很多现代浏览器会禁用剪贴板API，导致 isSupported.value 为 false
 *
 * TODO 2.解决建议
 * - 确保使用 HTTPS 访问 ：将你的站点配置为 HTTPS，绝大多数浏览器只在 HTTPS 下开放剪贴板API。
 * - 检查浏览器兼容性 ：确保你用的浏览器版本支持剪贴板API。可以在 MDN 文档 查看兼容性。
 * - 本地开发和生产环境差异 ：本地开发通常是 localhost，浏览器会放宽安全限制；生产环境如果不是 HTTPS，API 就不可用。
 *
 * TODO 3.临时方案
 * - 如果暂时无法上 HTTPS，可以考虑降级使用 document.execCommand('copy') 作为兼容方案，但该方法已被废弃且未来可能无法使用
 */

export function install(app: App) {
  const { isSupported, copy } = useClipboard(); // todo 兼容性 在 HTTPS 或 localhost 下才可用
  const permissionWrite = usePermission("clipboard-write");

  function clipboardEnable() {
    if (!isSupported.value) {
      window.$message.error($t("directive.nonsupportCopy"));

      return false;
    }

    if (permissionWrite.value !== "granted") {
      window.$message.error($t("directive.notAllowedCopy"));

      return false;
    }

    return true;
  }

  function handlerCopy(this: CopyHTMLElement) {
    if (!clipboardEnable()) return;
    copy(this._copyText).then(() => window.$message.success(this._msg));
  }

  function updateClipboard(el: CopyHTMLElement, text: string | { text: string; msg: string }) {
    el._copyText = typeof text === "string" ? text : text.text;
    el._msg = typeof text === "string" ? $t("directive.copySuccess") : text.msg;
    el.addEventListener("click", handlerCopy);
  }

  const copyDirective: Directive<CopyHTMLElement, string> = {
    mounted: (el, binding) => updateClipboard(el, binding.value),
    updated: (el, binding) => updateClipboard(el, binding.value),
    unmounted: (el) => el.removeEventListener("click", handlerCopy),
  };

  app.directive("copy", copyDirective);
}
