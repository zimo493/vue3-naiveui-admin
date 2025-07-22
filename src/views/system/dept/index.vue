<template>
  <div>
    <TablePro
      v-model="queryParams"
      :show-table="expandAll.show"
      :form-config="formConfig"
      :columns="columns"
      :table-data="tableData"
      :loading="loading"
      :row-key="(row) => row.id"
      :table-props="{
        defaultExpandAll: expandAll.isExpandAll,
        onUpdateCheckedRowKeys: handleCheck,
      }"
      @query="handleQuery"
      @reset="handleQuery"
    >
      <template #controls>
        <n-button type="primary" @click="openDrawer()">
          <template #icon>
            <icon-park-outline-plus />
          </template>
          新增
        </n-button>
        <n-button type="error" :disabled="!selectedRowKeys.length" @click="handleDelete()">
          <template #icon>
            <icon-park-outline-delete-themes />
          </template>
          删除
        </n-button>
        <n-button type="info" @click="handleExpandAll()">
          <template #icon>
            <Icones :icon="expandAll.isExpandAll ? up : down" />
          </template>
          {{ expandAll.isExpandAll ? "收起" : "展开" }}
        </n-button>
      </template>
    </TablePro>

    <!-- 新增、编辑 -->
    <DrawerForm
      ref="drawerForm"
      v-model="modelValue"
      :form="editFormConfig"
      :loading="spin"
      @submit="submitForm"
    />
  </div>
</template>
<script setup lang="tsx">
import { type DataTableColumns, type DataTableRowKey, NButton, NFlex } from "naive-ui";

import DeptAPI from "@/api/system/dept";

import { useLoading } from "@/hooks";
import { spin, executeAsync, InquiryBox, startSpin, endSpin, statusOptions } from "@/utils";

import Icones from "@/components/common/Icones.vue";
import CommonStatus from "@/components/common/CommonStatus.vue";

defineOptions({ name: "Dept" });

const up = "ant-design:caret-up-filled";
const down = "ant-design:caret-down-filled";

// 定义表单的初始值
const queryParams = ref<Dept.Query>({});

const tableData = ref<Dept.VO[]>([]);
const deptOptions = ref<OptionType[]>([]);

const { loading, startLoading, endLoading } = useLoading();

onMounted(async () => {
  handleQuery();
  // 加载部门下拉数据
  const data = await DeptAPI.getOptions();

  deptOptions.value = [{ value: "0", label: "顶级部门", children: data }];
});
/** 查询方法 */
const handleQuery = () => {
  startLoading();
  DeptAPI.getList(queryParams.value)
    .then(async (data) => {
      tableData.value = data;
      await handleExpandAll(true); // 接口调用之后展开所有
    })
    .finally(() => endLoading());
};
// 展开\收起
const expandAll = ref<TableExpand>({
  isExpandAll: false,
  show: true,
});
const handleExpandAll = async (bool?: boolean) => {
  expandAll.value.isExpandAll = bool ?? !expandAll.value.isExpandAll;
  expandAll.value.show = false;
  await nextTick();
  expandAll.value.show = true;
};

const formConfig = ref<FormPro.FormItemConfig[]>([{ name: "keywords", label: "角色名称" }]);

const columns = ref<DataTableColumns<Dept.VO>>([
  { type: "selection", options: ["all", "none"] },
  { title: "部门名称", key: "name" },
  { title: "部门编号", key: "code", align: "center" },
  {
    title: "状态",
    key: "status",
    align: "center",
    render: ({ status }) => <CommonStatus value={status} />,
  },
  { title: "排序", key: "sort", align: "center", sorter: "default" },
  { title: "创建时间", key: "createTime", align: "center", width: 180 },
  {
    title: "操作",
    key: "action",
    align: "center",
    width: 220,
    render: (row) => (
      <NFlex justify="center">
        <NButton
          text
          type="primary"
          v-slots={{ icon: () => <Icones icon="ant-design:plus-outlined" /> }}
          onClick={() => openDrawer(row.id)}
        >
          新增
        </NButton>
        <NButton
          text
          type="info"
          v-slots={{ icon: () => <Icones icon="ant-design:edit-outlined" /> }}
          onClick={() => handleEdit(row)}
        >
          编辑
        </NButton>
        <NButton
          text
          type="error"
          v-slots={{ icon: () => <Icones icon="ant-design:delete-outlined" /> }}
          onClick={() => handleDelete(row.id)}
        >
          删除
        </NButton>
      </NFlex>
    ),
  },
]);

const editFormConfig = computed(
  (): DialogForm.Form => ({
    config: [
      {
        name: "parentId",
        label: "上级部门",
        component: "treeSelect",
        props: { keyField: "value", labelField: "label", options: deptOptions.value },
      },
      { name: "name", label: "部门名称" },
      { name: "code", label: "部门编号" },
      {
        name: "status",
        label: "状态",
        component: "radio",
        props: { options: statusOptions },
      },
      { name: "sort", label: "排序", component: "number" },
    ],
    props: {
      rules: {
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入角色编码", trigger: "blur" }],
        dataScope: [
          { required: true, type: "number", message: "请选择数据权限", trigger: "change" },
        ],
        status: [{ required: true, type: "number", message: "请选择状态", trigger: "change" }],
      },
    },
  })
);

/** 初始化表单 */
const modelValue = ref<Dept.Form>({
  status: 1,
  parentId: "0",
  sort: 1,
});
/** 新增、编辑 */
const drawerFormRef = useTemplateRef("drawerForm");
const openDrawer = (deptId?: string) => {
  modelValue.value.parentId = deptId ? deptId : "0";
  drawerFormRef.value?.open("新增部门", modelValue.value);
};

const handleEdit = ({ id }: Dept.VO) => {
  startSpin();
  DeptAPI.getFormData(id).then((data) => {
    Object.assign(modelValue.value, data);
    endSpin();
  });
  drawerFormRef.value?.open("编辑部门", modelValue.value);
};

/** 表单提交 */
const submitForm = async (val: Dept.Form) =>
  executeAsync(
    () => (val.id ? DeptAPI.update(val.id, val) : DeptAPI.create(val)),
    () => {
      drawerFormRef.value?.close();
      handleQuery();
    }
  );

/** 选中行 */
const selectedRowKeys = ref<string[]>([]);
const handleCheck = (keys: DataTableRowKey[]) => (selectedRowKeys.value = keys as string[]);

// 删除部门
const handleDelete = (deptId?: string) => {
  const deptIds = [deptId || selectedRowKeys.value].join(",");

  InquiryBox("确认删除已选中的数据项?").then(() => {
    DeptAPI.deleteByIds(deptIds).then(() => {
      window.$message.success("删除成功");
      handleQuery();
    });
  });
};
</script>
