<script lang="ts" setup>
defineOptions({ name: "AppLoading" });
</script>

<template>
  <div id="loading-container">
    <ContentLoading />
  </div>
</template>

<style scoped>
#loading-container {
  position: fixed;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 15vh;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
}
</style>
