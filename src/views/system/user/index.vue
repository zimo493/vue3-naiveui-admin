<template>
  <div>
    <n-grid x-gap="10">
      <n-gi :span="4">
        <n-card h="[100%]">
          <n-flex vertical>
            <n-input v-model:value="pattern" placeholder="搜索部门名称" clearable>
              <template #prefix>
                <Icones icon="icon-park-outline:search" />
              </template>
            </n-input>
            <n-spin :show="show">
              <n-tree
                :show-irrelevant-nodes="false"
                :show-line="true"
                :pattern="pattern"
                :data="deptOptions"
                default-expand-all
                key-field="value"
                label-field="label"
                @update:selected-keys="updateSelectedKeys"
              />
            </n-spin>
          </n-flex>
        </n-card>
      </n-gi>
      <n-gi :span="20">
        <SearchTable
          :formConfig="formConfig"
          :modelValue="queryParams"
          :columns="columns"
          :tableData="tableData"
          :total="total"
          :loading="loading"
          :rowKey="(row: User.VO) => row.id"
          @update:checked-row-keys="handleCheck"
          @search="handleQuery"
          @reset="handleReset"
        >
          <template #controls>
            <n-button v-has-perm="['sys:user:add']" type="primary" @click="handleAdd()">
              <template #icon>
                <icon-park-outline-plus />
              </template>
              新增
            </n-button>
            <n-button
              v-has-perm="['sys:user:delete']"
              type="error"
              :disabled="!selectedRowKeys.length"
              @click="handleBatchDelete()"
            >
              <template #icon>
                <icon-park-outline-delete-themes />
              </template>
              删除
            </n-button>
            <n-button v-has-perm="'sys:user:import'" type="success" @click="handleImport">
              <template #icon><icon-park-outline-upload-one /></template>
              导入
            </n-button>

            <n-button v-has-perm="['sys:user:export']" type="warning" @click="handleExport">
              <template #icon>
                <icon-park-outline-download-one />
              </template>
              导出
            </n-button>
          </template>
        </SearchTable>
      </n-gi>
    </n-grid>
  </div>
</template>
<script lang="tsx">
export default { name: "User" };
</script>
<script setup lang="tsx">
import {
  type DataTableColumns,
  type DataTableRowKey,
  NAvatar,
  NButton,
  NFlex,
  NImage,
  NSpace,
  NText,
} from "naive-ui";
import { FormItemType, type FormOption } from "@/components/custom/FormPro/types";
import { useDict, useLoading } from "@/hooks";

import DeptAPI from "@/api/system/dept";
import UserAPI from "@/api/system/user";

import Icones from "@/components/common/Icones.vue";
import DictTag from "@/components/custom/DictTag/index.vue";
import CommonStatus from "@/components/common/CommonStatus.vue";

const { loading, startLoading, endLoading } = useLoading();
const { gender } = useDict("gender");

onMounted(() => {
  getDeptTree(); // 获取部门树
  handleQuery(); // 查询数据
});

const show = ref<boolean>(false); // 部门加载状态
const deptOptions = ref<OptionType[]>([]); // 部门选择树
const pattern = ref<string>(""); // 搜索过滤

/** 查询部门下拉树结构 */
const getDeptTree = () => {
  show.value = true;
  DeptAPI.getOptions()
    .then((data) => {
      deptOptions.value = data;
    })
    .finally(() => (show.value = false));
};

/** 部门选中改变 */
const updateSelectedKeys = (keys: number[]) => {
  queryParams.value.deptId = keys.length ? keys[0] : undefined;
  handleQuery();
};

const queryParams = ref<User.Query>({
  pageNum: 1,
  pageSize: 10,
});

const tableData = ref<User.VO[]>([]); // 表格数据
const total = ref<number>(0); // 表格数据总量
// const rowKey = (row: User.VO) => row.id; // 表格行key

/** 查询方法 */
const handleQuery = () => {
  startLoading();
  UserAPI.getPage(queryParams.value)
    .then(async (res) => {
      tableData.value = res.list;
      total.value = res.total;
    })
    .finally(() => endLoading());
};

