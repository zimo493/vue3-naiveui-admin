<script setup lang="ts">
import { PropType } from "vue";

const { t } = useI18n();

const props = defineProps({
  count: {
    required: true,
    type: Number as PropType<number>,
  },
  page: {
    type: Number,
    default: 1,
  },
  limit: {
    type: Number,
    default: 20,
  },
  pageSizes: {
    type: Array as PropType<number[]>,
    default: () => [10, 20, 30, 50, 100],
  },
  displayOrder: {
    type: Array as PropType<Array<"pages" | "size-picker" | "quick-jumper">>,
    default: () => ["size-picker", "pages", "quick-jumper"],
  },
  hidden: {
    type: Boolean,
    default: false,
  },
  align: {
    type: String as PropType<"left" | "center" | "right">,
    default: "left",
  },
});

const emit = defineEmits(["pagination", "update:page", "update:limit"]);

const currentPage = useVModel(props, "page", emit);

const pageSize = useVModel(props, "limit", emit);

const handlePage = (val: number) => {
  emit("pagination", { page: val, limit: pageSize });
};

const handlePageSize = (val: number) => {
  currentPage.value = 1;
  emit("pagination", { page: currentPage, limit: val });
};
</script>

<template>
  <div :class="['pagination', 'flex-y-center', { hidden }]" :style="{ justifyContent: align }">
    <n-pagination
      v-model:page="currentPage"
      v-model:page-size="pageSize"
      :item-count="count"
      :display-order="displayOrder"
      :page-sizes="pageSizes"
      show-quick-jumper
      show-size-picker
      @update-page="handlePage"
      @update-page-size="handlePageSize"
    >
      <
      <template #prefix="{ itemCount }">{{ t("pagination.total", { total: itemCount }) }}</template>
      <template #goto>{{ t("pagination.goto") }}</template>
    </n-pagination>
  </div>
</template>

<style lang="scss" scoped>
.pagination {
  &.hidden {
    display: none;
  }
}
</style>
