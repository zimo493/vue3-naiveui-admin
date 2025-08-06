<template>
  <n-flex vertical flex-1 align="center" justify="center">
    <n-text type="info">
      <Icones :size="48" icon="line-md:loading-twotone-loop" />
    </n-text>
    <n-text type="info">{{ $t("common.loading") }}</n-text>
  </n-flex>
</template>

<script lang="ts" setup>
defineOptions({ name: "ContentLoading" });
import { $t } from "@/utils";
</script>
