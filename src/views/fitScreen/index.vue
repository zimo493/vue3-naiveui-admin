<template>
  <div class="dataScreen-container">
    <!-- 动态粒子背景 -->
    <!-- <DynamicCanvas /> -->
    <!-- 适配屏幕容器 -->
    <div v-fit-screen p-t-10px flex flex-col>
      <!-- 头部区域 -->
      <div class="dataScreen-header">
        <!-- 头部内容 -->
        <div flex-center h-full overflow-hidden>
          <!-- 左侧内容 -->
          <div class="leftHead"></div>
          <!-- 中间标题 -->
          <!-- 新能源汽车联网平台数据概览 -->
          <div class="title">111111111</div>
          <!-- 右侧内容 -->
          <div class="rightHead">
            <!-- 实时时间 -->
            <div class="dateTime">{{ dateTime }}</div>
          </div>
        </div>
        <!-- 装饰线 -->
        <div class="lines" left="[10%]" />
        <div class="lines" right="[10%]" rotate="180" />
        <div class="ray" />
      </div>
      <!-- 图表区域 -->
      <div flex-1 p-10px flex gap="10px" relative>
        <!-- 地图 -->
        <div absolute inset-0 z-1>
          <MapChart ref="mapChart" />
        </div>
        <!-- 左侧图表 -->
        <div class="leftChart"></div>
        <!-- 中间图表 -->
        <div class="centerChart">
          <n-flex align="end" z-999 pt-5 font="[YouSheBiaoTiHei,Arial,sans-serif]">
            <n-text text-24px>实时行驶车辆</n-text>
            <div font-900 text-36px p-x-3 p-y-1 bg="[#0089ff]" rounded="[6px]" leading-none>
              <n-number-animation show-separator :from="oldCarNum" :to="carNum" />
            </div>
          </n-flex>
          <div class="vehicleCharging">
            <VehicleChargingChart />
          </div>
        </div>
        <!-- 右侧图表 -->
        <div class="rightChart"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { parseTime } from "@/utils";
import { useKeepTicking } from "@/hooks";

import "./assets/styles/index.scss";

defineOptions({ name: "FitScreen" });

/**
 * 获取当前时间
 */
const dateTime = ref("加载中...");
const getCurrentTime = () => (dateTime.value = parseTime(new Date()));

// 使用定时器钩子更新时间
useKeepTicking(getCurrentTime, 1000);

/**
 * 地图图表
 */
const mapChartRef = useTemplateRef("mapChart");

// 生成一个一万到两万的随机数
const randomNum = () => Math.floor(Math.random() * 10000 + 10000);
// 行驶车辆数
const carNum = ref(randomNum());
const oldCarNum = ref(0); // 旧数据

watch(
  () => carNum.value,
  (_, o) => {
    oldCarNum.value = o;
  }
);

// 定时更新地图图表
useKeepTicking(() => {
  mapChartRef.value?.updateCharts();
  carNum.value = randomNum();
}, 6 * 1000);
</script>
