<!-- wangEditor富文本编辑器示例 -->
<script setup lang="ts">
import WangEditor from "@/components/WangEditor.vue";

const value = ref("初始化内容");
</script>

<template>
  <n-flex vertical>
    <WangEditor v-model="value" />
    <n-card>
      <n-code :code="value" language="xml" word-wrap />
    </n-card>
  </n-flex>
</template>
