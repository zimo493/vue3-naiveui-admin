<template>
  <div ref="chart" :style="{ width, height }" />
</template>

<script lang="ts">
export default { name: "ECharts" };
</script>

<script setup lang="ts">
import type { EChartsOption } from "echarts";
import type { EChartsType } from "echarts/core";

// 系列类型的定义后缀都为 SeriesOption
import type {
  BarSeriesOption,
  GaugeSeriesOption,
  LineSeriesOption,
  PieSeriesOption,
  RadarSeriesOption,
} from "echarts/charts";

// 组件类型的定义后缀都为 ComponentOption
import type {
  DatasetComponentOption,
  GridComponentOption,
  LegendComponentOption,
  TitleComponentOption,
  ToolboxComponentOption,
  TooltipComponentOption,
} from "echarts/components";

import * as echarts from "echarts/core";
import { BarChart, LineChart, PieChart, RadarChart, GaugeChart } from "echarts/charts";

import {
  DatasetComponent, // 数据集组件
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TransformComponent, // 内置数据转换器组件 (filter, sort)
} from "echarts/components";

import { LabelLayout, UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
export type ECOption = echarts.ComposeOption<
  | BarSeriesOption
  | PieSeriesOption
  | LineSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
  | DatasetComponentOption
  | ToolboxComponentOption
  | RadarSeriesOption
  | GaugeSeriesOption
>;

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  PieChart,
  LineChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  ToolboxComponent,
  RadarChart,
  GaugeChart,
]);

const props = defineProps({
  width: { type: String, default: "100%" },
  height: { type: String, default: "500px" },
  theme: { type: String, default: "light" },
});

const chartRef = useTemplateRef<HTMLDivElement>("chart");
const chartInstance = ref<EChartsType>();

// 初始化图表
const init = async () => {
  await nextTick();
  if (!chartRef.value) return;
  // 校验 Dom 节点上是否已经挂载了 ECharts 实例，只有未挂载时才初始化
  chartInstance.value = echarts.getInstanceByDom(chartRef.value);
  if (!chartInstance.value) {
    // 初始化 ECharts 实例
    chartInstance.value = markRaw(
      echarts.init(chartRef.value, props.theme, {
        renderer: "canvas", // 设置渲染方式可为 svg或canvas 较复杂使用canvas渲染
      })
    );
  }
};

// 监听尺寸变化，自动调整
useResizeObserver(chartRef, () => {
  chartInstance.value?.resize();
});

// 初始化 options
const initOptions = async (options: EChartsOption) => {
  await nextTick();
  chartInstance.value?.clear();
  chartInstance.value?.setOption(options);
};

/** 重新渲染图表 */
const updateCharts = async (options: EChartsOption) => {
  await nextTick();
  chartInstance.value?.setOption(options);
  console.log("渲染图表", options);
  chartInstance.value?.hideLoading();
};

onMounted(() => init());
/** 容器被销毁之后，销毁实例 */
onBeforeUnmount(() => chartInstance.value?.dispose());

defineExpose({ getInstance: () => chartInstance.value, updateCharts, initOptions });
</script>
