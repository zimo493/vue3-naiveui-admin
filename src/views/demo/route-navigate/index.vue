<template>
  <div class="page-container">
    <n-card :bordered="false" class="page-content mb-4">
      <h3 class="mb-2 text-16px font-600">{{ t("routeNavigate.title") }}</h3>
      <p class="text-13px text-[var(--n-text-color-3)]">{{ t("routeNavigate.desc") }}</p>
    </n-card>

    <n-card :bordered="false" class="page-content" :title="t('routeNavigate.listTitle')">
      <n-input
        v-model:value="keywords"
        :placeholder="t('routeNavigate.filterPlaceholder')"
        clearable
      />

      <n-data-table
        class="mt-4"
        :columns="columns"
        :data="members"
        :bordered="false"
        size="small"
      />

      <n-alert class="mt-4" type="info" :bordered="false">
        <template #header>{{ t("routeNavigate.compareTitle") }}</template>
        {{ t("routeNavigate.compareDesc") }}
      </n-alert>
    </n-card>

    <n-modal v-model:show="dialogVisible" preset="dialog" :title="dialogTitle">
      {{ t("routeNavigate.dialogContent") }}
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { h } from "vue";
import { NButton } from "naive-ui";
import type { DataTableColumns } from "naive-ui";

import { listMembers } from "./data";
import type { MemberItem } from "./data";

defineOptions({
  name: "RouteNavigate",
});

const { t } = useI18n();
const router = useRouter();

// 列表筛选关键字
const keywords = ref("");
const members = ref<MemberItem[]>([]);

const dialogVisible = ref(false);
const dialogTitle = ref("");

/**
 * 加载成员列表
 */
function loadMembers(): void {
  members.value = listMembers(keywords.value);
}

// 从编辑页返回时重新读取数据源，让修改结果回显到列表
onActivated(loadMembers);

// 关键字变化后立即过滤
watch(keywords, loadMembers);

onMounted(loadMembers);

/**
 * 跳转独立编辑页，用路由参数携带要编辑的记录 ID
 */
function handleEdit(row: MemberItem): void {
  router.push({ name: "RouteExampleEdit", params: { id: row.id } });
}

/**
 * 打开成员详情弹窗
 */
function handleDialog(row: MemberItem): void {
  dialogTitle.value = `${row.name} · ${row.dept}`;
  dialogVisible.value = true;
}

const columns = computed<DataTableColumns<MemberItem>>(() => [
  { title: t("routeNavigate.colName"), key: "name", width: 120 },
  { title: t("routeNavigate.colDept"), key: "dept" },
  { title: t("routeNavigate.colPost"), key: "post" },
  {
    title: t("routeNavigate.colAction"),
    key: "action",
    width: 200,
    align: "center",
    render: (row) =>
      h("div", { class: "flex items-center justify-center gap-2" }, [
        h(
          NButton,
          { type: "primary", text: true, onClick: () => handleEdit(row) },
          { default: () => t("routeNavigate.edit") }
        ),
        h(
          NButton,
          { type: "warning", text: true, onClick: () => handleDialog(row) },
          { default: () => t("routeNavigate.view") }
        ),
      ]),
  },
]);
</script>