/** 搜索配置 */
const formConfig = ref<FormOption<User.Query>>({
  fields: [
    {
      field: "keywords",
      label: "关键字",
      placeholder: "请输入用户名/昵称/手机号",
      type: FormItemType.Input,
      colSpan: 5,
    },
    {
      field: "status",
      label: "状态",
      type: FormItemType.Select,
      colSpan: 3,
      options: [
        { label: "正常", value: 1 },
        { label: "禁用", value: 0 },
      ],
    },
    {
      field: "createTime",
      label: "创建时间",
      type: FormItemType.Datepicker,
      colSpan: 7,
      otherOptions: {
        type: "daterange",
        closeOnSelect: true,
      },
      otherEvents: {
        updateFormattedValue: (value: [string, string]) => (queryParams.value.createTime = value),
      },
    },
  ],
  // showLabel: false, // 不显示标签
});

/** 表格配置 */
const columns = ref<DataTableColumns<User.VO>>([
  { type: "selection", options: ["all", "none"] },

  {
    key: "avatar",
    align: "center",
    render: ({ avatar, nickname, gender }) => {
      const size = 40; // 头像尺寸
      const color = gender === 1 ? "#409eff" : gender === 2 ? "#ff80bf" : "#f0a020"; // 背景颜色

      return (
        <NFlex align="center" justify="center">
          <NImage
            object-fit="cover"
            show-toolbar-tooltip
            class="border-rd-3px"
            width={size}
            height={size}
            src={avatar}
            v-slots={{
              placeholder: () => (
                <NAvatar
                  size={size}
                  color={color}
                  src={avatar}
                  render-fallback={() => (
                    <NFlex w="100%" align="center" justify="center">
                      <NText className="text-15px font-bold">{nickname?.slice(-2)}</NText>
                    </NFlex>
                  )}
                />
              ),
            }}
          />
        </NFlex>
      );
    },
  },
  { title: "用户名", key: "username", align: "center" },
  { title: "昵称", key: "nickname", align: "center" },
  {
    title: "性别",
    key: "gender",
    align: "center",
    render: (row) => <DictTag options={gender.value} value={row.gender} />,
  },
  { title: "部门", key: "deptName", align: "center" },
  { title: "手机号码", key: "mobile", align: "center" },
  { title: "邮箱", key: "email", align: "center" },
  {
    title: "状态",
    key: "status",
    align: "center",
    render: ({ status }) => <CommonStatus value={status} />,
  },
  { title: "创建时间", key: "createTime", align: "center" },
  {
    title: "操作",
    key: "action",
    align: "center",
    render: (row) => (
      <NSpace justify="center">
        <NButton
          v-has-perm={["sys:user:edit"]}
          text
          type="primary"
          v-slots={{ icon: () => <Icones icon="ant-design:edit-outlined" /> }}
          onClick={() => handleEdit(row)}
        >
          编辑
        </NButton>
        <NButton
          v-has-perm={["sys:user:reset-password"]}
          text
          type="warning"
          v-slots={{ icon: () => <Icones icon="ant-design:redo-outlined" /> }}
          onClick={() => handleResetPassword(row)}
        >
          重置密码
        </NButton>
        <NButton
          v-has-perm={["sys:user:delete"]}
          text
          type="error"
          v-slots={{ icon: () => <Icones icon="ant-design:delete-outlined" /> }}
          onClick={() => handleDelete(row)}
        >
          删除
        </NButton>
      </NSpace>
    ),
  },
]);

/** 选中行 */
const selectedRowKeys = ref<string[]>([]);
const handleCheck = (keys: DataTableRowKey[]) => (selectedRowKeys.value = keys as string[]);

// 新增
const handleAdd = () => {};

// 编辑
const handleEdit = (row: User.VO) => {};

// 重置密码
const handleResetPassword = (row: User.VO) => {};

// 删除
const handleDelete = (row: User.VO) => {};

// 批量删除
const handleBatchDelete = () => {
  console.log(selectedRowKeys.value);
};

// 导入
const handleImport = () => {};

// 导出
const handleExport = () => {};

/** 重置 */
const handleReset = () => {
  queryParams.value.deptId = undefined;
  handleQuery();
};
</script>
