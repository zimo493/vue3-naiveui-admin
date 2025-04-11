<template>
  <n-flex vertical flex-1 align="center" justify="center">
    <n-text type="primary">
      <Icones :size="48" icon="line-md:loading-twotone-loop" />
    </n-text>
  </n-flex>
</template>

<script lang="ts">
export default { name: "ContentLoading" };
</script>
