<template>
  <n-el flex flex-col>
    <n-collapse-transition v-if="(form || formConfig) && modelValue" class="mb-[10px]" :show="show">
      <!-- MenuSearch Form -->
      <n-card>
        <FormPro
          ref="ruleForm"
          v-model:model-value="modelValue"
          :form-config="showFormConfig.map((item) => ({ ...item, blockMessage: undefined }))"
          :form-props="{ showFeedback: false, labelWidth: undefined, ...(form?.props || {}) }"
          :operation-span="operationSpan"
          :grid-props="{ yGap: 16, ...(form?.gridProps || {}) }"
        >
          <!-- 转发所有具名插槽 -->
          <template v-for="(_, name) in $slots" :key="name" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps" />
          </template>
          <template #operation>
            <n-flex :justify="operationButtonPosition === 'left' ? 'start' : 'end'">
              <slot name="before" />
              <n-button type="primary" :loading="loading" @click="handleQuery">
                <template #icon>
                  <icon-park-outline-search />
                </template>
                {{ form?.positiveText ?? t("button.search") }}
              </n-button>
              <n-button strong secondary :loading="loading" @click="resetQuery">
                <template #icon>
                  <icon-park-outline-redo />
                </template>
                {{ form?.negativeText ?? t("button.reset") }}
              </n-button>
              <n-button v-show="showFoldBtn" type="primary" text @click="toggleCollapse">
                <template #icon>
                  <Icones
                    :icon="isCollapse ? 'icon-park-outline:down' : 'icon-park-outline:up'"
                    :size="24"
                  />
                </template>
                {{ isCollapse ? t("button.expand") : t("button.collapse") }}
              </n-button>
              <slot name="after" />
            </n-flex>
          </template>
        </FormPro>
      </n-card>
    </n-collapse-transition>
    <n-card>
      <n-flex vertical :size="[0, 12]">
        <n-flex justify="space-between" align="center">
          <n-flex align="center">
            <slot name="controls" />
          </n-flex>
          <div />
          <n-flex>
            <n-tooltip v-if="(form || formConfig) && modelValue" trigger="hover">
              <template #trigger>
                <CommonWrapper @click="show = !show">
                  <Icones icon="ant-design:search-outlined" />
                </CommonWrapper>
              </template>
              <span>
                {{ show ? t("system.tooltip.hideSearch") : t("system.tooltip.expandSearch") }}
              </span>
            </n-tooltip>
            <n-tooltip trigger="hover">
              <template #trigger>
                <CommonWrapper @click="handleQuery">
                  <Icones icon="ant-design:reload-outlined" :class="{ 'animate-spin': loading }" />
                </CommonWrapper>
              </template>
              <span>{{ t("button.refresh") }}</span>
            </n-tooltip>
            <n-tooltip trigger="hover">
              <template #trigger>
                <CommonWrapper @click="download">
                  <Icones icon="ant-design:download-outlined" />
                </CommonWrapper>
              </template>
              <span>{{ t("system.tooltip.exportSvg") }}</span>
            </n-tooltip>
            <n-tooltip trigger="hover">
              <template #trigger>
                <!-- <n-el tag="div">
                  <n-dropdown trigger="click" :options="options" @select="handleSelect">
                    <CommonWrapper>
                      <Icones icon="ant-design:font-size-outlined" />
                    </CommonWrapper>
                  </n-dropdown>
                </n-el> -->
                <n-popselect v-model:value="size" :options="options" trigger="click">
                  <CommonWrapper>
                    <Icones icon="ant-design:font-size-outlined" />
                  </CommonWrapper>
                </n-popselect>
              </template>
              <span>{{ t("system.tooltip.tableSize") }}</span>
            </n-tooltip>
          </n-flex>
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
          v-model:count="totalNum"
          v-model:page="modelValue.pageNum"
          v-model:limit="modelValue.pageSize"
          :hidden="totalNum <= 0"
          :align="paginationPosition"
          @pagination="handleQuery"
        />
      </n-flex>
    </n-card>
  </n-el>
</template>
<script lang="ts" setup generic="T extends Recordable">
import { DataTableColumns, DataTableInst, DataTableProps } from "naive-ui";

