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
          新增
        </n-button>
        <n-button type="error" :disabled="!selectedRowKeys.length" @click="handleDelete()">
          <template #icon>
            <icon-park-outline-delete-themes />
          </template>
          删除
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
          placeholder="请选择用户"
        />
      </template>
      <template #content>
        <WangEditor v-model="modelValue.content" />
      </template>
    </ModalForm>

    <!-- 详情 -->
    <!-- <DialogForm ref="dialogView" :form-config="viewConfig" :model-value="viewValue" :is-look="true">
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
        <div v-html="viewValue.content" />
      </template>
    </DialogForm> -->
  </div>
</template>

<script lang="tsx" setup>
import {
  type DataTableColumns,
  type DataTableRowKey,
  FormItemRule,
  NButton,
  NSpace,
  NTag,
  NText,
} from "naive-ui";

import { spin, executeAsync, InquiryBox, startSpin, endSpin } from "@/utils";
import { useDict, useLoading } from "@/hooks";

import NoticeAPI from "@/api/system/notice";
import UserAPI from "@/api/system/user";

import DictTag from "@/components/custom/DictTag.vue";
import WangEditor from "@/components/custom/WangEditor.vue";

defineOptions({
  name: "NoticeList",
  inheritAttrs: false,
});

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
  { name: "title", label: "标题" },
  {
    name: "publishStatus",
    label: "发布状态",
    component: "select",
    props: {
      options: [
        { label: "未发布", value: 0 },
        { label: "已发布", value: 1 },
        { label: "已撤回", value: -1 },
      ],
    },
  },
]);

// 获取发布状态标签
const getPublishStatusTag = (status?: number) => {
  if (!status?.toString())
    return (
      <NTag bordered={false} type="default">
        未知
      </NTag>
    );

  const statusMap = {
    0: { type: "warning", label: "未发布" },
    1: { type: "success", label: "已发布" },
    "-1": { type: "error", label: "已撤回" },
  };

  const config = statusMap[status as keyof typeof statusMap] || { type: "default", label: "未知" };

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
    title: "序号",
    key: "id",
    align: "center",
    width: 80,
    render: (_, index) => index + 1,
  },
  {
    title: "通知标题",
    key: "title",
    render: ({ title, type }) => (
      <NSpace align="center">
        <DictTag options={notice_type.value} value={type} />
        <NText>{title}</NText>
      </NSpace>
    ),
  },
  // {
  //   title: "通知类型",
  //   key: "type",
  //   align: "center",
  //   render: ({ type }) => <DictTag options={notice_type.value} value={type} />,
  // },
  { title: "发布人", key: "publisherName", align: "center" },
  {
    title: "通知等级",
    key: "publisherName",
    align: "center",
    render: ({ level }) => <DictTag options={notice_level.value} value={level} />,
  },
  {
    title: "通告目标类型",
    key: "targetType",
    align: "center",
    render: ({ targetType }) => {
      if (targetType === 1) return <NTag type="warning">全部</NTag>;
      if (targetType === 2) return <NTag type="success">指定用户</NTag>;
    },
  },
  {
    title: "发布状态",
    key: "publishStatus",
    align: "center",
    render: ({ publishStatus }) => getPublishStatusTag(publishStatus),
  },
  {
    title: "操作时间",
    key: "createTime",
    align: "center",
    render: ({ createTime, publishTime, revokeTime, publishStatus }) => {
      return (
        <NSpace vertical size={[0, 0]}>
          <NText>创建：{createTime}</NText>
          {publishStatus === 1 && <NText>发布：{publishTime}</NText>}
          {publishStatus === -1 && <NText>撤回：{revokeTime}</NText>}
        </NSpace>
      );
    },
  },
  {
    title: "操作",
    key: "action",
    align: "center",
    render: (row) => {
      return (
        <NSpace justify="center">
          <NButton text type="info" onClick={() => viewDetail(row.id)}>
            查看
          </NButton>
          {row.publishStatus !== 1 && (
            <NButton text type="primary" onClick={() => openDrawer(row)}>
              编辑
            </NButton>
          )}
          {row.publishStatus !== 1 && (
            <NButton text type="success" onClick={() => handlePublish(row.id)}>
              发布
            </NButton>
          )}
          {row.publishStatus === 1 && (
            <NButton text type="warning" onClick={() => handleRevoke(row.id)}>
              撤回
            </NButton>
          )}
          {row.publishStatus !== 1 && (
            <NButton text type="error" onClick={() => handleDelete(row.id)}>
              删除
            </NButton>
          )}
        </NSpace>
      );
    },
  },
]);

