<template>
  <div>
    <TablePro
      v-model="queryParams"
      :form-config="formConfig"
      :columns="columns"
      :tableData="tableData"
      :total="total"
      :loading="loading"
      :row-key="(row) => row.id"
      :table-props="{
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

    <!-- 分配角色数据权限 -->
    <DataScope ref="dataScope" @success="handleQuery" />
  </div>
</template>
<script setup lang="tsx">
import { type DataTableColumns, type DataTableRowKey, NButton, NFlex } from "naive-ui";

import RoleAPI from "@/api/system/role";

import { useLoading } from "@/hooks";
import { spin, executeAsync, InquiryBox, startSpin, endSpin, statusOptions } from "@/utils";

import Icones from "@/components/Icones.vue";
import CommonStatus from "@/components/CommonStatus.vue";

defineOptions({ name: "Role" });

const { t } = useI18n();

// 定义表单的初始值
const queryParams = ref<Role.Query>({
  pageNum: 1,
  pageSize: 10,
});

const tableData = ref<Role.VO[]>([]);
const total = ref<number>(0);

const { loading, startLoading, endLoading } = useLoading();

onMounted(() => handleQuery());
/** 查询方法 */
const handleQuery = () => {
  startLoading();
  RoleAPI.getPage(queryParams.value)
    .then(async (res) => {
      tableData.value = res.list;
      total.value = res.total;
    })
    .finally(() => endLoading());
};

const formConfig = ref<FormPro.FormItemConfig[]>([
  { name: "keywords", label: t("tableHeader.roleName") },
]);

const columns = ref<DataTableColumns<Role.VO>>([
  { type: "selection", options: ["all", "none"] },
  { title: t("tableHeader.roleName"), key: "name", align: "center" },
  { title: t("tableHeader.roleCode"), key: "code", align: "center" },
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
    width: 320,
    render: (row) => (
      <NFlex justify="center">
        <NButton
          text
          type="warning"
          v-slots={{ icon: () => <Icones icon="ant-design:node-index-outlined" /> }}
          onClick={() => handleOpenAssignPermDialog(row)}
        >
          {t("role.dataPermission")}
        </NButton>
        <NButton
          text
          type="info"
          v-slots={{ icon: () => <Icones icon="ant-design:edit-outlined" /> }}
          onClick={() => openDrawer(row)}
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

const editFormConfig: DialogForm.Form = {
  config: [
    { name: "name", label: t("tableHeader.roleName") },
    { name: "code", label: t("tableHeader.roleCode") },
    {
      name: "dataScope",
      label: t("role.dataPermission"),
      component: "select",
      props: {
        options: [
          { label: t("role.allData"), value: 1 },
          { label: t("role.departmentData"), value: 2 },
          { label: t("role.currentDepartmentData"), value: 3 },
          { label: t("role.selfData"), value: 4 },
        ],
      },
    },
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
          message: t("input") + t("tableHeader.roleName"),
          trigger: "blur",
        },
      ],
      code: [
        {
          required: true,
          message: t("input") + t("tableHeader.roleCode"),
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
};

/** 初始化表单 */
const modelValue = ref<Role.Form>({
  sort: 1,
  status: 1,
});
/** 新增、编辑 */
const drawerFormRef = useTemplateRef("drawerForm");
const openDrawer = (row?: Role.VO) => {
  drawerFormRef.value?.open(row ? t("role.edit") : t("role.add"), modelValue.value);

  if (row) {
    startSpin();
    RoleAPI.getFormData(row.id)
      .then((data) => {
        modelValue.value = { ...data };
      })
      .finally(() => endSpin());
  }
};

/** 表单提交 */
const submitForm = (val: Role.Form) =>
  executeAsync(
    () => (val.id ? RoleAPI.update(val.id, val) : RoleAPI.create(val)),
    () => {
      drawerFormRef.value?.close();
      handleQuery();
    }
  );

/** 选中行 */
const selectedRowKeys = ref<string[]>([]);
const handleCheck = (keys: DataTableRowKey[]) => (selectedRowKeys.value = keys as string[]);

// 删除角色
const handleDelete = (roleId?: string) => {
  const roleIds = [roleId || selectedRowKeys.value].join(",");

  InquiryBox(t("confirm.deleteSelect")).then(() => {
    RoleAPI.deleteByIds(roleIds).then(() => {
      window.$message.success(t("message.deleteSuccess"));
      handleQuery();
    });
  });
};

/** 分配角色数据权限 */
const dataScopeRef = useTemplateRef("dataScope");
const handleOpenAssignPermDialog = (row: Role.VO) =>
  dataScopeRef.value?.open(row, `【${row.name}】${t("role.permission")}`);
</script>
