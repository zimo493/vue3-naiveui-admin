<template>
  <n-el flex flex-col>
    <n-collapse-transition v-if="search && modelValue" class="mb-[10px]" :show="show">
      <!-- Search Form -->
      <n-card>
        <FormProTwo
          ref="ruleForm"
          v-model:model-value="modelValue"
          :form-config="props.search?.formConfig"
          :form-props="{ labelWidth: 'auto', ...search.formProps }"
          :grid-props="search.gridProps"
        >
          <template #operation>
            <n-flex :justify="operationButtonPosition === 'left' ? 'start' : 'end'">
              <slot name="before" />
              <n-button type="primary" :loading="loading" @click="handleQuery">
                <template #icon>
                  <icon-park-outline-search />
                </template>
                {{ search.searchText ?? "搜索" }}
              </n-button>
              <n-button strong secondary :loading="loading" @click="resetQuery">
                <template #icon>
                  <icon-park-outline-redo />
                </template>
                {{ search.resetText ?? "重置" }}
              </n-button>
              <!-- <n-button v-show="showFoldBtn" type="primary" text @click="toggleCollapse">
                <template #icon>
                  <Icones
                    :icon="isCollapse ? 'icon-park-outline:down' : 'icon-park-outline:up'"
                    :size="24"
                  />
                </template>
                {{ isCollapse ? "展开" : "收起" }}
              </n-button> -->
              <slot name="after" />
            </n-flex>
          </template>
        </FormProTwo>
      </n-card>
    </n-collapse-transition>
    <n-card>
      <n-flex vertical :size="[0, 12]">
        <n-flex justify="space-between" align="center">
          <n-flex align="center">
            <slot name="controls" />
          </n-flex>
          <div />
          <n-space>
            <n-popover v-if="search && modelValue" trigger="hover">
              <template #trigger>
                <CommonWrapper @click="show = !show">
                  <Icones icon="ant-design:search-outlined" />
                </CommonWrapper>
              </template>
              <span>{{ show ? "隐藏搜索" : "展开搜索" }}</span>
            </n-popover>
            <n-popover trigger="hover">
              <template #trigger>
                <CommonWrapper @click="handleQuery">
                  <Icones icon="ant-design:reload-outlined" :class="{ 'animate-spin': loading }" />
                </CommonWrapper>
              </template>
              <span>刷新</span>
            </n-popover>
            <n-popover trigger="hover">
              <template #trigger>
                <CommonWrapper @click="download">
                  <Icones icon="ant-design:download-outlined" />
                </CommonWrapper>
              </template>
              <span>导出SVG</span>
            </n-popover>
            <n-popover trigger="hover">
              <template #trigger>
                <n-el tag="div">
                  <n-dropdown trigger="click" :options="options" @select="handleSelect">
                    <CommonWrapper>
                      <Icones icon="ant-design:font-size-outlined" />
                    </CommonWrapper>
                  </n-dropdown>
                </n-el>
              </template>
              <span>表格尺寸</span>
            </n-popover>
          </n-space>
        </n-flex>
        <n-data-table
          v-if="showTable"
          ref="table"
          :size="size"
          v-bind="{ ...tableProps, ...$attrs }"
          :columns="columns"
          :data="tableData"
          :row-key="rowKey"
          :loading="loading"
          :scroll-x="1200"
        />
        <Pagination
          v-if="totalNum > 0"
          v-model:count="totalNum"
          v-model:page="modelValue.pageNum"
          v-model:limit="modelValue.pageSize"
          @pagination="handleQuery"
        />
      </n-flex>
    </n-card>
  </n-el>
</template>
<script lang="ts" setup generic="T extends Recordable">
import { DataTableColumns, DataTableInst, DataTableProps, FormInst } from "naive-ui";
import FormProTwo from "./FormProTwo.vue";

interface Props<T> {
  tableData?: DataTableProps["data"];
  columns?: DataTableColumns<T>;
  tableProps?: Omit<DataTableProps, "data" | "columns">;
  search?: DataTablePro.Search;
  rowKey?: (row: T) => string | number;
  operationButtonPosition?: "left" | "right";
  loading?: boolean;
  total?: number;
  showTable?: boolean;
}

interface Emits<T> {
  (e: "reset", v: T): void;
  (e: "submit", v: T): void;
}

interface Expose {
  handleQuery: () => Promise<void>;
  resetQuery: () => void;
}

const props = withDefaults(defineProps<Props<T>>(), {
  tableData: () => [],
  columns: () => [],
  tableProps: () => ({}),
  loading: false,
  total: 0,
  rowKey: (row: Recordable) => row.id,
  showTable: true,
  operationButtonPosition: "right",
});

const emit = defineEmits<Emits<T>>();

const {
  tableData,
  columns,
  tableProps,
  search = false,
  loading,
  total,
  rowKey,
  showTable,
  operationButtonPosition,
} = props;

const totalNum = computed(() => total);

// 搜索参数
const modelValue = defineModel<T>("modelValue", {
  default: () => ({}),
});

// 是否展开查询
const show = ref<boolean>(true);

const tableRef = useTemplateRef<DataTableInst>("table");

// 导出
const download = () =>
  tableRef.value?.downloadCsv({
    fileName: `数据导出-${new Date().toLocaleDateString()}`,
    keepOriginalData: false,
  });

// 尺寸
type Size = "small" | "medium" | "large";
const size = ref<Size>("medium");
const options = [
  { label: "小型", key: "small" },
  { label: "默认", key: "medium" },
  { label: "大型", key: "large" },
];
const handleSelect = (key: Size) => (size.value = key);

const ruleFormRef = useTemplateRef<FormInst>("ruleForm"); // 获取表单实例

// 提交按钮触发
const handleQuery = async () => {
  await ruleFormRef.value?.validate();
  emit("submit", modelValue.value);
};

// 重置按钮触发
function resetQuery() {
  ruleFormRef.value?.restoreValidation();
  emit("reset", modelValue.value);
}

defineExpose<Expose>({
  handleQuery,
  resetQuery,
});
</script>
