import { type NotificationReactive, NButton, NFlex } from "naive-ui";
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
    const n: NotificationReactive = window.$notification?.create({
      title: $t("app.systemUpdateTitle"),
      content: $t("app.systemUpdateContent"),
      avatar: () => h("div", "🎉"),
      meta: parseTime(buildTimestamp),
      action: () =>
        h(NFlex, { wrap: false }, () => [
          h(
            NButton,
            {
              strong: true,
              secondary: true,
              type: "tertiary",
              onClick: () => n?.destroy(), // 忽略
            },
            (): string => $t("app.laterOn")
          ),
          h(
            NButton,
            { strong: true, type: "primary", onClick: () => location.reload() },
            (): string => $t("app.refreshNow")
          ),
        ]),
      onClose: () => (showRefresh = false),
    });
  });
};

/**
 * 获取构建时间戳
 * @returns {Promise<number>} 构建时间戳
 */
const getBuildTimestamp = async (): Promise<number> => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const res: Response = await fetch(`${baseURL}index.html`);
  const html: string = await res.text();
  // 匹配出打包时间
  // const match: RegExpMatchArray | null = html.match(
  //   /<meta name="buildTime" content="(.*?)" \/>/
  // );
  const match: RegExpMatchArray | null = html.match(/<meta name="buildTime" content="(.*)">/);

  return match ? (isNaN(Number(match?.[1])) ? 0 : Number(match?.[1])) : 0;
};
