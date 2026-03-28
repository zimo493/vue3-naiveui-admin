import { useDictSync } from "@/hooks";
import { local } from "@/utils";

/**
 * 初始化 SSE 服务
 */
export const setupSse = async () => {
  console.log("[SSE Plugin] 开始初始化 SSE 服务...");

  // 检查 token 是否存在
  const token = local.get("accessToken");

  if (!token) {
    console.warn("[SSE Plugin] 未找到访问令牌，SSE 初始化已跳过。用户登录后将自动重新连接。");

    return;
  }

  try {
    setTimeout(() => {
      const dictSync = useDictSync();

      // 初始化字典同步服务
      dictSync.initialize();
      console.log("[SSE Plugin] 字典同步服务初始化完成");

      // 在窗口关闭前断开 SSE 连接
      window.addEventListener("beforeunload", () => {
        console.log("[SSE Plugin] 窗口即将关闭，断开 SSE 连接");
        dictSync.cleanup();
      });

      console.log("[SSE Plugin] SSE 服务初始化完成");
    }, 1000);
  } catch (error) {
    console.error("[SSE Plugin] 初始化 SSE 服务失败:", error);
  }
};
