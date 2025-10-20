export interface BreakpointConfig {
  xs: number; // 手机
  sm: number; // 平板
  md: number; // 小型桌面
  lg: number; // 大型桌面
  xl: number; // 超大桌面
}

const defaultBreakpoints: BreakpointConfig = {
  xs: 576,
  sm: 768,
  md: 992,
  lg: 1200,
  xl: 1600,
};

export const useResponsive = (breakpoints: BreakpointConfig = defaultBreakpoints) => {
  const screenWidth = ref(window.innerWidth);
  const screenHeight = ref(window.innerHeight);

  // 当前屏幕类型
  const screenType = computed(() => {
    const width = screenWidth.value;

    // 使用排序和循环优化断点判断逻辑，提高可维护性
    const sortedBreakpoints = Object.entries(breakpoints)
      .sort(([, a], [, b]) => a - b)
      .slice(0, -1); // 移除最后一个元素(xl)，因为它作为默认返回值

    for (const [key, value] of sortedBreakpoints) {
      if (width < value) return key;
    }

    return "xl";
  });

  // 是否为移动端
  const isMobile = computed(() => screenType.value === "xs");

  // 是否为平板
  const isTablet = computed(() => screenType.value === "sm");

  // 是否为小屏设备（手机+平板）
  const isSmallScreen = computed(() => ["xs", "sm"].includes(screenType.value));

  // 更新屏幕尺寸
  const updateScreenSize = () => {
    screenWidth.value = window.innerWidth;
    screenHeight.value = window.innerHeight;
  };

  // 防抖函数，避免频繁触发resize事件
  const debouncedUpdateScreenSize = useDebounceFn(updateScreenSize, 150);

  onMounted(() => {
    window.addEventListener("resize", debouncedUpdateScreenSize);
    updateScreenSize();
  });

  onUnmounted(() => {
    window.removeEventListener("resize", debouncedUpdateScreenSize);
  });

  return {
    screenWidth: readonly(screenWidth),
    screenHeight: readonly(screenHeight),
    screenType: readonly(screenType),
    isMobile: readonly(isMobile),
    isTablet: readonly(isTablet),
    isSmallScreen: readonly(isSmallScreen),
    breakpoints,
  };
};
