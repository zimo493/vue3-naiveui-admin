<template>
  <n-el class="tableFullScreen flex flex-col">
    <n-collapse-transition v-if="formConfig && modelValue" class="mb-[10px]" :show="show">
      <n-card>
        <SearchForm
          v-bind="formConfig"
          :collapse-length="collapseLength"
          :controls-span="controlsSpan"
          :modelValue="modelValue"
          :loading="loading"
          @submit="handleQuery"
          @reset="handleReset"
        >
          <template v-for="item in Object.keys($slots)" #[item]>
            <slot :name="item" />
          </template>
        </SearchForm>
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
            <n-popover v-if="formConfig && modelValue" trigger="hover">
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
            <n-popover trigger="hover">
              <template #trigger>
                <CommonWrapper @click="toggleFullScreen">
                  <icon-park-outline-off-screen-two v-if="isFullscreen" />
                  <icon-park-outline-full-screen-two v-else />
                </CommonWrapper>
              </template>
              <span>{{ isFullscreen ? "取消全屏" : "表格全屏" }}</span>
            </n-popover>
          </n-space>
        </n-flex>
        <n-data-table
          v-if="showTable"
          ref="table"
          :size="size"
          v-bind="$attrs"
          :columns="columns"
          :data="tableData"
          :row-key="rowKey"
          :loading="loading"
          :scroll-x="1200"
          v-on="tableEvents ?? {}"
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
<script lang="ts" setup>
import type { DataTableColumns, DataTableInst } from "naive-ui";

defineOptions({ name: "SearchTable" });

const emit = defineEmits<{
  (e: "search"): void;
  (e: "reset"): void;
}>();

const {
  formConfig,
  modelValue = {},
  collapseLength = 3,
  controlsSpan = 4,
  loading = false,
  showTable = true,
  total = 0,
} = defineProps({
  tableData: {
    require: true,
    type: Array as PropType<Array<object>>,
  },
  columns: {
    type: Array as PropType<DataTableColumns<any>>,
    required: true,
  },
  formConfig: {
    type: Object as PropType<Omit<TablePro.FormOption<Recordable>, "showFeedback">>,
  },
  modelValue: { type: Object as PropType<Recordable> },
  collapseLength: { type: Number },
  controlsSpan: { type: Number },
  loading: { type: Boolean },
  rowKey: { default: (row: Recordable) => row.id },
  showTable: { type: Boolean },
  total: { type: Number },
  tableEvents: { type: Object as PropType<{ [key: string]: Function }> },
});

const totalNum = computed(() => total);

// 是否展开查询
const show = ref<boolean>(true);

// 查询 刷新
const handleQuery = () => emit("search");

// 重置
const handleReset = () => emit("reset");

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

// 全屏
onMounted(() => (dom.value = document.querySelector(".tableFullScreen")));
const dom = ref();
const { isFullscreen, toggle } = useFullscreen(dom);
const toggleFullScreen = async () => await toggle();
</script>
