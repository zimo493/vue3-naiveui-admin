<template>
  <div>
    <TablePro
      v-model="query"
      :form-config="formConfig"
      :columns="columns"
      :table-data="tableData"
      :total="total"
      :loading="loading"
      :row-key="({ id }) => id"
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
    <ModalForm
      ref="modalForm"
      v-model="modelValue"
      :form="editFormConfig"
      :width="1000"
      :loading="spin"
      @submit="submitForm"
    >
      <template v-if="modelValue.targetType === 2" #targetUserIds>
        <n-select
          v-model:value="modelValue.targetUserIds"
          :options="userOptions"
          multiple
          filterable
          :placeholder="t('notice.target.placeholder')"
        />
      </template>
      <template #content>
        <WangEditor v-model="modelValue.content" />
      </template>
    </ModalForm>

    <!-- 详情 -->
    <ModalForm ref="modalView" v-model="viewValue" use-type="view" :form-config="viewConfig">
      <template #title>
        <n-flex align="center">
          <DictTag v-if="viewValue.type" :options="notice_type" :value="viewValue.type" />
          <n-text>{{ viewValue.title }}</n-text>
        </n-flex>
      </template>
      <template #publishStatus>
        <component :is="getPublishStatusTag(viewValue.publishStatus)" />
      </template>
      <template #content>
        <div pt="[.4rem]" v-html="viewValue.content" />
      </template>
    </ModalForm>
  </div>
</template>

<script lang="tsx" setup>
import {
  type DataTableColumns,
  type DataTableRowKey,
  FormItemRule,
  NButton,
  NFlex,
  NTag,
  NText,
} from "naive-ui";

import { spin, executeAsync, InquiryBox, startSpin, endSpin } from "@/utils";
import { useDict, useLoading } from "@/hooks";

import NoticeAPI from "@/api/system/notice";
import UserAPI from "@/api/system/user";

import DictTag from "@/components/DictTag.vue";
import WangEditor from "@/components/WangEditor.vue";

defineOptions({
  name: "NoticeList",
  inheritAttrs: false,
});

const { t } = useI18n();

// 获取字典数据
const { notice_type, notice_level } = useDict("notice_type", "notice_level");

// 定义搜索表单的初始值
const query = ref<Notice.Query>({
  pageNum: 1,
  pageSize: 10,
});

const tableData = ref<Notice.VO[]>([]);
const total = ref<number>(0);

const { loading, startLoading, endLoading } = useLoading();

onMounted(() => handleQuery());

// 指定用户发送时获取所有的用户
const userOptions = ref<OptionType[]>([]);
const getUserList = () => {
  UserAPI.getOptions().then((data) => {
    userOptions.value = data;
  });
};

/** 查询方法 */
const handleQuery = () => {
  startLoading();
  NoticeAPI.getPage(query.value)
    .then(async (res) => {
      tableData.value = res.list;
      total.value = res.total;
    })
    .finally(() => endLoading());
};

/** 搜索表单配置 */
const formConfig = ref<FormPro.FormItemConfig[]>([
  { name: "title", label: t("tableHeader.title") },
  {
    name: "publishStatus",
    label: t("tableHeader.status"),
    component: "select",
    props: {
      options: [
        { label: t("notice.status.unpublished"), value: 0 },
        { label: t("notice.status.published"), value: 1 },
        { label: t("notice.status.revoked"), value: -1 },
      ],
    },
  },
  {
    name: "publishTime",
    label: t("notice.publishTime"),
    span: 6,
    component: "date",
    props: {
      type: "daterange",
      closeOnSelect: true,
      onUpdateFormattedValue: (val: [string, string]) => (query.value.publishTime = val),
    },
  },
]);

// 获取发布状态标签
const getPublishStatusTag = (status?: number) => {
  if (!status?.toString())
    return (
      <NTag bordered={false} type="default">
        -
      </NTag>
    );

  const statusMap = {
    0: { type: "warning", label: t("notice.status.unpublished") },
    1: { type: "success", label: t("notice.status.published") },
    "-1": { type: "error", label: t("notice.status.revoked") },
  };

  const config = statusMap[status as keyof typeof statusMap] || { type: "default", label: "-" };

  return (
    <NTag bordered={false} type={config.type}>
      {config.label}
    </NTag>
  );
};

