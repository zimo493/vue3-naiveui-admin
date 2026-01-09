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
          {{ t("button.add") }}
        </n-button>
        <n-button type="error" :disabled="!selectedRowKeys.length" @click="handleDelete()">
          <template #icon>
            <icon-park-outline-delete-themes />
          </template>
          {{ t("button.delete") }}
        </n-button>
        <n-button type="info" @click="handleExpandAll()">
          <template #icon>
            <Icones :icon="expandAll.isExpandAll ? up : down" />
          </template>
          {{ expandAll.isExpandAll ? t("button.collapse") : t("button.expand") }}
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

import Icones from "@/components/icones.vue";
import CommonStatus from "@/components/common-status.vue";

defineOptions({ name: "Dept" });

const { t } = useI18n();

const up = "ant-design:caret-up-filled";
const down = "ant-design:caret-down-filled";

// 定义表单的初始值
const queryParams = ref<Dept.Query>({});

const tableData = ref<Dept.VO[]>([]);
const deptOptions = ref<OptionItem[]>([]);

const { loading, startLoading, endLoading } = useLoading();

onMounted(async () => {
  handleQuery();
  // 加载部门下拉数据
  const data = await DeptAPI.getOptions();

  deptOptions.value = [{ value: "0", label: t("dept.top"), children: data }];
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

const formConfig = ref<FormPro.FormItemConfig[]>([
  { name: "keywords", label: t("tableHeader.deptName") },
]);

const columns = ref<DataTableColumns<Dept.VO>>([
  { type: "selection", options: ["all", "none"] },
  { title: t("tableHeader.deptName"), key: "name" },
  { title: t("tableHeader.deptCode"), key: "code", align: "center" },
  {
    title: t("tableHeader.status"),
    key: "status",
    align: "center",
    render: ({ status }) => <CommonStatus value={status} />,
  },
  { title: t("tableHeader.sort"), key: "sort", align: "center", sorter: "default" },
  { title: t("tableHeader.createTime"), key: "createTime", align: "center", width: 180 },
  {
    title: t("tableHeader.action"),
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
          {t("button.add")}
        </NButton>
        <NButton
          text
          type="info"
          v-slots={{ icon: () => <Icones icon="ant-design:edit-outlined" /> }}
          onClick={() => handleEdit(row)}
        >
          {t("button.edit")}
        </NButton>
        <NButton
          text
          type="error"
          v-slots={{ icon: () => <Icones icon="ant-design:delete-outlined" /> }}
          onClick={() => handleDelete(row.id)}
        >
          {t("button.delete")}
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
        label: t("dept.top"),
        component: "tree-select",
        props: { keyField: "value", labelField: "label", options: deptOptions.value },
      },
      { name: "name", label: t("tableHeader.deptName") },
      { name: "code", label: t("tableHeader.deptCode") },
      {
        name: "status",
        label: t("tableHeader.status"),
        component: "radio",
        props: { options: statusOptions.value },
      },
      { name: "sort", label: t("tableHeader.sort"), component: "number" },
    ],
    props: {
      rules: {
        name: [
          {
            required: true,
            message: t("input") + t("tableHeader.deptName"),
            trigger: "blur",
          },
        ],
        code: [
          {
            required: true,
            message: t("input") + t("tableHeader.deptCode"),
            trigger: "blur",
          },
        ],
        dataScope: [
          {
            required: true,
            type: "number",
            message: t("select") + t("role.dataPermission"),
            trigger: "change",
          },
        ],
        status: [
          {
            required: true,
            type: "number",
            message: t("select") + t("tableHeader.status"),
            trigger: "change",
          },
        ],
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
  drawerFormRef.value?.open(t("dept.add"), modelValue.value);
};

const handleEdit = ({ id }: Dept.VO) => {
  startSpin();
  DeptAPI.getFormData(id).then((data) => {
    Object.assign(modelValue.value, data);
    endSpin();
  });
  drawerFormRef.value?.open(t("dept.edit"), modelValue.value);
};

/** 表单提交 */
const submitForm = (val: Dept.Form) =>
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

  InquiryBox(t("confirm.deleteSelect")).then(() => {
    DeptAPI.deleteByIds(deptIds).then(() => {
      window.$message.success(t("message.deleteSuccess"));
      handleQuery();
    });
  });
};
</script>
