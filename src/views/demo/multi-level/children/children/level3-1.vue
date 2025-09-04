<template>
  <n-flex vertical>
    <n-alert type="success">菜单三级-1 （当前页面被缓存）</n-alert>
    <n-input v-model:value="msg" placeholder="请输入文字测试缓存" />
  </n-flex>
</template>
<script lang="ts" setup>
defineOptions({ name: "Multilevel31" });
const msg = ref("");
</script>