const columns = ref<DataTableColumns<Notice.VO>>([
  {
    type: "selection",
    options: ["all", "none"],
    disabled: ({ publishStatus }) => publishStatus === 1,
  },
  {
    title: t("tableHeader.no"),
    key: "id",
    align: "center",
    width: 80,
    render: (_, index) => index + 1,
  },
  {
    title: t("tableHeader.title"),
    key: "title",
    render: ({ title, type }) => (
      <NFlex align="center">
        <DictTag options={notice_type.value} value={type} />
        <NText>{title}</NText>
      </NFlex>
    ),
  },
  // {
  //   title: "通知类型",
  //   key: "type",
  //   align: "center",
  //   render: ({ type }) => <DictTag options={notice_type.value} value={type} />,
  // },
  { title: t("tableHeader.publishAuthor"), key: "publisherName", align: "center" },
  {
    title: t("tableHeader.noticeLevel"),
    key: "publisherName",
    align: "center",
    render: ({ level }) => <DictTag options={notice_level.value} value={level} />,
  },
  {
    title: t("tableHeader.noticeTarget"),
    key: "targetType",
    align: "center",
    render: ({ targetType }) => {
      if (targetType === 1) return <NTag type="warning">{t("notice.target.all")}</NTag>;
      if (targetType === 2) return <NTag type="success">{t("notice.target.users")}</NTag>;
    },
  },
  {
    title: t("tableHeader.status"),
    key: "publishStatus",
    align: "center",
    render: ({ publishStatus }) => getPublishStatusTag(publishStatus),
  },
  {
    title: t("tableHeader.operateTime"),
    key: "createTime",
    align: "center",
    render: ({ createTime, publishTime, revokeTime, publishStatus }) => {
      return (
        <NFlex vertical size={[0, 0]}>
          <NText>
            {t("notice.time.create")}：{createTime}
          </NText>
          {publishStatus === 1 && (
            <NText>
              {t("notice.time.publish")}：{publishTime}
            </NText>
          )}
          {publishStatus === -1 && (
            <NText>
              {t("notice.time.revoke")}：{revokeTime}
            </NText>
          )}
        </NFlex>
      );
    },
  },
  {
    title: t("tableHeader.action"),
    key: "action",
    align: "center",
    render: (row) => {
      return (
        <NFlex justify="center">
          <NButton text type="info" onClick={() => viewDetail(row.id)}>
            {t("button.view")}
          </NButton>
          {row.publishStatus !== 1 && (
            <NButton text type="primary" onClick={() => openDrawer(row)}>
              {t("button.edit")}
            </NButton>
          )}
          {row.publishStatus !== 1 && (
            <NButton text type="success" onClick={() => handlePublish(row.id)}>
              {t("notice.time.publish")}
            </NButton>
          )}
          {row.publishStatus === 1 && (
            <NButton text type="warning" onClick={() => handleRevoke(row.id)}>
              {t("notice.time.revoke")}
            </NButton>
          )}
          {row.publishStatus !== 1 && (
            <NButton text type="error" onClick={() => handleDelete(row.id)}>
              {t("button.delete")}
            </NButton>
          )}
        </NFlex>
      );
    },
  },
]);

