<template>
  <div>
    <TablePro
      v-model="query"
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
      @reset="handleReset"
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
        <n-button @click="handleClose">
          <template #icon>
            <icon-park-outline-close-small />
          </template>
          {{ t("button.close") }}
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
<script lang="tsx" setup>
import {
  type DataTableColumns,
  type DataTableRowKey,
  NButton,
  NFlex,
  NTag,
  NText,
  SelectOption,
} from "naive-ui";

import DictTypeAPI from "@/api/system/dict/type";
import DictDataAPI from "@/api/system/dict/data";

import { useLoading } from "@/hooks";
import { spin, executeAsync, InquiryBox, startSpin, endSpin, statusOptions } from "@/utils";
import { useTabStoreHook } from "@/store";

import Icones from "@/components/Icones.vue";
import CommonStatus from "@/components/CommonStatus.vue";

defineOptions({
  name: "DictItem",
  inheritAttrs: false,
});

const { t } = useI18n();

const route = useRoute();

const dictCode = ref(route.query.dictCode as string);

const tabStore = useTabStoreHook();

const dictTypeList = ref<OptionType[]>([]);
const getDictType = () => {
  DictTypeAPI.getList().then((data) => {
    dictTypeList.value = data;
  });
};

getDictType();

// 定义表单的初始值
const query = ref<DictData.Query>({
  pageNum: 1,
  pageSize: 10,
  dictCode: dictCode.value,
});

const tableData = ref<DictData.VO[]>([]);
const total = ref<number>(0);

const { loading, startLoading, endLoading } = useLoading();

onMounted(() => handleQuery());

const handleChange = (v: string) => {
  dictCode.value = v;
  query.value.dictCode = v;
  handleQuery();
};
/** 查询方法 */
const handleQuery = () => {
  startLoading();
  DictDataAPI.getDictItemPage(dictCode.value, query.value)
    .then(async (res) => {
      tableData.value = res.list;
      total.value = res.total;
    })
    .finally(() => endLoading());
};

// 重置
const handleReset = () => {
  dictCode.value = route.query.dictCode as string;
  handleQuery();
};

const formConfig = computed<FormPro.FormItemConfig[]>(() => [
  {
    name: "dictCode",
    label: t("tableHeader.dictCode"),
    component: "select",
    props: {
      clearable: false,
      options: dictTypeList.value,
      onUpdateValue: handleChange,
    },
  },
  {
    name: "keywords",
    label: t("tableHeader.keywords"),
    props: { placeholder: t("input") + t("tableHeader.dictLabel") },
  },
]);

const columns = ref<DataTableColumns<DictData.VO>>([
  { type: "selection", options: ["all", "none"] },
  { title: t("tableHeader.dictLabel"), key: "label", align: "center" },
  { title: t("tableHeader.dictValue"), key: "value", align: "center" },
  { title: t("tableHeader.sort"), key: "sort", align: "center" },
  {
    title: t("tableHeader.status"),
    key: "status",
    align: "center",
    render: ({ status }) => <CommonStatus value={status} />,
  },
  {
    title: t("tableHeader.action"),
    key: "action",
    align: "center",
    width: 300,
    render: (row) => (
      <NFlex justify="center">
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

/** 修改表单配置 */
const editFormConfig = computed(
  (): DialogForm.Form => ({
    config: [
      { name: "label", label: t("tableHeader.dictLabel") },
      { name: "value", label: t("tableHeader.dictValue") },
      { name: "sort", label: t("tableHeader.sort"), component: "number" },
      {
        name: "tagType",
        label: t("dict.tag.type"),
        component: "select",
        props: {
          options: [
            { label: t("dict.tag.default"), value: "default" },
            { label: t("dict.tag.primary"), value: "primary" },
            { label: t("dict.tag.success"), value: "success" },
            { label: t("dict.tag.info"), value: "info" },
            { label: t("dict.tag.warning"), value: "warning" },
            { label: t("dict.tag.error"), value: "error" },
          ],
          /** 自定义渲染 */
          renderLabel: ({ label, value }: SelectOption): VNode => (
            <NFlex align="center">
              {value && <NText type={value}>{`${label} (${value})`}</NText>}
              <NTag type={value ? value : "default"} bordered={false} size="small">
                {modelValue.value.label ?? t("tableHeader.dictLabel")}
              </NTag>
            </NFlex>
          ),
        },
      },
      {
        name: "status",
        label: t("tableHeader.status"),
        component: "radio",
        props: { options: statusOptions.value },
      },
    ],
    props: {
      rules: {
        label: [
          {
            required: true,
            message: t("input") + t("tableHeader.dictLabel"),
            trigger: "blur",
          },
        ],
        value: [
          {
            required: true,
            message: t("input") + t("tableHeader.dictValue"),
            trigger: "blur",
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
const modelValue = ref<DictData.Form>({
  id: "",
  dictCode: dictCode.value,
  status: 1,
  sort: 1,
});

/** 新增、编辑 */
const drawerFormRef = useTemplateRef("drawerForm");
const openDrawer = (row?: DictData.VO) => {
  drawerFormRef.value?.open(row ? t("dict.editItem") : t("dict.addItem"), modelValue.value);

  if (row) {
    startSpin();
    DictDataAPI.getDictItemFormData(dictCode.value, row.id)
      .then((data) => {
        modelValue.value = { ...data };
      })
      .finally(() => endSpin());
  } else {
    // 新增时重置表单
    modelValue.value = {
      id: "",
      dictCode: dictCode.value,
      status: 1,
      sort: 1,
    };
  }
};

/** 表单提交 */
const submitForm = async (val: DictData.Form) => {
  if (!val.tagType) {
    val.tagType = "" as DictData.Form["tagType"];
  }
  await executeAsync(
    () =>
      val.id
        ? DictDataAPI.updateDictItem(dictCode.value, val.id, val)
        : DictDataAPI.createDictItem(dictCode.value, val),
    () => {
      drawerFormRef.value?.close();
      handleQuery();
    }
  );
};

/** 选中行 */
const selectedRowKeys = ref<string[]>([]);
const handleCheck = (keys: DataTableRowKey[]) => (selectedRowKeys.value = keys as string[]);

// 删除字典项
const handleDelete = (id?: string) => {
  const ids = id || selectedRowKeys.value.join(",");

  InquiryBox(t("confirm.deleteSelect")).then(() => {
    DictDataAPI.deleteDictItems(dictCode.value, ids).then(() => {
      window.$message.success(t("message.deleteSuccess"));
      handleQuery();
    });
  });
};

// 返回按钮(关闭当前页面打开字典管理页面)
const handleClose = () => tabStore.closeCurrentTabOpenNew("/system/dict");
</script>
