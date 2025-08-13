<template>
  <BaseChart ref="chart" />
</template>
<script lang="ts" setup>
import { EChartsOption } from "echarts";
import { useKeepTicking } from "@/hooks";

defineOptions({ name: "VehicleChargingChart" });

const chartRef = useTemplateRef("chart");

onMounted(() => {
  chartRef.value?.initOptions(options);
});
// 生成一个500到1000的随机数
const randomNum = () => Math.floor(Math.random() * 500) + 500;

const options: EChartsOption = {
  title: {
    text: "车辆充电统计",
    textStyle: { color: "#fff" },
    top: 0,
    left: 0,
  },
  tooltip: {
    trigger: "axis",
  },
  grid: {
    left: "0",
    right: "0",
    top: "20%",
    bottom: "0",
  },
  color: ["#a4d8cc", "#25f3e6"],
  xAxis: [
    {
      type: "category",
      boundaryGap: true, // 两边留白
      axisLabel: {
        color: "#ccc",
        fontSize: "12",
        rotate: 45,
      },
      data: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    },
  ],
  yAxis: {
    type: "value",
    axisLabel: { color: "#ccc", fontSize: "12" },
    axisLine: {
      lineStyle: {
        color: "rgba(160,160,160,0.3)",
      },
    },
    splitLine: {
      lineStyle: {
        color: "rgba(160,160,160,0.3)",
      },
    },
  },
  series: [
    {
      type: "line",
      name: "充电量（度）",
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 0.8,
          colorStops: [
            { offset: 0, color: "#3ae8dd" },
            { offset: 1, color: "#047ee8" },
          ],
          global: false,
        },
      },
      smooth: true,
      data: Array.from({ length: 24 }, () => randomNum()),
    },
  ],
};

useKeepTicking(() => {
  chartRef.value?.updateCharts({
    series: [{ data: Array.from({ length: 24 }, () => randomNum()) }],
  });
}, 3000);
</script>