// 编辑表单配置
const editFormConfig = computed(
  (): DialogForm.Form => ({
    config: [
      { name: "title", label: t("tableHeader.title"), span: 12 },
      {
        name: "type",
        label: t("notice.type"),
        component: "select",
        dict: "notice_type",
        span: 12,
      },
      {
        name: "level",
        label: t("tableHeader.noticeLevel"),
        component: "select",
        dict: "notice_level",
        span: 12,
      },
      {
        name: "targetType",
        label: t("tableHeader.noticeTarget"),
        component: "radio",
        span: 12,
        props: {
          options: [
            { label: t("notice.target.all"), value: 1 },
            { label: t("notice.target.users"), value: 2 },
          ],
        },
      },
      {
        name: "targetUserIds",
        label: t("notice.target.users"),
        component: "select",
        hidden: modelValue.value.targetType === 1,
        props: {
          options: userOptions.value,
          multiple: true,
        },
      },
      {
        name: "content",
        label: t("notice.content"),
        component: () => (
          <WangEditor
            modelValue={modelValue.value.content}
            onUpdate:modelValue={(val: string) => (modelValue.value.content = val)}
          />
        ),
      },
    ],
    props: {
      rules: {
        title: [{ required: true, message: t("input") + t("tableHeader.title"), trigger: "blur" }],
        type: [
          {
            required: true,
            type: "number",
            message: t("select") + t("notice.type"),
            trigger: "change",
          },
        ],
        targetUserIds: [
          {
            required: true,
            type: "array",
            message: t("select") + t("notice.target.users"),
            trigger: "change",
          },
        ],
        content: [
          {
            required: true,
            message: t("input") + t("notice.content"),
            trigger: "blur",
            validator: (_rule: FormItemRule, value: string) =>
              new Promise((resolve, reject) => {
                if (!value.replace(/<[^>]+>/g, "").trim()) {
                  reject(new Error(t("input") + t("notice.content")));
                } else {
                  resolve();
                }
              }),
          },
        ],
      },
    },
  })
);

const modelValue = ref<Notice.Form>({
  level: "L", // 默认优先级为低
  targetType: 1, // 默认目标类型为全体
});

const dialogFormRef = useTemplateRef("modalForm");
/** 新增、编辑 */
const openDrawer = (row?: Notice.VO) => {
  getUserList(); // 获取用户列表
  dialogFormRef.value?.open(row ? t("notice.edit") : t("notice.add"), modelValue.value);

  if (row) {
    startSpin();
    NoticeAPI.getFormData(row.id)
      .then((data) => {
        modelValue.value = { ...data };
      })
      .finally(() => endSpin());
  }
};

const submitForm = (val: Notice.Form) =>
  executeAsync(
    () => (val.id ? NoticeAPI.update(val.id, val) : NoticeAPI.create(val)),
    () => {
      dialogFormRef.value?.close();
      handleQuery();
    }
  );

// 查看详情
const modalViewRef = useTemplateRef("modalView");
const viewValue = ref<Notice.DetailVO>({});
const viewConfig = ref<FormPro.FormItemConfig[]>([
  { name: "title", label: t("tableHeader.title") + ": " },
  { name: "publishStatus", label: t("tableHeader.status") + ": ", span: 12 },
  {
    name: "publisherName",
    label: t("tableHeader.publishAuthor") + ": ",
    component: "text",
    span: 12,
  },
  { name: "publishTime", label: t("notice.publishTime") + ": ", component: "text", span: 12 },
  { name: "content", label: t("notice.content") + ": " },
]);

const viewDetail = async (id: string) => {
  startSpin();
  modalViewRef.value?.open(t("notice.info"), viewValue.value);
  try {
    viewValue.value = await NoticeAPI.getDetail(id);
  } finally {
    endSpin();
  }
};

// 发布通知
const handlePublish = (id: string) => {
  InquiryBox(t("notice.inquiry.publish")).then(() => {
    NoticeAPI.publish(id).then(() => {
      window.$message.success(t("notice.inquiry.publishSuccess"));
      handleQuery();
    });
  });
};

// 撤回通知
const handleRevoke = (id: string) => {
  InquiryBox(t("notice.inquiry.revoke")).then(() => {
    NoticeAPI.revoke(id).then(() => {
      window.$message.success(t("notice.inquiry.revokeSuccess"));
      handleQuery();
    });
  });
};

/** 选中行 */
const selectedRowKeys = ref<string[]>([]);
const handleCheck = (keys: DataTableRowKey[]) => (selectedRowKeys.value = keys as string[]);

// 删除通知
const handleDelete = (id?: string) => {
  const ids = id || selectedRowKeys.value.join(",");

  InquiryBox(t("confirm.deleteSelect")).then(() => {
    NoticeAPI.deleteByIds(ids).then(() => {
      window.$message.success(t("message.deleteSuccess"));
      handleQuery();
    });
  });
};
</script>
