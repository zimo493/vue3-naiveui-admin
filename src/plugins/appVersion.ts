import { NButton } from "naive-ui";
import { $t, formatDateTime } from "@/utils";

export const setupAppVersion = () => {
  const { buildTimestamp } = __APP_INFO__;

  /**
   * 刷新提示是否已显示
   */
  let showRefresh = false;

  /**
   * 检查是否有新版本
   */
  const checkVersion = async () => {
    const prerequisite: boolean[] = [
      !showRefresh, // 刷新提示未显示
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
     * 使用 notification 而非 dialog，不打断用户操作
     */
    window.$notification?.create({
      title: $t("app.systemUpdateTitle"),
      content: $t("app.systemUpdateContent"),
      avatar: () => h("div", "🎉"),
      meta: formatDateTime(buildTimestamp),
      duration: 0, // 不自动关闭
      closable: true,
      onClose: () => {
        showRefresh = false;
      },
      action: () =>
        h(
          NButton,
          { strong: true, type: "primary", onClick: () => location.reload() },
          (): string => $t("app.refreshNow")
        ),
    });
  };

  /**
   * 监听页面可见性改变：用户从其他标签页切回时立即检测
   */
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) void checkVersion();
  });

  /**
   * 启动后检查一次，无需等待首次轮询
   */
  void checkVersion();

  /**
   * 定时轮询，无需等待用户切换标签页
   */
  setInterval(checkVersion, 5 * 60_000);
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
