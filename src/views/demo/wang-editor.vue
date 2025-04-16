<!-- wangEditor富文本编辑器示例 -->
<script setup lang="ts">
import WangEditor from "@/components/custom/WangEditor/index.vue";

const value = ref("初始化内容");
</script>

<template>
  <n-space vertical>
    <WangEditor v-model="value" />
    <n-input v-model:value="value" :autosize="{ minRows: 10 }" readonly type="textarea" />
  </n-space>
</template>
