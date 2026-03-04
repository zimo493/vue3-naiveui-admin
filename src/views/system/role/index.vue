<template>
  <div>
    <TablePro
      v-model="queryParams"
      :form-config="formConfig"
      :columns="columns"
      :table-data="tableData"
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
        <n-button v-has-perm="['sys:role:create']" type="primary" @click="openDrawer()">
          <template #icon>
            <icon-park-outline-plus />
          </template>
          {{ t("button.add") }}
        </n-button>
        <n-button
          v-has-perm="['sys:role:delete']"
          type="error"
          :disabled="!selectedRowKeys.length"
          @click="handleDelete()"
        >
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
import DeptAPI from "@/api/system/dept";

import { useLoading } from "@/hooks";
import { spin, executeAsync, InquiryBox, startSpin, endSpin, statusOptions } from "@/utils";

import Icones from "@/components/icones.vue";
import CommonStatus from "@/components/common-status.vue";

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
    .then(async (data) => {
      tableData.value = data.list;
      total.value = data.total ?? 0;
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
          v-has-perm={["sys:role:assign"]}
          v-slots={{ icon: () => <Icones icon="ant-design:node-index-outlined" /> }}
          onClick={() => handleOpenAssignPermDialog(row)}
        >
          {t("role.dataPermission")}
        </NButton>
        <NButton
          text
          type="info"
          v-has-perm={["sys:role:update"]}
          v-slots={{ icon: () => <Icones icon="ant-design:edit-outlined" /> }}
          onClick={() => openDrawer(row)}
        >
          {t("button.edit")}
        </NButton>
        <NButton
          text
          type="error"
          v-has-perm={["sys:role:delete"]}
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
          { label: t("role.customDepartmentData"), value: 5 },
        ],
      },
    },
    {
      name: "deptIds",
      label: t("dept.dept"),
      component: "tree-select",
      hidden: true,
      props: {
        multiple: true,
        cascade: false,
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

const deptOptions = ref<OptionItem[]>([]);

// dataScope=5 时使用：加载部门下拉、回显 deptIds
const getDeptIdsField = () => (editFormConfig.config ?? []).find((item) => item.name === "deptIds");

const setDeptIdsFieldVisible = (visible: boolean) => {
  const field = getDeptIdsField();

  if (!field) return;

  field.hidden = !visible;
};

const bindDeptOptionsToField = () => {
  const field = getDeptIdsField();

  if (!field) return;

  field.props = {
    ...(field.props || {}),
    options: deptOptions.value,
    keyField: "value",
    labelField: "label",
  };
};

const ensureDeptOptionsLoaded = async () => {
  if (deptOptions.value.length > 0) return;

  deptOptions.value = await DeptAPI.getOptions();
};

/** 新增、编辑 */
const drawerFormRef = useTemplateRef("drawerForm");

const openDrawer = (row?: Role.VO) => {
  drawerFormRef.value?.open(row ? t("role.edit") : t("role.add"), modelValue.value);

  const isCustomScope = modelValue.value.dataScope === 5;

  setDeptIdsFieldVisible(isCustomScope);
  bindDeptOptionsToField();

  if (row) {
    startSpin();

    RoleAPI.getFormData(row.id)
      .then((data) => {
        modelValue.value = { ...data };

        const isCustom = modelValue.value.dataScope === 5;

        setDeptIdsFieldVisible(isCustom);

        if (!isCustom) {
          modelValue.value.deptIds = undefined;

          return;
        }

        RoleAPI.getRoleDeptIds(row.id).then((deptIds) => {
          modelValue.value.deptIds = deptIds;
        });
      })
      .finally(() => endSpin());
  }
};

/** 表单提交 */
const submitForm = (val: Role.Form) =>
  executeAsync(
    () => {
      const submitData: Role.Form = { ...val };

      if (submitData.dataScope !== 5) {
        submitData.deptIds = undefined;
      }

      return submitData.id ? RoleAPI.update(submitData.id, submitData) : RoleAPI.create(submitData);
    },
    () => {
      drawerFormRef.value?.close();
      handleQuery();
    }
  );

watch(
  () => modelValue.value.dataScope,
  async (val) => {
    setDeptIdsFieldVisible(val === 5);

    if (val !== 5) return;

    await ensureDeptOptionsLoaded();
    bindDeptOptionsToField();
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
