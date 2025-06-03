<template>
  <n-space vertical>
    <n-alert title="DrawerForm采用抽屉组件 DialogForm采用对话框组件 配置一样" type="info" />
    <SearchTable
      v-model:checked-row-keys="selectedRowKeys"
      :formConfig="formConfig"
      :modelValue="queryParams"
      :collapse-Length="4"
      :controls-span="6"
      :columns="columns"
      :tableData="tableData"
      :total="tableData.length"
      :loading="loading"
      :rowKey="(row: TableData) => row.key"
      @update:checked-row-keys="handleCheck"
      @search="handleQuery"
      @reset="handleQuery"
    >
      <template #before>
        <n-button tertiary @click="msg('点击了搜索组件前置自定义按钮')">前置自定义按钮</n-button>
      </template>
      <!-- <template #after><n-button>后置自定义按钮</n-button></template> -->

      <template #controls>
        <n-button type="primary" @click="openDrawer()">
          <template #icon>
            <icon-park-outline-plus />
          </template>
          抽屉
        </n-button>
        <n-button type="warning" @click="openDialog()">
          <template #icon>
            <icon-park-outline-plus />
          </template>
          对话框
        </n-button>
        <n-button type="error" :disabled="!selectedRowKeys.length" @click="handleDelete()">
          <template #icon>
            <icon-park-outline-delete-themes />
          </template>
          删除
        </n-button>
        <n-button type="success" strong secondary @click="msg('点击了表格操作区自定义按钮')">
          自定义按钮
        </n-button>
      </template>
      <template #age>
        <n-input-number v-model:value="queryParams.age" clearable placeholder="我是自定义插槽" />
      </template>
    </SearchTable>

    <!-- 抽屉表单 -->
    <DrawerForm
      ref="drawerForm"
      :form-config="editConfig"
      :model-value="modelValue"
      :width="600"
      @submit="submitForm"
    >
      <template #avatar>
        <UploadFile
          :value="modelValue.avatar"
          :limit="1"
          @upload="(val) => (modelValue.avatar = val.url)"
          @remove="modelValue.avatar = undefined"
        />
      </template>
      <template #photo>
        <UploadFile
          :value="modelValue.photo"
          @upload="(val) => modelValue.photo?.push(val.url)"
          @remove="(val) => modelValue.photo?.splice(modelValue.photo.indexOf(val.url), 1)"
        />
      </template>
      <template #file>
        <UploadFile
          :value="modelValue.file"
          type="text"
          @upload="(val) => modelValue.file?.push(val.url)"
          @remove="(val) => modelValue.file?.splice(modelValue.file.indexOf(val.url), 1)"
        >
          <n-button type="primary" strong secondary>上传文件</n-button>
        </UploadFile>
      </template>
    </DrawerForm>

    <!-- 对话框表单 -->
    <DialogForm
      ref="dialogForm"
      :form-config="editConfig"
      :model-value="modelValue"
      :width="800"
      @submit="submitForm"
    >
      <template #avatar>
        <UploadFile
          :value="modelValue.avatar"
          :limit="1"
          @upload="(val) => (modelValue.avatar = val.url)"
          @remove="modelValue.avatar = undefined"
        />
      </template>
      <template #photo>
        <UploadFile
          :value="modelValue.photo"
          @upload="(val) => modelValue.photo?.push(val.url)"
          @remove="(val) => modelValue.photo?.splice(modelValue.photo.indexOf(val.url), 1)"
        />
      </template>
      <template #file>
        <UploadFile
          :value="modelValue.file"
          type="text"
          @upload="(val) => modelValue.file?.push(val.url)"
          @remove="(val) => modelValue.file?.splice(modelValue.file.indexOf(val.url), 1)"
        >
          <n-button type="success" strong secondary>上传文件</n-button>
        </UploadFile>
      </template>
    </DialogForm>

    <!-- 查看 -->
    <DialogForm
      ref="dialogView"
      :form-config="viewConfig"
      :model-value="viewValue"
      :width="580"
      is-look
    >
      <template #avatar>
        <UploadFile v-if="viewValue.avatar" :value="viewValue.avatar" :limit="1" disabled />
      </template>
      <template #photo>
        <UploadFile v-if="viewValue.photo?.length" :value="viewValue.photo" disabled :limit="1" />
      </template>
      <template #file>
        <n-flex vertical align="flex-start" :size="[0, 0]">
          <n-button
            v-for="item in viewValue.file"
            :key="item"
            :href="item"
            text
            tag="a"
            target="_blank"
            type="primary"
          >
            <template #icon>
              <Icones icon="ant-design:paper-clip-outlined" />
            </template>
            {{ item }}
          </n-button>
        </n-flex>
      </template>
    </DialogForm>
  </n-space>
