<template>
  <BaseChart ref="chart" flex-1 />
</template>
<script lang="ts" setup>
import { type EChartsOption } from "echarts";

defineOptions({ name: "VehicleDistribution" });

const chartRef = useTemplateRef("chart");

onMounted(() => {
  chartRef.value?.initOptions(options);
});

// 以下数据仅模拟
const geoData = [
  { name: "北京", value: [116.46, 39.92, 2340] },
  { name: "上海", value: [121.48, 31.22, 1890] },
  { name: "深圳", value: [114.07, 22.62, 1560] },
  { name: "成都", value: [104.06, 30.67, 890] },
  { name: "西安", value: [108.95, 34.27, 780] },
  { name: "武汉", value: [114.31, 30.52, 720] },
  { name: "南京", value: [118.78, 32.04, 650] },
  { name: "重庆", value: [106.54, 29.59, 580] },
  { name: "长沙", value: [113.01, 28.21, 520] },
  { name: "合肥", value: [117.27, 31.86, 1226] },
];

const options: EChartsOption = {
  backgroundColor: "transparent",
  title: {
    text: "车辆分布热力图",
    textStyle: {
      color: "#fff",
      fontSize: 20,
      fontFamily: "YouSheBiaoTiHei,Arial,sans-serif",
      fontWeight: "normal",
    },
    top: 0,
    left: "center",
  },
  tooltip: {
    trigger: "item",
    backgroundColor: "rgba(26, 35, 50, 0.9)",
    borderColor: "rgba(0, 255, 255, 0.5)",
    textStyle: { color: "#ffffff" },
    formatter(params: any) {
      return params.name + "<br/>车辆数: " + params.value[2];
    },
  },
  grid: {
    left: "8%",
    right: "8%",
    top: "13%",
    bottom: 0,
  },
  xAxis: {
    type: "value",
    name: "经度",
    nameTextStyle: { color: "#00ffff" },
    axisLine: { lineStyle: { color: "rgba(0, 255, 255, 0.5)" } },
    axisLabel: { color: "#ffffff", fontSize: 10 },
    splitLine: { lineStyle: { color: "rgba(0, 255, 255, 0.1)" } },
    min: 100,
    max: 125,
  },
  yAxis: {
    type: "value",
    name: "纬度",
    nameTextStyle: { color: "#00ffff" },
    axisLine: { lineStyle: { color: "rgba(0, 255, 255, 0.5)" } },
    axisLabel: { color: "#ffffff", fontSize: 10 },
    splitLine: { lineStyle: { color: "rgba(0, 255, 255, 0.1)" } },
    min: 20,
    max: 50,
  },
  series: [
    {
      type: "scatter",
      data: geoData,
      symbolSize(val) {
        return Math.max(val[2] / 100, 8);
      },
      itemStyle: {
        color(params: any) {
          const colors = ["#00ffff", "#00ff7f", "#ffc107", "#ff6b6b"];
          const index = Math.floor(params.value[2] / 600);

          return colors[Math.min(index, 3)];
        },
        shadowBlur: 10,
        shadowColor: "#00ffff",
        opacity: 0.8,
      },
      label: {
        show: true,
        formatter: "{b}",
        position: "top",
        color: "#ffffff",
        fontSize: 10,
      },
    },
  ],
};
</script>
