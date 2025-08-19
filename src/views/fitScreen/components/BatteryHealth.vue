<template>
  <BaseChart ref="chart" flex-1 />
</template>
<script setup lang="ts">
import type { EChartsOption } from "echarts";

defineOptions({ name: "BatteryHealth" });

const chartRef = useTemplateRef("chart");

onMounted(() => {
  chartRef.value?.initOptions(options);
});

const healthRanges = ["70-75%", "75-80%", "80-85%", "85-90%", "90-95%", "95-100%"];
const healthData = [120, 350, 890, 2340, 4560, 3890];

const options: EChartsOption = {
  backgroundColor: "transparent",
  title: {
    text: "电池健康度",
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
    data: healthRanges,
    axisLine: { lineStyle: { color: "rgba(0, 255, 255, 0.5)" } },
    axisLabel: { color: "#ffffff", fontSize: 10 },
  },
  yAxis: {
    type: "value",
    name: "车辆数量",
    nameTextStyle: { color: "#00ffff" },
    axisLine: { lineStyle: { color: "rgba(0, 255, 255, 0.5)" } },
    axisLabel: { color: "#ffffff" },
    splitLine: { lineStyle: { color: "rgba(0, 255, 255, 0.1)" } },
  },
  series: [
    {
      type: "bar",
      data: healthData,
      itemStyle: {
        color(params) {
          const colors = ["#ff6b6b", "#ffc107", "#28a745", "#00ff7f", "#00ffff", "#007bff"];

          return colors[params.dataIndex];
        },
      },
      barWidth: "60%",
    },
    {
      type: "gauge",
      center: ["75%", "75%"],
      radius: "35%",
      min: 70,
      max: 100,
      startAngle: 180,
      endAngle: 0,
      axisLine: {
        lineStyle: {
          width: 8,
          color: [
            [0.2, "#ff6b6b"],
            [0.5, "#ffc107"],
            [0.8, "#00ff7f"],
            [1, "#00ffff"],
          ],
        },
      },
      pointer: {
        itemStyle: { color: "#00ffff" },
      },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: {
        color: "#ffffff",
        fontSize: 10,
      },
      title: {
        offsetCenter: [0, "80%"],
        fontSize: 12,
        color: "#00ffff",
      },
      detail: {
        fontSize: 16,
        offsetCenter: [0, "60%"],
        valueAnimation: true,
        formatter: "{value}%",
        color: "#00ffff",
      },
      data: [{ value: 87.5, name: "平均SOH" }],
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
