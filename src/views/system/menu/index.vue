<template>
  <div>
    <SearchTable
      :showTable="expandAll.show"
      :formConfig="formConfig"
      :modelValue="query"
      :columns="columns"
      :tableData="tableData"
      :loading="loading"
      :default-expand-all="expandAll.isExpandAll"
      :default-expanded-row-keys="expandAll.expandedRowKeys"
      :rowKey="(row: Menu.VO) => row.id"
      @search="handleQuery"
      @reset="handleQuery"
    >
      <template #controls>
        <n-button type="primary" @click="openDialog()">
          <template #icon>
            <icon-park-outline-plus />
          </template>
          新增
        </n-button>
        <n-button type="info" @click="handleExpandAll()">
          <template #icon>
            <Icones :icon="expandAll.isExpandAll ? up : down" />
          </template>
          {{ expandAll.isExpandAll ? "收起" : "展开" }}
        </n-button>
        <div class="h-full flex items-center">
          <n-checkbox v-model:checked="isExpandFirstMenu" @update:checked="handleCheckedChange">
            默认展开第一项
          </n-checkbox>
        </div>
      </template>
    </SearchTable>

    <!-- 新增、编辑 -->
    <MenuEdit ref="editRef" :menu-options="rowData" @success="handleQuery" />
  </div>
</template>
<script lang="tsx">
export default { name: "SysMenu" };
</script>
<script setup lang="tsx">
import type { VNode } from "vue";
import { type DataTableColumns, NButton, NSpace, NTag, NText } from "naive-ui";
import { type FormOption, FormItemType } from "@/components/custom/FormPro/types";

import { useLoading } from "@/hooks";
import { MenuTypeEnum } from "@/enums";
import { InquiryBox, local } from "@/utils";

import MenuAPI from "@/api/system/menu";

import Icones from "@/components/common/Icones.vue";
import CommonStatus from "@/components/common/CommonStatus.vue";
import MenuEdit from "./components/MenuEdit.vue";

const { loading, startLoading, endLoading } = useLoading();

const up = "ant-design:caret-up-filled";
const down = "ant-design:caret-down-filled";

onMounted(() => handleQuery());

// 是否默认展开第一项
const isExpandFirstMenu = toRef(local.get("isExpandFirstMenu") || false);
const handleCheckedChange = async (checked: boolean) => {
  local.set("isExpandFirstMenu", checked);
  handleQuery();
};

const formConfig = ref<FormOption<Menu.Query>>({
  fields: [{ field: "keywords", label: "菜单名称", type: FormItemType.Input }],
});

// 展开\收起
const expandAll = ref<TableExpand>({
  isExpandAll: false, // 全部展开
  show: true, // 是否显示 用于切换展开\收起
  expandedRowKeys: [], // 默认展开的行
});
const handleExpandAll = async (bool?: boolean) => {
  expandAll.value.isExpandAll = bool ?? !expandAll.value.isExpandAll;
  expandAll.value.show = false;
  if (isExpandFirstMenu.value) {
    const [first] = tableData.value;

    expandAll.value.expandedRowKeys = first ? [first.id] : []; // 默认展开第一行
  } else {
    expandAll.value.expandedRowKeys = [];
  }
  await nextTick();
  expandAll.value.show = true;
};

// 定义表单的初始值
const query = ref<Menu.Query>({});

const tableData = ref<Menu.VO[]>([]);
const rowData = ref<Menu.VO[]>([]); // 菜单数据

const handleQuery = () => {
  startLoading();
  MenuAPI.getList(query.value)
    .then(async (data) => {
      tableData.value = data;
      rowData.value = data;
      await handleExpandAll(false); // 接口调用之后展开所有
    })
    .finally(() => endLoading());
};

const columns: DataTableColumns<Menu.VO> = [
  {
    title: "菜单名称",
    key: "name",
    width: 200,
    render: ({ icon, name }) => (
      <>
        <Icones class="mr-[6px]" icon={icon} />
        <NText>{name}</NText>
      </>
    ),
  },
  {
    title: "菜单类型",
    key: "type",
    align: "center",
    render: ({ type }) => createMenuTypeTag(type),
  },
  { title: "路由名称", align: "center", key: "routeName" },
  { title: "路由路径", align: "center", key: "routePath" },
  { title: "组件路径", align: "center", key: "component" },
  { title: "权限标识", align: "center", key: "perm" },
  {
    title: "状态",
    key: "status",
    align: "center",
    render: ({ visible }) => <CommonStatus value={visible} />,
  },
  { title: "排序", key: "sort", align: "center", sorter: "default" },
  // { title: "创建时间", key: "createTime", align: "center", sorter: "default" },
  {
    title: "操作",
    key: "action",
    width: 200,
    align: "center",
    render: (row) => {
      return (
        <NSpace justify="center">
          {(row.type == MenuTypeEnum.CATALOG || row.type == MenuTypeEnum.MENU) && (
            <NButton size="small" quaternary type="primary" onClick={() => openDialog(row.id)}>
              新增
            </NButton>
          )}
          <NButton size="small" quaternary type="info" onClick={() => openDialog(row)}>
            编辑
          </NButton>
          <NButton size="small" type="error" quaternary onClick={() => handleDelete(row)}>
            删除
          </NButton>
        </NSpace>
      );
    },
  },
];

// 新增、编辑
const editRef = ref<InstanceType<typeof MenuEdit> | null>(null);
const openDialog = (row?: Menu.VO | string) => editRef.value?.open(row);

// const openDialog = (row?: Menu.VO | string) => {
//   console.log(row);
// };

// 删除
const handleDelete = (row: Menu.VO) => {
  InquiryBox(`是否确认删除名称为 "${row.name}" 的数据项？`)
    .then(async () => {
      await MenuAPI.deleteById(row.id);

      window.$message.success("删除成功");
    })
    .then(() => handleQuery())
    .catch(() => {});
};

// 创建菜单类型tag
const createMenuTypeTag = (type?: MenuTypeEnum): VNode => {
  // 定义类型与标签的映射关系
  const typeMap: Record<MenuTypeEnum, { type: string; label: string }> = {
    [MenuTypeEnum.CATALOG]: { type: "warning", label: "菜单" },
    [MenuTypeEnum.MENU]: { type: "success", label: "菜单" },
    [MenuTypeEnum.BUTTON]: { type: "info", label: "按钮" },
    [MenuTypeEnum.EXTLINK]: { type: "error", label: "外链" },
  };

  // 如果类型不存在或未匹配到，返回默认值
  if (!type || !(type in typeMap)) {
    return h("div", null, "未知"); // 默认值处理
  }

  // 根据映射关系生成标签
  const { type: tagType, label } = typeMap[type];

  return (
    <NTag type={tagType} round bordered={false}>
      {label}
    </NTag>
  );
};
</script>
