import { ref, onMounted, onUnmounted } from "vue";

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

export function useResponsive(breakpoints: BreakpointConfig = defaultBreakpoints) {
  const screenWidth = ref(window.innerWidth);
  const screenHeight = ref(window.innerHeight);

  // 当前屏幕类型
  const screenType = computed(() => {
    const width = screenWidth.value;

    if (width < breakpoints.xs) return "xs";
    if (width < breakpoints.sm) return "sm";
    if (width < breakpoints.md) return "md";
    if (width < breakpoints.lg) return "lg";

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

  onMounted(() => {
    window.addEventListener("resize", updateScreenSize);
    updateScreenSize();
  });

  onUnmounted(() => {
    window.removeEventListener("resize", updateScreenSize);
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
}
