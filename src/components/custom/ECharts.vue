<template>
  <div ref="chart" :style="{ width, height }" />
</template>

<script setup lang="ts">
/** 核心类型 */
import type { EChartsOption } from "echarts";
import type { EChartsType } from "echarts/core";
/** 图表系列类型（按需添加） */
import type { BarSeriesOption, LineSeriesOption } from "echarts/charts";
/** 组件类型（按需添加） */
import type {
  // DatasetComponentOption,
  GridComponentOption,
  LegendComponentOption,
  // TitleComponentOption,
  TooltipComponentOption,
} from "echarts/components";

/** 核心模块 */
import * as echarts from "echarts/core";
/** 图表类型（按需注册） */
import { BarChart, LineChart } from "echarts/charts";
/**功能组件（按需注册） */
import {
  // DatasetComponent, // 数据集支持
  GridComponent, // 直角坐标系网格
  LegendComponent, // 图例组件
  // TitleComponent, // 标题组件
  TooltipComponent, // 提示框组件
  // TransformComponent, // 数据转换（过滤/排序）
} from "echarts/components";
/** 特性模块 */
// import { LabelLayout, UniversalTransition } from "echarts/features"; // 标签布局与过渡动画
/** 渲染器 */
import { CanvasRenderer } from "echarts/renderers"; // 使用Canvas渲染

/**
 * 自定义组合配置类型
 * 说明：通过组合实际使用的图表类型和组件类型生成完整的配置类型
 * 注意：添加新图表类型时需在此处扩展
 */
export type ECOption = echarts.ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  // | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
  // | DatasetComponentOption
>;

/** 注册必需组件（按需增减） */
echarts.use([
  /** 渲染器 */
  CanvasRenderer, // 必须注册一个渲染器

  /** 基础组件 */
  // TitleComponent, // 标题
  TooltipComponent, // 提示框
  GridComponent, // 网格系统
  LegendComponent, // 图例
  // DatasetComponent, // 数据集
  // TransformComponent, // 数据转换

  /** 图表类型 */
  BarChart, // 柱状图
  LineChart, // 折线图

  /** 特性模块 */
  // LabelLayout, // 自动标签布局
  // UniversalTransition, // 通用过渡动画
]);

defineOptions({ name: "ECharts" });

/** Props定义 */
const {
  width = "100%", // 默认容器宽度
  height = "100%", // 默认容器高度
  theme = "light", // 默认主题样式
} = defineProps({
  width: { type: String },
  height: { type: String },
  theme: { type: String },
});

/** 图表实例 */
const chartRef = useTemplateRef<HTMLDivElement>("chart"); // 图表容器引用
const chartInstance = ref<EChartsType>(); // ECharts实例引用

/** 初始化图表实例 */
const init = async () => {
  await nextTick(); // 等待DOM更新
  if (!chartRef.value) return;

  // 检查已有实例避免重复初始化
  chartInstance.value = echarts.getInstanceByDom(chartRef.value);
  if (!chartInstance.value) {
    // 创建新实例（markRaw避免不必要的响应式转换）
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
  chartInstance.value?.setOption(options); // ECharts会自动合并配置
  chartInstance.value?.hideLoading(); // 确保关闭加载动画
};

/** 挂载时初始化 */
onMounted(() => init());

/** 卸载时销毁实例释放内存 */
onBeforeUnmount(() => chartInstance.value?.dispose());

/** 监听容器尺寸变化自动调整图表 */
useResizeObserver(chartRef, () => {
  chartInstance.value?.resize();
});

/** 允许父组件访问实例和方法 */
defineExpose({
  getInstance: () => chartInstance.value, // 获取实例引用
  updateCharts, // 配置更新方法
  initOptions, // 初始化配置方法
});
</script>
