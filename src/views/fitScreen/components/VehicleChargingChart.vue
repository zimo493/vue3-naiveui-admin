<template>
  <BaseChart ref="chart" />
</template>
<script lang="ts" setup>
import { EChartsOption } from "echarts";

defineOptions({ name: "VehicleChargingChart" });

const chartRef = useTemplateRef("chart");

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
    top: "18%",
    bottom: "0%",
  },
  color: ["#a4d8cc", "#25f3e6"],
  xAxis: [
    {
      type: "category",
      boundaryGap: false,
      axisLabel: {
        color: "#ccc",
        fontSize: "12",
        rotate: 45,
      },
      data: [
        "0时",
        "1时",
        "2时",
        "3时",
        "4时",
        "5时",
        "6时",
        "7时",
        "8时",
        "9时",
        "10时",
        "11时",
        "12时",
        "13时",
        "14时",
        "15时",
        "16时",
        "17时",
        "18时",
        "19时",
        "20时",
        "21时",
        "22时",
        "23时",
      ],
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
            { offset: 0, color: "#25f3e6" },
            { offset: 1, color: "#0089ff" },
          ],
          global: false,
        },
      },
      smooth: true,
      data: [
        710, 312, 321, 754, 500, 830, 710, 521, 504, 660, 530, 410, 710, 312, 321, 754, 500, 830,
        710, 521, 504, 660, 530, 410,
      ],
    },
  ],
};

onMounted(() => {
  chartRef.value?.initOptions(options);
});
</script>