interface Props<T> {
  tableData?: DataTableProps["data"];
  columns?: DataTableColumns<T>;
  tableProps?: Omit<DataTableProps, "data" | "columns" | "pagination">;
  form?: DataTablePro.Form;
  rowKey?: (row: T) => string | number;
  operationButtonPosition?: "left" | "right";
  loading?: boolean;
  total?: number;
  showTable?: boolean;
  collapseRows?: number;
  operationSpan?: number;
  formConfig?: FormPro.FormItemConfig[];
  paginationPosition?: "left" | "center" | "right";
}

interface Emits {
  (e: "query", v: Recordable): void;
  (e: "reset", v: Recordable): void;
}

interface Expose {
  handleQuery: () => Promise<void>;
  resetQuery: () => void;
}

defineOptions({ name: "TablePro" });

const { t } = useI18n();

const emit = defineEmits<Emits>();

const props = withDefaults(defineProps<Props<T>>(), {
  tableData: () => [],
  columns: () => [],
  tableProps: () => ({}),
  rowKey: (row: Recordable) => row.id,
  total: 0,
  showTable: true,
  operationButtonPosition: "right",
  collapseRows: 3,
  operationSpan: 4,
  paginationPosition: "left",
});

const totalNum = computed(() => props.total);

// 搜索参数
const modelValue = defineModel<Recordable>("modelValue", {
  default: () => ({}),
});

// 是否展开查询
const show = useStorage<boolean>("show", true, localStorage, { listenToStorageChanges: true });

const tableRef = useTemplateRef<DataTableInst>("table");

// 导出
const download = () =>
  tableRef.value?.downloadCsv({
    fileName: `数据导出-${new Date().toLocaleDateString()}`,
    keepOriginalData: false,
  });

// 尺寸
type Size = "small" | "medium" | "large";
const size = useStorage<Size>("size", "medium", localStorage, { listenToStorageChanges: true });
const options = computed(() => [
  { label: t("system.borderRadius.small"), value: "small" },
  { label: t("system.borderRadius.default"), value: "medium" },
  { label: t("system.borderRadius.large"), value: "large" },
]);

const ruleFormRef = useTemplateRef("ruleForm"); // 获取表单实例

// 提交按钮触发
const handleQuery = async () => {
  await ruleFormRef.value?.validate();
  emit("query", modelValue.value);
};

// 重置按钮触发
function resetQuery() {
  ruleFormRef.value?.reset();
  emit("reset", modelValue.value);
}

// 是否折叠
const isCollapse = ref<boolean>(true);

// 默认的右侧按钮操作区
const defaultOperationSpan = props.operationSpan; // 默认 span 为 4

// 展示的表单配置
const showFormConfig = computed(() => {
  // 优先使用直接传入的 formConfig，如果没有则使用 form.config
  const config = props.formConfig || props.form?.config || [];

  if (!config || !isCollapse.value) {
    return config;
  }

  return config.slice(0, props.collapseRows);
});

// 是否显示折叠按钮
const showFoldBtn = computed(() => {
  const config = props.formConfig || props.form?.config || [];

  return config && config.length > props.collapseRows;
});

// 计算操作区按钮的占位宽度
const operationSpan = computed<number>(() => {
  let totalSpan = 0;

  if (!showFoldBtn) return totalSpan;
  // 计算每行的 span 值
  let currentLineSpan = 0;

  // 过滤掉隐藏的表单项
  const showForm = showFormConfig.value.filter((i) => !i.hidden);

  for (const item of showForm) {
    const itemSpan = item.span || defaultOperationSpan;

    if (currentLineSpan + itemSpan > 24) {
      currentLineSpan = itemSpan;
    } else {
      currentLineSpan += itemSpan;
    }
  }

  totalSpan += currentLineSpan;

  // 计算剩余的 span 值
  const remainingSpan = 24 - (totalSpan % 24);

  return remainingSpan < defaultOperationSpan ? 24 : remainingSpan;
});

// 切换折叠状态
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
};

defineExpose<Expose>({
  handleQuery,
  resetQuery,
});
</script>
