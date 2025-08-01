<template>
  <div>
    <n-grid x-gap="10">
      <n-gi :span="4">
        <n-card h="[100%]">
          <n-flex vertical>
            <n-input
              v-model:value="pattern"
              :placeholder="t('common.input.select') + t('tableHeader.dept')"
              clearable
            >
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
          @reset="handleReset"
        >
          <template #controls>
            <n-button v-has-perm="['sys:user:add']" type="primary" @click="openDrawer()">
              <template #icon>
                <icon-park-outline-plus />
              </template>
              {{ t("button.add") }}
            </n-button>
            <n-button
              v-has-perm="['sys:user:delete']"
              type="error"
              :disabled="!selectedRowKeys.length"
              @click="handleDelete()"
            >
              <template #icon>
                <icon-park-outline-delete-themes />
              </template>
              {{ t("button.delete") }}
            </n-button>
            <n-button v-has-perm="'sys:user:import'" type="success" @click="handleImport">
              <template #icon><icon-park-outline-upload-one /></template>
              {{ t("button.import") }}
            </n-button>

            <n-button
              v-has-perm="['sys:user:export']"
              type="warning"
              :loading="exportLoading"
              @click="handleExport"
            >
              <template #icon>
                <icon-park-outline-download-one />
              </template>
              {{ t("button.export") }}
            </n-button>
          </template>
        </TablePro>
      </n-gi>
    </n-grid>

    <!-- 新增、编辑 -->
    <DrawerForm
      ref="drawerForm"
      v-model="modelValue"
      :form="editFormConfig"
      :loading="spin"
      @submit="submitForm"
    />

    <!-- 用户导入 -->
    <ImportUser ref="importUserRef" @success="handleQuery" />
  </div>
</template>
<script setup lang="tsx">
import {
  type DataTableColumns,
  type DataTableRowKey,
  NAvatar,
  NButton,
  NFlex,
  NImage,
  NText,
  NInput,
  NTag,
} from "naive-ui";

import { MIMETYPE } from "@/enums";
import { useCompRef, useDict, useLoading } from "@/hooks";
import {
  spin,
  startSpin,
  endSpin,
  exportFile,
  InquiryBox,
  executeAsync,
  statusOptions,
} from "@/utils";

import DeptAPI from "@/api/system/dept";
import UserAPI from "@/api/system/user";
import RoleAPI from "@/api/system/role";

import Icones from "@/components/common/Icones.vue";
import ImportUser from "./components/ImportUser.vue";
import DictTag from "@/components/custom/DictTag.vue";
import CommonStatus from "@/components/common/CommonStatus.vue";

defineOptions({ name: "User" });

const { t } = useI18n();

const { loading, startLoading, endLoading } = useLoading();
const { gender } = useDict("gender");

onMounted(async () => {
  getDeptTree(); // 获取部门树
  handleQuery(); // 查询数据
  roleOptions.value = await RoleAPI.getOptions();
});

const show = ref<boolean>(false); // 部门加载状态
const deptOptions = ref<OptionType[]>([]); // 部门下拉数据源
const pattern = ref<string>(""); // 搜索过滤

const roleOptions = ref<OptionType[]>([]); // 角色下拉数据源

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

/**
 * 搜索表单配置
 */
const formConfig = ref<FormPro.FormItemConfig[]>([
  {
    name: "keywords",
    label: t("tableHeader.keywords"),
    // "请输入用户名/昵称/手机号"
    props: {
      placeholder: `${t("common.input.input")}${t("tableHeader.username")}/${t("tableHeader.nickname")}/${t("tableHeader.phone")}`,
    },
    span: 5,
  },
  {
    name: "status",
    label: t("tableHeader.status"),
    component: "select",
    props: {
      options: statusOptions.value,
      // 自定义渲染标签
      renderTag: ({ option }) => (
        <NTag type={option.type} bordered={false}>
          {option.label}
        </NTag>
      ),
    },
  },
  {
    name: "createTime",
    label: t("tableHeader.createTime"),
    component: "date",
    span: 6,
    props: {
      type: "daterange",
      closeOnSelect: true,
      onUpdateFormattedValue: (val: [string, string]) => (queryParams.value.createTime = val),
    },
    slots: {
      confirm: ({ onConfirm }) => [
        h(
          NButton,
          { type: "primary", size: "small", onClick: () => onConfirm() },
          () => `${t("button.ok")}😎`
        ),
      ],
      clear: ({ onClear }) => [
        h(NButton, { size: "small", onClick: () => onClear() }, () => `${t("button.cancel")}🙄`),
      ],
    },
  },
]);

