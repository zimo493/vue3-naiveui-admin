import { useDictStoreHook } from "@/store";
import { useSse } from "../core/useSse";

// 字典消息类型
export interface DictMessage {
  dictCode: string;
  timestamp: number;
}

// 字典事件回调类型
export type DictMessageCallback = (message: DictMessage) => void;

// 全局单例实例
let instance: ReturnType<typeof createDictSyncHook> | null = null;

/**
 * 创建字典同步Hook
 * 负责监听后端字典变更并同步到前端
 */
const createDictSyncHook = () => {
  const dictStore = useDictStoreHook();

  const sse = useSse();

  // 消息回调函数列表
  const messageCallbacks = ref<DictMessageCallback[]>([]);

  let unsubscribe: (() => void) | null = null;

  /**
   * 注册字典消息回调
   * @param callback 回调函数
   */
  const onDictMessage = (callback: DictMessageCallback) => {
    messageCallbacks.value.push(callback);

    return () => {
      // 返回取消注册的函数
      const index = messageCallbacks.value.indexOf(callback);

      if (index !== -1) {
        messageCallbacks.value.splice(index, 1);
      }
    };
  };

  /**
   * 初始化 SSE 连接
   */
  const initialize = () => {
    sse.connect();
    unsubscribe = sse.on("dict-change", handleDictEvent);
  };

  /**
   * 关闭 SSE 连接
   */
  const cleanup = () => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  };

  /**
   * 处理字典事件
   * @param data SSE 消息数据
   */
  const handleDictEvent = (data: any) => {
    try {
      const dictCode = data.dictCode;

      if (!dictCode) return;

      // 清除缓存，等待按需加载
      dictStore.removeDict(dictCode);
      console.log(`字典缓存已清除: ${dictCode}`);

      // 调用所有注册的回调函数
      messageCallbacks.value.forEach((callback) => {
        try {
          callback(data);
        } catch (callbackError) {
          console.error("[SSE] 回调执行失败:", callbackError);
        }
      });
    } catch (error) {
      console.error("[SSE] 解析消息失败:", error);
    }
  };

  return {
    isConnected: sse.isConnected,
    connectionState: sse.connectionState,
    initialize,
    cleanup,
    onDictMessage,
  };
};

/**
 * 字典同步Hook
 * 用于监听后端字典变更并同步到前端
 */
export const useDictSync = () => {
  if (!instance) {
    instance = createDictSyncHook();
  }

  return instance;
};
