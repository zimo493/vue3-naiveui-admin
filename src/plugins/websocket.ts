import { useDictSync } from "@/hooks";
import { local } from "@/utils";

/**
 * 初始化WebSocket服务
 */
export const setupWebSocket = async () => {
  console.log("[WebSocketPlugin] 开始初始化WebSocket服务...");

  // 检查token是否存在
  const token = local.get("accessToken");

  if (!token) {
    console.warn(
      "[WebSocketPlugin] 未找到访问令牌，WebSocket初始化已跳过。用户登录后将自动重新连接。"
    );

    return;
  }

  try {
    const dictWebSocket = useDictSync();

    // 初始化字典WebSocket服务
    await dictWebSocket.initWebSocket();
    console.log("[WebSocketPlugin] 字典WebSocket初始化完成");

    // 在窗口关闭前断开WebSocket连接
    window.addEventListener("beforeunload", () => {
      console.log("[WebSocketPlugin] 窗口即将关闭，断开WebSocket连接");
      dictWebSocket.closeWebSocket();
    });

    console.log("[WebSocketPlugin] WebSocket服务初始化完成");
  } catch (error) {
    console.error("[WebSocketPlugin] 初始化WebSocket服务失败:", error);
  }
};
