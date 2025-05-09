/**
 * 定义一个通用的定时器钩子，用于在组件存在期间定期执行某个回调函数
 *  - 此钩子还会根据页面的可见状态自动启动或停止定时器，以避免在页面不可见时执行不必要的操作
 * @param callback 定时器每次触发时执行的回调函数
 * @param interval 定时器的间隔时间，以毫秒为单位，默认为3000毫秒
 * @returns 提供了两个方法：startTicker 和 stopTicker，用于手动启动和停止定时器
 */
export function useKeepTicking(callback: () => void, interval = 3000) {
  /** 标记定时器是否正在运行 */
  let ticking = false;
  /** 存储定时器的标识符 */
  let timerId: ReturnType<typeof setInterval> | null = null;

  /**
   * 启动定时器
   * 如果定时器尚未运行，则设置定时器并开始执行回调函数
   */
  const startTicker = () => {
    if (!ticking) {
      ticking = true;
      timerId = setInterval(callback, interval);
    }
  };

  /**
   * 停止定时器
   * 如果定时器正在运行，则清除定时器并将其标识符重置为null
   */
  const stopTicker = () => {
    if (ticking) {
      ticking = false;
      if (timerId) clearInterval(timerId);
      timerId = null;
    }
  };

  /**
   * 处理页面可见性变化的回调函数
   * 根据页面是否隐藏来自动启动或停止定时器
   */
  const handleVisibilityChange = () => {
    if (document.hidden) {
      stopTicker();
    } else {
      startTicker();
    }
  };

  // 在组件挂载后执行的操作
  onMounted(() => {
    // 监听页面的可见性变化事件
    document.addEventListener("visibilitychange", handleVisibilityChange);
    // 页面加载完成时启动定时器
    startTicker();
  });

  // 在组件卸载前执行的操作
  onUnmounted(() => {
    // 移除页面的可见性变化事件监听器
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    // 组件卸载时停止定时器
    stopTicker();
  });

  // 返回手动启动和停止定时器的方法
  return {
    startTicker,
    stopTicker,
  };
}
