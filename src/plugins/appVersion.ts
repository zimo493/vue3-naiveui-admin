import { NButton } from "naive-ui";
import { $t, parseTime } from "@/utils";

export const setupAppVersion = () => {
  const { buildTimestamp } = __APP_INFO__;

  /**
   * 刷新提示
   */
  let showRefresh = false;

  /**
   * 监听页面可见性改变
   */
  document.addEventListener("visibilitychange", async () => {
    const prerequisite: boolean[] = [
      !showRefresh, // 刷新提示未显示
      document.visibilityState === "visible", // 页面可见
      !import.meta.env.DEV, // 非开发环境
    ];

    /**
     * 所有条件都满足时，检查是否需要刷新
     */
    if (!prerequisite.every(Boolean)) return;

    const buildTime = await getBuildTimestamp();

    if (buildTime === 0) return;
    if (buildTime === buildTimestamp) return;

    showRefresh = true;

    /**
     * 创建通知
     */
    window.$notification?.create({
      title: $t("app.systemUpdateTitle"),
      content: $t("app.systemUpdateContent"),
      avatar: () => h("div", "🎉"),
      meta: parseTime(buildTimestamp),
      closable: false,
      action: () =>
        h(
          NButton,
          { strong: true, type: "primary", onClick: () => location.reload() },
          (): string => $t("app.refreshNow")
        ),
    });
  });
};

/**
 * 获取构建时间戳
 * @returns {Promise<number>} 构建时间戳
 */
const getBuildTimestamp = async (): Promise<number> => {
  try {
    const baseURL = import.meta.env.VITE_BASE_URL || "/";

    // 添加随机参数避免缓存
    const cacheBuster = `?t=${Date.now()}`;
    const res = await fetch(`${baseURL}index.html${cacheBuster}`);

    // 检查响应状态
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const html = await res.text();

    // 使用正则表达式匹配时间戳
    const match = html.match(/<meta\s+name="buildTime"\s+content="([^"]+)"\s*\/?>/i);

    // 双重验证
    if (!match?.[1]) return 0;

    const timestamp = Number(match[1]);

    return isNaN(timestamp) ? 0 : timestamp;
  } catch (error) {
    console.error("Failed to get build timestamp:", error);

    return 0;
  }
};
