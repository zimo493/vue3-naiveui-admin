<template>
  <n-flex vertical>
    <n-alert type="warning">菜单三级-2 （当前页面不被缓存）</n-alert>
    <n-input v-model:value="msg" placeholder="请输入文字测试缓存" />
  </n-flex>
</template>
<script lang="ts" setup>
defineOptions({ name: "Multilevel32" });
const msg = ref("");
</script>
