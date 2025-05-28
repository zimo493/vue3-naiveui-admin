<template>
  <div>
    <SearchTable
      :formConfig="formConfig"
      :modelValue="query"
      :columns="columns"
      :tableData="tableData"
      :total="total"
      :loading="loading"
      :rowKey="(row: Role.VO) => row.id"
      @update:checked-row-keys="handleCheck"
      @search="handleQuery"
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
      </template>
    </SearchTable>
    <!-- 新增、编辑 -->
    <DrawerForm
      ref="drawerForm"
      :form-config="editConfig"
      :model-value="modelValue"
      :width="580"
      :loading="spin"
      @submit="submitForm"
    />

    <!-- 分配角色数据权限 -->
    <DataScope ref="dataScope" @success="handleQuery" />
  </div>
</template>
<script setup lang="tsx">
import { type DataTableColumns, type DataTableRowKey, NButton, NSpace } from "naive-ui";
import { type FormOption, FormItemType } from "@/components/custom/FormPro/types";

import RoleAPI from "@/api/system/role";

import { useLoading } from "@/hooks";
import { spin, endSpin, startSpin, InquiryBox } from "@/utils";

import Icones from "@/components/common/Icones.vue";
import CommonStatus from "@/components/common/CommonStatus.vue";

defineOptions({ name: "Role" });

// 定义表单的初始值
const query = ref<Role.Query>({
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
  RoleAPI.getPage(query.value)
    .then(async (res) => {
      tableData.value = res.list;
      total.value = res.total;
    })
    .finally(() => endLoading());
};

const formConfig = ref<FormOption<Role.Query>>({
  fields: [{ field: "keywords", label: "角色名称", type: FormItemType.Input }],
});

const columns = ref<DataTableColumns<Role.VO>>([
  { type: "selection", options: ["all", "none"] },
  { title: "角色名称", key: "name", align: "center" },
  { title: "角色编码", key: "code", align: "center" },
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
    width: 240,
    render: (row) => (
      <NSpace justify="center">
        <NButton
          text
          type="warning"
          v-slots={{ icon: () => <Icones icon="ant-design:node-index-outlined" /> }}
          onClick={() => handleOpenAssignPermDialog(row)}
        >
          数据权限
        </NButton>
        <NButton
          text
          type="info"
          v-slots={{ icon: () => <Icones icon="ant-design:plus-outlined" /> }}
          onClick={() => openDrawer(row)}
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
      </NSpace>
    ),
  },
]);

const editConfig = ref<FormOption<Role.Form>>({
  fields: [
    { field: "name", label: "角色名称", type: FormItemType.Input },
    { field: "code", label: "角色编码", type: FormItemType.Input },
    {
      field: "dataScope",
      label: "数据权限",
      type: FormItemType.Select,
      options: [
        { label: "全部数据", value: 1 },
        { label: "部门及子部门数据", value: 2 },
        { label: "本部门数据", value: 3 },
        { label: "本人数据", value: 4 },
      ],
    },
    {
      field: "status",
      label: "状态",
      type: FormItemType.Radio,
      options: [
        { label: "正常", value: 1 },
        { label: "停用", value: 0 },
      ],
    },
    { field: "sort", label: "排序", type: FormItemType.Number },
  ],
  labelWidth: 80,
  rules: {
    name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
    code: [{ required: true, message: "请输入角色编码", trigger: "blur" }],
    dataScope: [{ required: true, type: "number", message: "请选择数据权限", trigger: "change" }],
    status: [{ required: true, type: "number", message: "请选择状态", trigger: "change" }],
  },
});
/** 初始化表单 */
const modelValue = ref<Role.Form>({
  sort: 1,
  status: 1,
});
/** 新增、编辑 */
const drawerFormRef = useTemplateRef("drawerForm");
const openDrawer = (row?: Role.VO) => {
  drawerFormRef.value?.open(row ? "编辑角色" : "新增角色", modelValue.value);

  if (row) {
    drawerFormRef.value?.startLoading();
    RoleAPI.getFormData(row.id)
      .then((data) => {
        modelValue.value = { ...data };
      })
      .finally(() => drawerFormRef.value?.hideLoading());
  }
};

/** 表单提交 */
const submitForm = async (val: Role.Form) => {
  console.log(val, "表单提交");

  try {
    startSpin();
    val.id ? await RoleAPI.update(val.id, val) : await RoleAPI.create(val);

    window.$message.success("操作成功");

    drawerFormRef.value?.close();
    handleQuery();
  } finally {
    endSpin();
  }
};

/** 选中行 */
const selectedRowKeys = ref<string[]>([]);
const handleCheck = (keys: DataTableRowKey[]) => (selectedRowKeys.value = keys as string[]);

// 删除角色
const handleDelete = (roleId?: string) => {
  const roleIds = [roleId || selectedRowKeys.value].join(",");

  InquiryBox("确认删除已选中的数据项?").then(() => {
    RoleAPI.deleteByIds(roleIds).then(() => {
      window.$message.success("删除成功");
      handleQuery();
    });
  });
};

/** 分配角色数据权限 */
const dataScopeRef = useTemplateRef("dataScope");
const handleOpenAssignPermDialog = (row: Role.VO) =>
  dataScopeRef.value?.open(row, `【${row.name}】权限分配`);
</script>