</template>
<script lang="tsx" setup>
import { NAvatar, NButton, NSpace, type DataTableColumns, type DataTableRowKey } from "naive-ui";
import type { Form, Search, TableData } from "./config/types";

import tableData from "./config/tableData";

import { useLoading } from "@/hooks";

import Icones from "@/components/common/Icones.vue";
import { InquiryBox } from "@/utils";

const { loading, startLoading, endLoading } = useLoading();

const columns = ref<DataTableColumns<TableData>>([
  { type: "selection", options: ["all", "none"], disabled: ({ key }) => key % 3 === 0 },
  { title: "Key", key: "key" },
  {
    title: "Avatar",
    key: "avatar",
    render: ({ avatar }) => <NAvatar size={48} src={avatar} />,
  },
  { title: "Name", key: "name" },
  { title: "Age", key: "age", sorter: (a, b) => a.age - b.age },
  { title: "Chinese Score", key: "chinese", defaultSortOrder: false },
  { title: "Math Score", key: "math" },
  { title: "English Score", key: "english" },
  { title: "Address", key: "address" },
  {
    title: "操作",
    key: "actions",
    align: "center",
    render: (row) => (
      <NSpace justify="center">
        <NButton
          text
          type="primary"
          onClick={() => openDrawer(row)}
          v-slots={{
            icon: () => <Icones icon="ant-design:edit-filled" />,
          }}
        >
          抽屉
        </NButton>
        <NButton
          text
          type="warning"
          onClick={() => openDialog(row)}
          v-slots={{
            icon: () => <Icones icon="ant-design:edit-filled" />,
          }}
        >
          对话框
        </NButton>
        <NButton
          text
          type="info"
          onClick={() => handleView(row)}
          v-slots={{
            icon: () => <Icones icon="ant-design:eye-filled" />,
          }}
        >
          查看
        </NButton>
      </NSpace>
    ),
  },
]);
const queryParams = ref<Search>({
  pageNum: 1,
  pageSize: 10,
});
const formConfig = ref<TablePro.FormOption<Search>>({
  fields: [
    {
      field: "name",
      placeholder: "我不显示Label",
      colSpan: 3,
    },
    { field: "address", label: "地址", colSpan: 3 },

    {
      field: "options",
      label: "字典选择",
      type: "select",
      dict: "notice_type",
      labelMessage: "字典示例，只需要传递 dict 即可，不需要配置 options 啦",
    },
    {
      field: "checkbox",
      label: "多选",
      type: "checkbox",
      options: [
        { label: "选项1", value: 1 },
        { label: "选项2", value: 2 },
        { label: "选项3", value: 3 },
        { label: "选项4", value: 4 },
      ],
      colSpan: 6,
      labelMessage: "选项也可以是配置的 options",
    },
    {
      field: "age",
      label: "年龄",
      slotName: "age",
      labelMessage: "自定义插槽",
    },
    {
      field: "options",
      label: "单选组",
      type: "radio",
      dict: "notice_type",
      colSpan: 10,
      labelMessage: "不一定非要是Select, Radio也可以有",
    },
    {
      field: "date",
      label: "日期选择器",
      colSpan: 4,
      type: "datepicker",
    },
    {
      field: "time",
      label: "时间选择器",
      colSpan: 4,
      type: "timepicker",
    },
    {
      field: "dateTime",
      label: "时间日期选择器",
      colSpan: 5,
      type: "datepicker",
      otherOptions: { type: "datetime" },
    },
    {
      field: "createTime",
      label: "时间范围",
      colSpan: 5,
      type: "datepicker",
      otherOptions: {
        type: "daterange",
        closeOnSelect: true,
      },
      otherEvents: {
        updateFormattedValue: (value: [string, string]) => (queryParams.value.createTime = value),
      },
    },
  ],
  // showLabel: false, // 隐藏标签
});

const handleQuery = () => {
  msg("查询参数：" + JSON.stringify(queryParams.value));
  startLoading();

  setTimeout(() => endLoading(), 200);
};