// 编辑表单配置
const editFormConfig = computed(
  (): DialogForm.Form => ({
    config: [
      { name: "title", label: "标题", span: 12 },
      {
        name: "type",
        label: "通知类型",
        component: "select",
        dict: "notice_type",
        span: 12,
      },
      {
        name: "level",
        label: "通知等级",
        component: "select",
        dict: "notice_level",
        span: 12,
      },
      {
        name: "targetType",
        label: "目标类型",
        component: "radio",
        span: 12,
        props: {
          options: [
            { label: "全体", value: 1 },
            { label: "指定用户", value: 2 },
          ],
        },
      },
      {
        name: "targetUserIds",
        label: "指定用户",
        component: "select",
        hidden: modelValue.value.targetType === 1,
        props: {
          options: userOptions.value,
          multiple: true,
        },
      },
      {
        name: "content",
        label: "通知内容",
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
        title: [{ required: true, message: "请输入通知标题", trigger: "blur" }],
        type: [{ required: true, type: "number", message: "请选择通知类型", trigger: "change" }],
        targetUserIds: [
          { required: true, type: "array", message: "请选择指定用户", trigger: "change" },
        ],
        content: [
          {
            required: true,
            message: "请输入通知内容",
            trigger: "blur",
            validator: (_rule: FormItemRule, value: string) =>
              new Promise((resolve, reject) => {
                if (!value.replace(/<[^>]+>/g, "").trim()) {
                  reject(new Error("请输入通知内容"));
                } else {
                  resolve();
                }
              }),
          },
        ],
      },
    },
    // gridProps: { xGap: 30, yGap: 30 },
  })
);

// const editConfig = computed<TablePro.FormOption<Notice.Form>>(() => {
//   const config: TablePro.FormOption<Notice.Form> = {
//     fields: [
//       { field: "title", label: "标题", colSpan: 12 },
//       {
//         field: "type",
//         label: "通知类型",
//         type: "select",
//         dict: "notice_type",
//         colSpan: 12,
//       },
//       {
//         field: "level",
//         label: "通知等级",
//         type: "select",
//         dict: "notice_level",
//         colSpan: 12,
//       },
//       {
//         field: "targetType",
//         label: "目标类型",
//         type: "radio",
//         options: [
//           { label: "全体", value: 1 },
//           { label: "指定用户", value: 2 },
//         ],
//         colSpan: 12,
//       },
//       { field: "targetUserIds", label: "指定用户", isHidden: true, slotName: "targetUserIds" },
//       { field: "content", label: "通知内容", slotName: "content" },
//     ],
//     labelWidth: 80,
//     gutter: 30,
//     rules: {
//       title: [{ required: true, message: "请输入通知标题", trigger: "blur" }],
//       type: [{ required: true, type: "number", message: "请选择通知类型", trigger: "change" }],
//       targetUserIds: [
//         { required: true, type: "array", message: "请选择指定用户", trigger: "change" },
//       ],
//       content: [
//         {
//           required: true,
//           message: "请输入通知内容",
//           trigger: "blur",
//           validator: (_rule: FormItemRule, value: string) =>
//             new Promise((resolve, reject) => {
//               if (!value.replace(/<[^>]+>/g, "").trim()) {
//                 reject(new Error("请输入通知内容"));
//               } else {
//                 resolve();
//               }
//             }),
//         },
//       ],
//     },
//   };

//   config.fields.find((item) => {
//     if (item.field === "targetUserIds") {
//       item.isHidden = modelValue.value.targetType === 1;
//     }
//   });

//   return config;
// });

const modelValue = ref<Notice.Form>({
  level: "L", // 默认优先级为低
  targetType: 1, // 默认目标类型为全体
});

const dialogFormRef = useTemplateRef("modalForm");
/** 新增、编辑 */
const openDrawer = (row?: Notice.VO) => {
  getUserList(); // 获取用户列表
  dialogFormRef.value?.open(row ? "编辑公告" : "新增公告", modelValue.value);

  if (row) {
    startSpin();
    NoticeAPI.getFormData(row.id)
      .then((data) => {
        modelValue.value = { ...data };
      })
      .finally(() => endSpin());
  }
};

const submitForm = async (val: Notice.Form) =>
  executeAsync(
    () => (val.id ? NoticeAPI.update(val.id, val) : NoticeAPI.create(val)),
    () => {
      dialogFormRef.value?.close();
      handleQuery();
    }
  );

// 查看详情
// const dialogViewRef = useTemplateRef("dialogView");
// const viewValue = ref<Notice.DetailVO>({});
// const viewConfig = ref<TablePro.FormOption<Notice.DetailVO>>({
//   fields: [
//     { field: "title", label: "公告标题：", slotName: "title" },
//     { field: "publishStatus", label: "发布状态：", colSpan: 12, slotName: "publishStatus" },
//     { field: "publisherName", label: "发布人：", type: "text", colSpan: 12 },
//     { field: "publishTime", label: "发布时间：", type: "text", colSpan: 12 },
//     { field: "content", label: "公告内容：", slotName: "content" },
//   ],
// });

const viewDetail = async (id: string) => {
  console.log(id, "开发中...");

  // dialogViewRef.value?.startLoading();
  // dialogViewRef.value?.open(`通知公告详情`, viewValue.value);
  // try {
  //   viewValue.value = await NoticeAPI.getDetail(id);
  // } finally {
  //   dialogViewRef.value?.hideLoading();
  // }
};

// 发布通知
const handlePublish = (id: string) => {
  InquiryBox("确认发布该通知?").then(() => {
    NoticeAPI.publish(id).then(() => {
      window.$message.success("发布成功");
      handleQuery();
    });
  });
};

// 撤回通知
const handleRevoke = (id: string) => {
  InquiryBox("确认撤回该通知?").then(() => {
    NoticeAPI.revoke(id).then(() => {
      window.$message.success("撤回成功");
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

  InquiryBox("确认删除已选中的数据项?").then(() => {
    NoticeAPI.deleteByIds(ids).then(() => {
      window.$message.success("删除成功");
      handleQuery();
    });
  });
};
</script>
