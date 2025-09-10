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
        <n-button type="warning" :loading="clear" :disabled="clearDisabled" @click="clearDictCache">
          <template #icon>
            <icon-park-outline-delete />
          </template>
          {{ t("button.clearCache") }}
          <span v-if="!clearDisabled" ml-8px>{{ cacheSize }}</span>
        </n-button>
      </template>
    </TablePro>

    <!-- 新增、编辑 -->
    <DrawerForm
      ref="drawerForm"
      :form="editFormConfig"
      :model-value="modelValue"
      :loading="spin"
      @submit="submitForm"
    />
  </div>
</template>
<script setup lang="tsx">
import { type DataTableColumns, type DataTableRowKey, NButton, NFlex } from "naive-ui";

import DictTypeAPI from "@/api/system/dict/type";

import { router } from "@/router";
import { useLoading } from "@/hooks";
import {
  spin,
  executeAsync,
  InquiryBox,
  endSpin,
  startSpin,
  statusOptions,
  getJsonSizeWithUnit,
} from "@/utils";
import { useDictStoreHook, useTabStoreHook } from "@/store";

import Icones from "@/components/icones.vue";
import CommonStatus from "@/components/common-status.vue";

defineOptions({
  name: "Dict",
  inheritAttrs: false,
});

const { t } = useI18n();

// 定义表单的初始值
const query = ref<DictType.Query>({
  pageNum: 1,
  pageSize: 10,
});

const tableData = ref<DictType.VO[]>([]);
const total = ref<number>(0);

const { loading, startLoading, endLoading } = useLoading();
const { loading: clear, startLoading: clearStart, endLoading: clearEnd } = useLoading();

// 缓存大小
const cacheSize = ref<string>("0 B");
// 获取字典缓存大小
const getCacheSize = () => {
  cacheSize.value = getJsonSizeWithUnit(window.sessionStorage.getItem("dict-store"));
};

onMounted(() => {
  getCacheSize();
  handleQuery();
});

onActivated(() => getCacheSize());

/** 查询方法 */
const handleQuery = () => {
  startLoading();
  DictTypeAPI.getPage(query.value)
    .then(async (res) => {
      tableData.value = res.list;
      total.value = res.total;
    })
    .finally(() => endLoading());
};

const formConfig = ref<FormPro.FormItemConfig[]>([
  {
    name: "keywords",
    label: t("tableHeader.keywords"),
    props: {
      placeholder: `${t("input")}${t("tableHeader.dictName")} / ${t("tableHeader.dictCode")}`,
    },
  },
]);

const columns = ref<DataTableColumns<DictType.VO>>([
  { type: "selection", options: ["all", "none"] },
  { title: t("tableHeader.dictName"), key: "name", align: "center" },
  {
    title: t("tableHeader.dictCode"),
    key: "dictCode",
    align: "center",
    render: (row) => (
      <NButton text type="primary" onClick={() => handleViewItems(row)}>
        {row.dictCode}
      </NButton>
    ),
  },
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
    width: 200,
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

const editFormConfig = computed(
  (): DialogForm.Form => ({
    config: [
      { name: "name", label: t("tableHeader.dictName") },
      { name: "dictCode", label: t("tableHeader.dictCode") },
      {
        name: "status",
        label: t("tableHeader.status"),
        component: "radio",
        props: { options: statusOptions.value },
      },
      { name: "remark", label: t("tableHeader.remark"), component: "textarea" },
    ],
    props: {
      rules: {
        name: [
          {
            required: true,
            message: t("input") + t("tableHeader.dictName"),
            trigger: "blur",
          },
        ],
        dictCode: [
          {
            required: true,
            message: t("input") + t("tableHeader.dictCode"),
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
const modelValue = ref<DictType.Form>({
  status: 1,
});

/** 新增、编辑 */
const drawerFormRef = useTemplateRef("drawerForm");
const openDrawer = (row?: DictType.VO) => {
  drawerFormRef.value?.open(row ? t("dict.edit") : t("dict.add"), modelValue.value);

  if (row) {
    startSpin();
    DictTypeAPI.getFormData(row.id)
      .then((data) => {
        modelValue.value = { ...data };
      })
      .finally(() => endSpin());
  }
};

/** 表单提交 */
const submitForm = (val: DictType.Form) =>
  executeAsync(
    () => (val.id ? DictTypeAPI.update(val.id, val) : DictTypeAPI.create(val)),
    () => {
      drawerFormRef.value?.close();
      handleQuery();
    }
  );

/** 选中行 */
const selectedRowKeys = ref<string[]>([]);
const handleCheck = (keys: DataTableRowKey[]) => (selectedRowKeys.value = keys as string[]);

// 删除字典
const handleDelete = (dictId?: string) => {
  const dictIds = dictId || selectedRowKeys.value.join(",");

  InquiryBox(t("confirm.deleteSelect")).then(() => {
    DictTypeAPI.deleteByIds(dictIds).then(() => {
      window.$message.success(t("message.deleteSuccess"));
      handleQuery();
    });
  });
};

// 查看字典项
const handleViewItems = ({ dictCode }: DictType.VO) => {
  // 跳转到字典项管理页面，并传递字典类型信息
  const path = `/system/dict-item`;
  const query = { dictCode };

  router.push({ path, query }).then(() => {
    // 使用 router.resolve 生成完整的路由对象
    const route = router.resolve({ path, query });

    // 添加标签页
    useTabStoreHook().addTab({
      ...route, // 解构路由对象，确保包含所有必要属性
      name: `DictItem`,
      meta: {
        title: `字典数据项`, // 自定义标题
        icon: "icon-park-outline:book-one", // 自定义图标
      },
    });
  });
};

// 清除字典缓存
const dictStore = useDictStoreHook();
const clearDisabled = computed(() => dictStore.dict.length === 0);
const clearDictCache = () => {
  clearStart();
  setTimeout(() => {
    const dictList = dictStore.dict.map((item) => item.key);

    dictStore.cleanDict();
    clearEnd();
    window.$message.success(t("dict.clear", { dict: dictList.join(", ") }));
  }, 1000);
};
</script>