/** 表格配置 */
const columns = ref<DataTableColumns<User.VO>>([
  { type: "selection", options: ["all", "none"] },
  {
    key: "avatar",
    align: "center",
    render: ({ avatar, nickname, gender }) => {
      avatar = avatar || "xx.png"; // 防止空头像
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
  { title: t("tableHeader.username"), key: "username", align: "center" },
  { title: t("tableHeader.nickname"), key: "nickname", align: "center" },
  {
    title: t("tableHeader.sex"),
    key: "gender",
    align: "center",
    render: (row) => <DictTag options={gender.value} value={row.gender} />,
  },
  { title: t("tableHeader.dept"), key: "deptName", align: "center" },
  { title: t("tableHeader.phone"), key: "mobile", align: "center" },
  { title: t("tableHeader.email"), key: "email", align: "center" },
  {
    title: t("tableHeader.status"),
    key: "status",
    align: "center",
    render: ({ status }) => <CommonStatus value={status} />,
  },
  { title: t("tableHeader.createTime"), key: "createTime", align: "center" },
  {
    title: t("tableHeader.action"),
    key: "action",
    align: "center",
    render: (row) => (
      <NFlex justify="center">
        <NButton
          v-has-perm={["sys:user:edit"]}
          text
          type="info"
          v-slots={{ icon: () => <Icones icon="ant-design:edit-outlined" /> }}
          onClick={() => openDrawer(row)}
        >
          {t("button.edit")}
        </NButton>
        <NButton
          v-has-perm={["sys:user:reset-password"]}
          text
          type="warning"
          v-slots={{ icon: () => <Icones icon="ant-design:redo-outlined" /> }}
          onClick={() => handleResetPassword(row)}
        >
          {t("button.resetPassword")}
        </NButton>
        <NButton
          v-has-perm={["sys:user:delete"]}
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

/** 抽屉表单Props */
const editFormConfig = computed(
  (): DialogForm.Form => ({
    // 表单项配置
    config: [
      { name: "username", label: t("tableHeader.username") },
      { name: "nickname", label: t("tableHeader.nickname") },
      {
        name: "deptId",
        label: t("tableHeader.dept"),
        component: "treeSelect",
        props: {
          options: deptOptions.value,
          keyField: "value",
          labelField: "label",
          indent: 12,
        },
      },
      { name: "gender", label: t("tableHeader.sex"), component: "select", dict: "gender" },
      {
        name: "roleIds",
        label: t("tableHeader.role"),
        component: "select",
        props: { multiple: true, options: roleOptions.value },
      },
      { name: "mobile", label: t("tableHeader.phone") },
      { name: "email", label: t("tableHeader.email") },
      {
        name: "status",
        label: t("tableHeader.status"),
        component: "radio",
        props: { options: statusOptions.value },
      },
    ],
    // NForm属性
    props: {
      rules: {
        username: [
          {
            required: true,
            message: t("common.input.input") + t("tableHeader.username"),
            trigger: "blur",
          },
        ],
        nickname: [
          {
            required: true,
            message: t("common.input.input") + t("tableHeader.nickname"),
            trigger: "blur",
          },
        ],
        deptId: [
          {
            required: true,
            message: t("common.input.select") + t("tableHeader.dept"),
            trigger: "change",
          },
        ],
        roleIds: [
          {
            required: true,
            type: "array",
            message: t("common.input.select") + t("tableHeader.role"),
            trigger: "change",
          },
        ],
        email: [
          {
            pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
            message: t("rules.email"),
            trigger: "blur",
          },
        ],
        mobile: [
          {
            pattern: /^1[3-9]\d{9}$/,
            message: t("rules.phone"),
            trigger: "blur",
          },
        ],
      },
    },
  })
);

/** 初始化表单 */
const modelValue = ref<User.Form>({
  status: 1,
});
/** 新增、编辑 */
const drawerFormRef = useTemplateRef("drawerForm");
const openDrawer = (row?: User.VO) => {
  drawerFormRef.value?.open(row ? t("user.edit") : t("user.add"), modelValue.value);

  if (row) {
    startSpin();
    UserAPI.getFormData(row.id)
      .then((data) => {
        modelValue.value = { ...data };
      })
      .finally(() => endSpin());
  }
};
/** 表单提交 */
const submitForm = (val: User.Form) =>
  executeAsync(
    () => (val.id ? UserAPI.update(val.id, val) : UserAPI.create(val)),
    () => {
      drawerFormRef.value?.close();
      handleQuery();
    }
  );

// 重置密码
const newPassword = ref<{
  pwd: string;
  status: "success" | "warning" | "error";
  msg: string;
}>({
  pwd: "",
  status: "success",
  msg: "",
});
const handleResetPassword = (row: User.VO) => {
  window.$dialog.warning({
    title: t("common.sysTip"),
    positiveText: t("button.ok"),
    negativeText: t("button.cancel"),
    positiveButtonProps: {
      renderIcon: () => h(Icones, { icon: "ant-design:check-outlined", size: 16 }),
    },
    negativeButtonProps: {
      renderIcon: () => h(Icones, { icon: "ant-design:close-outlined", size: 16 }),
    },
    content: () => (
      <NFlex vertical>
        <NText>{t("user.enterNewPassword", { name: row.username })}</NText>
        <NInput
          v-model:value={newPassword.value.pwd}
          type={"password"}
          show-password-on={"mousedown"}
          placeholder={t("common.input.input")}
          status={newPassword.value.status}
        />
        {newPassword.value.status !== "success" && (
          <NText type={newPassword.value.status}>{newPassword.value.msg}</NText>
        )}
      </NFlex>
    ),
    onPositiveClick: () => {
      return new Promise<void>((resolve) => {
        // 校验密码
        const { pwd } = newPassword.value;

        if (pwd.length < 6 || pwd.length > 20) {
          newPassword.value.status = "warning";
          newPassword.value.msg = t("rules.passwordLength");
        } else if (/[<>"'|\\]/.test(pwd)) {
          newPassword.value.status = "error";
          newPassword.value.msg = t("rules.illegalChar");
        } else {
          newPassword.value.status = "success";
          newPassword.value.msg = "";
          const { pwd } = newPassword.value;

          UserAPI.resetPassword(row.id, pwd)
            .then(() => window.$message.success(t("user.rememberNewPassword", { value: pwd })))
            .then(() => resolve());
        }
      });
    },
    onAfterLeave: () => {
      newPassword.value = {
        pwd: "",
        status: "success",
        msg: "",
      };
    },
  });
};

/** 选中行 */
const selectedRowKeys = ref<string[]>([]);
const handleCheck = (keys: DataTableRowKey[]) => (selectedRowKeys.value = keys as string[]);
/**
 * 删除用户
 *
 * @param id  用户ID
 */
const handleDelete = (id?: string) => {
  const userIds = [id || selectedRowKeys.value].join(",");

  InquiryBox(t("confirm.delete", { name: t("user.selectedUser") })).then(() => {
    UserAPI.deleteByIds(userIds).then(() => {
      window.$message.success(t("message.deleteSuccess"));
      handleQuery();
    });
  });
};

// 导入
const importUserRef = useCompRef(ImportUser);
const handleImport = () => {
  importUserRef.value?.open();
};

// 导出
const exportLoading = ref(false);
const handleExport = () => {
  exportLoading.value = true;
  UserAPI.export(queryParams.value)
    .then((response) => {
      window.$message.loading(t("common.downloading"));
      const fileName = decodeURI(
        response.headers["content-disposition"].split(";")[1].split("=")[1]
      );

      exportFile(response.data, MIMETYPE.xlsx, fileName);
    })
    .finally(() => (exportLoading.value = false));
};

/** 重置 */
const handleReset = () => {
  queryParams.value.deptId = undefined;
  handleQuery();
};
</script>
