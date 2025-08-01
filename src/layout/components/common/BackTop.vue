<template>
  <n-back-top :visibility-height="300">
    <n-tooltip placement="left" trigger="hover">
      <template #trigger>
        <div wh-full flex-center>
          <icon-park-outline-to-top />
        </div>
      </template>
      <span>{{ t("common.backToTop") }}</span>
    </n-tooltip>
  </n-back-top>
</template>
<script lang="ts" setup>
const { t } = useI18n();
</script>
