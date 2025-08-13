<template>
  <div
    bg="[rgba(0,24,106,0.4)]"
    rounded="[4px]"
    p-x-2
    p-y-3
    wh-full
    relative
    z-90
    class="border border-[#20558b]"
  >
    <div ref="chart" wh-full />
  </div>
</template>

<script lang="ts" setup>
/** 核心类型 */
import type { EChartsOption } from "echarts";
import type { EChartsType } from "echarts/core";

/** 核心模块 */
import * as echarts from "echarts/core";
/** 图表类型（按需注册） */
import { BarChart, LineChart } from "echarts/charts";
/**功能组件（按需注册） */
import {
  GridComponent, // 直角坐标系网格
  LegendComponent, // 图例组件
  TooltipComponent, // 提示框组件
  TitleComponent, // 标题组件
} from "echarts/components";

/** 渲染器 */
import { CanvasRenderer } from "echarts/renderers"; // 使用Canvas渲染

/** 注册必需组件（按需增减） */
echarts.use([
  /** 渲染器 */
  CanvasRenderer,

  TitleComponent, // 标题
  TooltipComponent, // 提示框
  GridComponent, // 网格系统
  LegendComponent, // 图例

  /** 图表类型 */
  BarChart, // 柱状图
  LineChart, // 折线图
]);

defineOptions({ name: "BaseChart" });

const { theme = "light" } = defineProps({
  theme: { type: String },
});

const chartRef = useTemplateRef<HTMLDivElement>("chart");
const chartInstance = ref<EChartsType>();

/** 初始化图表实例 */
const init = async () => {
  await nextTick();
  if (!chartRef.value) return;

  chartInstance.value = echarts.getInstanceByDom(chartRef.value);
  if (!chartInstance.value) {
    chartInstance.value = markRaw(
      echarts.init(chartRef.value, theme, {
        renderer: "canvas", // 指定渲染模式（canvas性能更好）
      })
    );
  }
};

/** 初始化配置（清空后设置） */
const initOptions = async (options: EChartsOption) => {
  await nextTick();
  chartInstance.value?.clear(); // 清空旧配置
  chartInstance.value?.setOption(options); // 应用新配置
};

/** 更新图表配置（增量更新） */
const updateCharts = async (options: EChartsOption) => {
  await nextTick();
  chartInstance.value?.setOption(options);
  // chartInstance.value?.hideLoading();
};

onMounted(() => init());

onBeforeUnmount(() => chartInstance.value?.dispose());

defineExpose({
  initOptions,
  updateCharts,
});
</script>
