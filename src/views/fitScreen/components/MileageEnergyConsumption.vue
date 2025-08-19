<template>
  <BaseChart ref="chart" flex-1 />
</template>
<script setup lang="ts">
import type { EChartsOption } from "echarts";

defineOptions({ name: "MileageEnergyConsumption" });

const chartRef = useTemplateRef("chart");

onMounted(() => {
  chartRef.value?.initOptions(options);
});

const days = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
const mileageData = [1250, 1180, 1320, 1450, 1380, 980, 850];
const energyData = [18.5, 17.8, 19.2, 18.9, 18.1, 16.5, 15.8];

const options: EChartsOption = {
  backgroundColor: "transparent",
  title: {
    text: "里程与能耗分析",
    textStyle: {
      color: "#fff",
      fontSize: 20,
      fontFamily: "YouSheBiaoTiHei,Arial,sans-serif",
      fontWeight: "normal",
    },
    top: 0,
    left: "center",
  },
  grid: {
    left: 0,
    right: "2%",
    top: "20%",
    bottom: 0,
  },
  xAxis: {
    type: "category",
    data: days,
    axisLine: { lineStyle: { color: "rgba(0, 255, 255, 0.5)" } },
    axisLabel: { color: "#ffffff" },
  },
  yAxis: [
    {
      type: "value",
      name: "km",
      nameTextStyle: { color: "#00ff7f" },
      axisLine: { lineStyle: { color: "rgba(0, 255, 127, 0.5)" } },
      axisLabel: { color: "#00ff7f" },
      splitLine: { show: false },
    },
    {
      type: "value",
      name: "kWh/100km",
      nameTextStyle: { color: "#00ffff" },
      axisLine: { lineStyle: { color: "rgba(0, 255, 255, 0.5)" } },
      axisLabel: { color: "#00ffff" },
      splitLine: { lineStyle: { color: "rgba(0, 255, 255, 0.1)" } },
    },
  ],
  series: [
    {
      name: "日行驶里程",
      type: "bar",
      yAxisIndex: 0,
      data: mileageData,
      itemStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: "#00ff7f" },
            { offset: 1, color: "rgba(0, 255, 127, 0.3)" },
          ],
          global: false,
        },
      },
    },
    {
      name: "平均能耗",
      type: "line",
      yAxisIndex: 1,
      data: energyData,
      lineStyle: { color: "#00ffff", width: 3 },
      symbol: "circle",
      symbolSize: 6,
      itemStyle: { color: "#00ffff" },
    },
  ],
  tooltip: {
    trigger: "axis",
    backgroundColor: "rgba(26, 35, 50, 0.9)",
    borderColor: "rgba(0, 255, 255, 0.5)",
    textStyle: { color: "#ffffff" },
  },
};
</script>
