<template>
  <div class="page-container">
    <n-card :bordered="false" class="page-content mb-4">
      <h3 class="mb-2 text-16px font-600">{{ t("routeCache.title") }}</h3>
      <p class="text-13px text-[var(--n-text-color-3)]">{{ t("routeCache.desc") }}</p>
    </n-card>

    <n-card :bordered="false" class="page-content" :title="t('routeCache.cardTitle')">
      <n-alert type="info" :bordered="false">
        <template #header>{{ t("routeCache.howTo") }}</template>
        {{ t("routeCache.howToDesc") }}
      </n-alert>

      <n-input v-model:value="inputText" class="mt-4" :placeholder="t('routeCache.placeholder')" />

      <n-grid class="mt-4" :cols="3" :x-gap="16">
        <n-grid-item v-for="item in counters" :key="item.label">
          <div class="flex items-center justify-between p-3 bg-[var(--n-action-color)] rounded-md">
            <span class="text-13px text-[var(--n-text-color-3)]">{{ item.label }}</span>
            <span class="text-20px font-600 text-[var(--n-text-color-link)]">{{ item.value }}</span>
          </div>
        </n-grid-item>
      </n-grid>
    </n-card>
  </div>
</template>

<script lang="ts">
// 模块作用域计数：组件实例被销毁重建时会继续累加，用它判断缓存是命中还是失效
let mountedTotal = 0;
</script>

<script setup lang="ts">
defineOptions({
  name: "RouteCache",
});

const { t } = useI18n();

// 缓存观察用的输入内容
const inputText = ref("");

const mountedCount = ref(mountedTotal);
const activatedCount = ref(0);
const deactivatedCount = ref(0);

const counters = computed(() => [
  { label: t("routeCache.mounted"), value: mountedCount.value },
  { label: t("routeCache.activated"), value: activatedCount.value },
  { label: t("routeCache.deactivated"), value: deactivatedCount.value },
]);

onMounted(() => {
  mountedTotal += 1;
  mountedCount.value = mountedTotal;
});

onActivated(() => {
  activatedCount.value += 1;
});

onDeactivated(() => {
  deactivatedCount.value += 1;
});
</script>
