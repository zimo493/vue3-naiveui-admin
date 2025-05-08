<template>
  <n-el class="tableFullScreen flex flex-col">
    <n-collapse-transition v-if="formConfig && modelValue" class="mb-[10px]" :show="show">
      <n-card>
        <SearchForm
          v-bind="formConfig"
          :collapse-length="collapseLength"
          :controls-span="controlsSpan"
          :modelValue="modelValue"
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
                <CommonWrapper @click="reload">
                  <Icones icon="ant-design:reload-outlined" :class="{ 'animate-spin': iconLoad }" />
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
          ref="tableRef"
          :size="size"
          v-bind="$attrs"
          :columns="columns"
          :data="tableData"
          :row-key="rowKey"
          :loading="loading"
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
<script lang="ts">
export default { name: "SearchTable" };
</script>
<script lang="ts" setup>
import { FormOption } from "@/components/custom/FormPro/types";
import { DataTableColumns, DataTableInst } from "naive-ui";

const emit = defineEmits<{
  (e: "search"): void;
  (e: "reset"): void;
}>();

const props = defineProps({
  formConfig: {
    type: Object as PropType<Omit<FormOption<Recordable>, "showFeedback">>,
  },
  modelValue: {
    type: Object as PropType<Recordable>,
    default: () => {},
  },
  collapseLength: {
    type: Number,
    default: 3,
  },
  controlsSpan: {
    type: Number,
    default: 4,
  },
  columns: {
    required: true,
    type: Array as PropType<DataTableColumns<any>>,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  rowKey: {
    default: (row: Recordable) => row.id,
  },
  tableData: {
    require: true,
    type: Array as PropType<Array<object>>,
  },
  showTable: {
    type: Boolean,
    default: true,
  },
  total: {
    type: Number,
    default: 0,
  },
  tableEvents: {
    type: Object as PropType<{ [key: string]: Function }>,
  },
});

const totalNum = computed(() => props.total);

// 是否展开查询
const show = ref<boolean>(true);
// 刷新
const iconLoad = ref<boolean>(false);
const reload = () => {
  iconLoad.value = true;
  emit("search");
  setTimeout(() => (iconLoad.value = false), 1000);
};
// 查询
const handleQuery = () => emit("search");

// 重置
const handleReset = () => emit("reset");

const tableRef = ref<DataTableInst>();
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
