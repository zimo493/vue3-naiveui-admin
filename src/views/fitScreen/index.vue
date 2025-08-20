<template>
  <div class="dataScreen-container">
    <!-- 动态粒子背景 -->
    <!-- <DynamicCanvas /> -->
    <!-- 适配屏幕容器 -->
    <div v-fit-screen p-t-10px flex flex-col>
      <!-- 头部区域 -->
      <Cephalosome />

      <!-- 图表区域 -->
      <div flex-1 p-10px flex gap="10px" relative>
        <!-- 漂浮地图 -->
        <MapChart />
        <!-- 左侧图表 -->
        <LeftCharts />
        <!-- 中间图表 -->
        <CenterCharts />
        <!-- 右侧图表 -->
        <RightCharts />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import "./assets/styles/index.scss";

defineOptions({ name: "FitScreen" });

onMounted(() => {
  window.$message.info("此页面数据均为模拟数据，仅用于演示。没有任何实际依据！", {
    showIcon: false,
    duration: 10000,
  });
});
</script>
