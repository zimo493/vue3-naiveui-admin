<template>
  <div ref="chart" wh-full />
</template>
<script lang="ts" setup>
import type { EChartsOption } from "echarts";
import type { EChartsType } from "echarts/core";

// 核心模块
import * as echarts from "echarts/core";
// 图表类型
import { EffectScatterChart, LinesChart } from "echarts/charts";
// 组件
import { GeoComponent, LegendComponent } from "echarts/components";
// 渲染器
import { CanvasRenderer } from "echarts/renderers";

// 按需注册组件
echarts.use([CanvasRenderer, GeoComponent, EffectScatterChart, LegendComponent, LinesChart]);

import chinaGeoJSON from "../assets/chinaGeoJSON.json";
import getSeriesData from "../utils/seriesData";

defineOptions({ name: "MapChart" });

const { theme = "light" } = defineProps({
  theme: { type: String },
});

const eriesData = getSeriesData(50);

const option: EChartsOption = {
  legend: { show: false },
  geo: {
    map: "china",
    zoom: 1.25, // 缩放比例
    center: [104.3, 29.5], // 中心点
    label: { show: true },
    emphasis: {
      itemStyle: { areaColor: "#071537" },
    },
    itemStyle: {
      areaColor: "rgba(7,21,57,0.5)",
      borderColor: "#0177ff",
    },
    roam: true,
  },
  series: [
    {
      name: "地点",
      type: "effectScatter",
      coordinateSystem: "geo",
      rippleEffect: { brushType: "stroke" },

      emphasis: {
        label: {
          show: true,
          position: "right",
          formatter: "{b}",
        },
        itemStyle: { color: "#46bee9" },
      },
      showEffectOn: "render",
      data: eriesData.cityData,
    },
    {
      name: "线路",
      type: "lines",
      coordinateSystem: "geo",
      effect: {
        show: true,
        symbol: "arrow",
        symbolSize: 5,
        trailLength: 0,
      },
      lineStyle: {
        color: "#58B3CC",
        curveness: 0.08,
      },
      data: eriesData.moveLines,
    },
  ],
};

const chartRef = useTemplateRef<HTMLDivElement>("chart");
const chartInstance = ref<EChartsType>();

const init = async () => {
  await nextTick();
  if (!chartRef.value) return;

  chartInstance.value = echarts.getInstanceByDom(chartRef.value);
  if (!chartInstance.value) {
    echarts.registerMap("china", chinaGeoJSON as any);

    chartInstance.value = markRaw(
      echarts.init(chartRef.value, theme, {
        renderer: "canvas",
      })
    );

    chartInstance.value.setOption(option);
  }
};

onMounted(() => init());

onBeforeUnmount(() => chartInstance.value?.dispose());

defineExpose({
  updateCharts: () => {
    const seriesData = getSeriesData(50);

    chartInstance.value?.setOption({
      series: [{ data: seriesData.cityData }, { data: seriesData.moveLines }],
    });
  },
});
</script>
