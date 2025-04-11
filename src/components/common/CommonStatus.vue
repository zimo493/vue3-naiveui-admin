<template>
  <n-tag :bordered="bordered" :type="value === 1 ? 'success' : 'error'">
    {{ value === 1 ? "正常" : "禁用" }}
  </n-tag>
</template>
<script lang="ts">
export default { name: "CommonStatus" };
</script>
<script lang="ts" setup>
defineProps({
  value: {
    required: true,
    type: Number,
  },
  round: {
    type: Boolean,
    default: false,
  },
  bordered: {
    type: Boolean,
    default: false,
  },
});
</script>
