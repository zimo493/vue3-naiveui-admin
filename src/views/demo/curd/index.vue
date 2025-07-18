<template>
  <div>
    <TablePro
      v-model="queryParams"
      :form-config="formConfig"
      :collapse-length="4"
      :controls-span="6"
      :columns="columns"
      :table-data="tableData"
      :total="tableData.length"
      :loading="loading"
      :row-key="({ key }) => key"
      :table-props="{
        checkedRowKeys: selectedRowKeys,
        onUpdateCheckedRowKeys: handleCheck,
      }"
      @query="handleQuery"
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
          模态框
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
    </TablePro>

    <!-- 抽屉表单 -->
    <DrawerForm
      ref="drawerForm"
      v-model="modelValue"
      :form="editFormConfig"
      :width="600"
      :loading="spin"
      @submit="submitForm"
    >
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

    <!-- 模态框表单 -->
    <ModalForm
      ref="modalForm"
      v-model="modelValue"
      :form="editFormConfig"
      :width="800"
      :loading="spin"
      @submit="submitForm"
    >
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
    </ModalForm>

    <!-- 查看 -->
    <ModalForm
      ref="modalView"
      v-model="viewValue"
      :form-config="viewConfig"
      :width="580"
      :loading="spin"
      use-type="view"
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
    </ModalForm>
  </div>
</template>
<script lang="tsx" setup>
import { NAvatar, NButton, NSpace, type DataTableColumns, type DataTableRowKey } from "naive-ui";
import type { Form, Search, TableData } from "./config/types";

import tableData from "./config/tableData";

import { useLoading } from "@/hooks";

import Icones from "@/components/common/Icones.vue";
import { spin, endSpin, InquiryBox, startSpin } from "@/utils";
import UploadFile from "@/components/custom/UploadFile.vue";
import { FileInfo } from "@/api/file";

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
          模态框
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
const formConfig = ref<FormPro.FormItemConfig[]>([
  {
    name: "name",
    span: 3,
    props: { placeholder: "我不显示Label" },
  },
  { name: "address", label: "地址", span: 3 },
  {
    name: "options",
    label: "字典选择",
    component: "select",
    dict: "notice_type",
    labelMessage: "字典示例，只需要传递 dict 即可，不需要配置 options 啦",
  },
  {
    name: "checkbox",
    label: "多选",
    component: "checkbox",
    props: {
      options: [
        { label: "选项1", value: 1 },
        { label: "选项2", value: 2 },
        { label: "选项3", value: 3 },
        { label: "选项4", value: 4 },
      ],
    },
    span: 6,
    labelMessage: "选项也可以是配置的 options",
  },
  {
    name: "age",
    label: "年龄",
    labelMessage: "自定义插槽",
  },
  {
    name: "time",
    label: "时间选择器",
    span: 4,
    component: "time",
  },
  {
    name: "options",
    label: "单选组",
    component: "radio",
    dict: "notice_type",
    span: 10,
    labelMessage: "不一定非要是Select, Radio也可以有",
  },
  {
    name: "date",
    label: "日期选择器",
    span: 4,
    component: "date",
  },
  {
    name: "dateTime",
    label: "时间日期选择器",
    span: 5,
    component: "date",
    props: { type: "datetime" },
  },
  {
    name: "createTime",
    label: "时间范围",
    span: 5,
    component: "date",
    props: {
      type: "daterange",
      closeOnSelect: true,
      onUpdateFormattedValue: (value: [string, string]) => (queryParams.value.createTime = value),
    },
  },
]);

const handleQuery = () => {
  msg("查询参数：" + JSON.stringify(queryParams.value));
  startLoading();

  setTimeout(() => endLoading(), 200);
};

/** 选中行 */
const selectedRowKeys = ref<number[]>([2, 5]); // 选中项
const handleCheck = (keys: DataTableRowKey[]) => (selectedRowKeys.value = keys as number[]);

const editFormConfig: DialogForm.Form = {
  // 新增或者编辑表单配置项
  config: [
    {
      name: "avatar",
      label: "头像",
      component: () => (
        <UploadFile
          value={modelValue.value.avatar}
          limit={1}
          onUpdate={(val: FileInfo) => (modelValue.value.avatar = val.url)}
          onRemove={() => (modelValue.value.avatar = undefined)}
        />
      ),
    },
    { name: "name", label: "姓名" },
    { name: "address", label: "地址", component: "textarea" },
    {
      name: "dict",
      label: "字典单选",
      component: "select",
      dict: "notice_type",
      labelMessage: "可以使用字典选择",
    },
    {
      name: "dict",
      label: "字典单选",
      component: "radio",
      dict: "notice_type",
    },
    {
      name: "dicts",
      label: "字典多选",
      component: "checkbox",
      dict: "notice_type",
      labelMessage: "可以使用字典多选",
    },
    {
      name: "dicts",
      label: "字典多选",
      component: "select",
      dict: "notice_type",
      props: { multiple: true },
    },
    {
      name: "options",
      label: "不使用字典",
      component: "select",
      props: {
        placeholder: "也可以使用本地选项",
        options: [
          { label: "选项1", value: 1 },
          { label: "选项2", value: 2 },
          { label: "选项3", value: 3 },
          { label: "选项4", value: 4 },
        ],
      },
    },
    { name: "photo", label: "图片上传" },
    { name: "file", label: "文件上传" },
  ],
  props: {
    // 表单校验
    rules: {
      avatar: [{ required: true, message: "请上传头像", trigger: ["blur", "change"] }],
      name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
      dicts: [{ required: true, type: "array", message: "请选择字典", trigger: "change" }],
    },
    labelWidth: 100,
  },
};

const modelValue = ref<Form>({});

/** 新增、编辑 */
const drawerFormRef = useTemplateRef("drawerForm");
const openDrawer = (row?: TableData) => {
  drawerFormRef.value?.open(row ? "编辑表单" : "新增表单", modelValue.value);
  if (row) {
    // 模拟接口获取数据
    startSpin();
    setTimeout(() => {
      modelValue.value = { ...row };
      endSpin();
    }, 2000);
  }
};

// 模态框弹窗
const dialogFormRef = useTemplateRef("modalForm");
const openDialog = (row?: TableData) => {
  dialogFormRef.value?.open(row ? "编辑表单" : "新增表单", modelValue.value);
  if (row) {
    // 模拟接口获取数据
    startSpin();
    setTimeout(() => {
      modelValue.value = { ...row };
      endSpin();
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
const dialogViewRef = useTemplateRef("modalView");
const viewConfig: FormPro.FormItemConfig[] = [
  { name: "avatar", label: "Avatar:", component: "text" },
  { name: "name", label: "Name:", component: "text" },
  { name: "age", label: "Age:", component: "text" },
  { name: "address", label: "Address:", component: "text" },
  { name: "chinese", label: "Chinese:", component: "text" },
  { name: "math", label: "Math:", component: "text" },
  { name: "english", label: "English:", component: "text" },
  { name: "photo", label: "Photo:", component: "text" },
  { name: "file", label: "File:", component: "text" },
];
const viewValue = ref<TableData>({} as TableData);
const handleView = (row: TableData) => {
  dialogViewRef.value?.open("查看详情", viewValue.value);
  // 模拟接口获取数据
  startSpin();
  setTimeout(() => {
    viewValue.value = { ...row };
    endSpin();
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