/** 选中行 */
const selectedRowKeys = ref<number[]>([2, 5]); // 选中项
const handleCheck = (keys: DataTableRowKey[]) => (selectedRowKeys.value = keys as number[]);

const editConfig = ref<TablePro.FormOption<Form>>({
  // 新增或者编辑表单配置项
  fields: [
    { field: "avatar", label: "头像", slotName: "avatar" },
    { field: "name", label: "姓名" },
    { field: "address", label: "地址", type: "textarea" },
    {
      field: "dict",
      label: "字典单选",
      type: "select",
      dict: "notice_type",
      labelMessage: "可以使用字典选择",
    },
    {
      field: "dict",
      label: "字典单选",
      type: "radio",
      dict: "notice_type",
    },
    {
      field: "dicts",
      label: "字典多选",
      type: "checkbox",
      dict: "notice_type",
      labelMessage: "可以使用字典多选",
    },
    {
      field: "dicts",
      label: "字典多选",
      type: "select",
      dict: "notice_type",
      otherOptions: {
        multiple: true,
      },
    },
    {
      field: "options",
      label: "不使用字典",
      type: "select",
      placeholder: "也可以使用本地选项",
      options: [
        { label: "选项1", value: 1 },
        { label: "选项2", value: 2 },
        { label: "选项3", value: 3 },
        { label: "选项4", value: 4 },
      ],
    },
    { field: "photo", label: "图片上传", slotName: "photo" },
    { field: "file", label: "文件上传", slotName: "file" },
  ],
  labelWidth: 100, // 标签的宽度，默认没有宽度
  // 表单校验
  rules: {
    avatar: [{ required: true, message: "请上传头像", trigger: ["blur", "change"] }],
    name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
    dicts: [{ required: true, type: "array", message: "请选择字典", trigger: "change" }],
  },
});

const modelValue = ref<Form>({});

/** 新增、编辑 */
const drawerFormRef = useTemplateRef("drawerForm");
const openDrawer = (row?: TableData) => {
  drawerFormRef.value?.open(row ? "编辑表单" : "新增表单", modelValue.value);
  if (row) {
    // 模拟接口获取数据
    drawerFormRef.value?.startLoading();
    setTimeout(() => {
      modelValue.value = { ...row };
      drawerFormRef.value?.hideLoading();
    }, 2000);
  }
};

// 对话框弹窗
const dialogFormRef = useTemplateRef("dialogForm");
const openDialog = (row?: TableData) => {
  dialogFormRef.value?.open(row ? "编辑表单" : "新增表单", modelValue.value);
  if (row) {
    // 模拟接口获取数据
    dialogFormRef.value?.startLoading();
    setTimeout(() => {
      modelValue.value = { ...row };
      dialogFormRef.value?.hideLoading();
    }, 2000);
  }
};

/** 表单提交 */
const submitForm = async (val: Form) => {
  console.log(val, "表单提交");

  window.$message.success(JSON.stringify(val));

  drawerFormRef.value?.close();
  handleQuery();
};

// 查看
const dialogViewRef = useTemplateRef("dialogView");
const viewConfig = ref<TablePro.FormOption<TableData>>({
  // 新增或者编辑表单配置项
  fields: [
    { field: "avatar", label: "Avatar:", slotName: "avatar" },
    { field: "name", label: "Name:", type: "text" },
    { field: "age", label: "Age:", type: "text" },
    { field: "address", label: "Address:", type: "text" },
    { field: "chinese", label: "Chinese:", type: "text" },
    { field: "math", label: "Math:", type: "text" },
    { field: "english", label: "English:", type: "text" },
    { field: "photo", label: "Photo:", slotName: "photo" },
    { field: "file", label: "File:", slotName: "file" },
  ],
  labelWidth: 100, // 标签的宽度，默认没有宽度
});
const viewValue = ref<TableData>({} as TableData);
const handleView = (row: TableData) => {
  dialogViewRef.value?.open("查看详情", viewValue.value);
  // 模拟接口获取数据
  dialogViewRef.value?.startLoading();
  setTimeout(() => {
    viewValue.value = { ...row };
    dialogViewRef.value?.hideLoading();
  }, 2000);
};

const handleDelete = () => {
  InquiryBox("确定要删除选中项吗？")
    .then(() => window.$message.warning("删除项：" + selectedRowKeys.value.toString()))
    .catch(() => {});
};

const msg = (msg: string) => {
  window.$message.success(msg);
};
</script>
