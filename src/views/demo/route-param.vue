<template>
  <div class="page-container">
    <n-card :bordered="false" class="page-content mb-4">
      <h3 class="mb-2 text-16px font-600">{{ t("routeParam.title") }}</h3>
      <p class="mb-4 text-13px text-[var(--n-text-color-3)]">{{ t("routeParam.desc") }}</p>
      <n-descriptions bordered :column="2" size="small" label-placement="left">
        <n-descriptions-item :label="t('routeParam.fullPath')">
          <code>{{ route.fullPath }}</code>
        </n-descriptions-item>
        <n-descriptions-item :label="t('routeParam.query')">
          <code>{{ JSON.stringify(route.query) }}</code>
        </n-descriptions-item>
      </n-descriptions>
    </n-card>

    <n-card :bordered="false" class="page-content" :title="t('routeParam.flowTitle')">
      <div class="flex flex-wrap items-center gap-2.5">
        <template v-for="(node, index) in flowNodes" :key="node.label">
          <div class="flex flex-col gap-1 py-2.5 px-3.5 bg-[var(--n-action-color)] rounded-md">
            <span class="text-12px text-[var(--n-text-color-3)]">{{ node.label }}</span>
            <code class="text-13px text-[var(--n-text-color-link)]">{{ node.code }}</code>
          </div>
          <span v-if="index < flowNodes.length - 1" class="text-[var(--n-text-color-3)]">→</span>
        </template>
      </div>
    </n-card>

    <n-card :bordered="false" class="page-content mt-4">
      <template #header>
        <div class="flex items-center justify-between">
          <span>{{ t("routeParam.viewTitle") }}</span>
          <code class="param-query">?type={{ currentType }}</code>
        </div>
      </template>

      <n-radio-group :value="currentType" class="mb-4" @update:value="switchView">
        <n-radio-button v-for="item in views" :key="item.value" :value="item.value">
          {{ item.label }}
        </n-radio-button>
      </n-radio-group>

      <n-data-table
        v-if="currentType === 'staff'"
        :columns="employeeColumns"
        :data="employees"
        :bordered="false"
        size="small"
      />

      <n-grid v-else :cols="4" :x-gap="16">
        <n-grid-item v-for="item in deptStats" :key="item.label">
          <div class="p-3 bg-[var(--n-action-color)] rounded-md">
            <div class="text-13px text-[var(--n-text-color-3)]">{{ item.label }}</div>
            <div class="mt-1 text-20px font-600 text-[var(--n-text-color-link)]">
              {{ item.value }}
            </div>
          </div>
        </n-grid-item>
      </n-grid>
    </n-card>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: "RouteParam" });

const { t } = useI18n();

const route = useRoute();
const router = useRouter();

// 页内可切换的视图，取值对应 query 的 type
const views = computed(() => [
  { value: "staff", label: t("routeParam.viewStaff") },
  { value: "dept", label: t("routeParam.viewDept") },
]);

// 当前视图：非法取值回退到第一个视图
const currentType = computed(() => {
  const value = String(route.query.type ?? "");

  return views.value.some((item) => item.value === value) ? value : views.value[0].value;
});

/**
 * 切换视图：改 query，与菜单 params 并入 query 是同一机制
 */
function switchView(value: string) {
  router.replace({ query: { ...route.query, type: value } });
}

// 参数从数据库到页面的四步链路
const flowNodes = computed(() => [
  { label: t("routeParam.flowDatabase"), code: "sys_menu.params" },
  { label: t("routeParam.flowBackend"), code: "route.meta.params" },
  { label: t("routeParam.flowSidebar"), code: "query: meta.params" },
  { label: t("routeParam.flowPage"), code: "route.query.type" },
]);

// staff 视图：员工表格
const employeeColumns = computed(() => [
  { title: t("routeParam.colName"), key: "name", width: 120 },
  { title: t("routeParam.colPost"), key: "post" },
  { title: t("routeParam.colCity"), key: "city" },
]);

const employees = [
  { name: "张三", post: "前端开发", city: "杭州" },
  { name: "李四", post: "后端开发", city: "上海" },
  { name: "王五", post: "产品经理", city: "北京" },
];

// dept 视图：部门统计
const deptStats = [
  { label: "研发部", value: 42 },
  { label: "产品部", value: 18 },
  { label: "测试部", value: 15 },
  { label: "运维部", value: 9 },
];
</script>

<style scoped>
.param-query {
  padding: 2px 10px;
  font-family: var(--n-font-family-mono, monospace);
  font-size: 12px;
  color: var(--n-text-color-link);
  background: var(--n-action-color);
  border-radius: 4px;
}
</style>
