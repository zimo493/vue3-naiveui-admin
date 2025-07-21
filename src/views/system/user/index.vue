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
              新增
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
              删除
            </n-button>
            <n-button v-has-perm="'sys:user:import'" type="success" @click="handleImport">
              <template #icon><icon-park-outline-upload-one /></template>
              导入
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
              导出
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
  NSpace,
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
    label: "关键字",
    props: { placeholder: "请输入用户名/昵称/手机号" },
    span: 5,
  },
  {
    name: "status",
    label: "状态",
    component: "select",
    props: {
      options: statusOptions,
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
    label: "创建时间",
    component: "date",
    span: 6,
    props: {
      type: "daterange",
      closeOnSelect: true,
      onUpdateFormattedValue: (val: [string, string]) => (queryParams.value.createTime = val),
    },
    slots: {
      confirm: ({ onConfirm }) => [
        h(NButton, { type: "primary", size: "small", onClick: () => onConfirm() }, () => "确定😎"),
      ],
      clear: ({ onClear }) => [
        h(NButton, { size: "small", onClick: () => onClear() }, () => "取消🙄"),
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
          type="info"
          v-slots={{ icon: () => <Icones icon="ant-design:edit-outlined" /> }}
          onClick={() => openDrawer(row)}
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
          onClick={() => handleDelete(row.id)}
        >
          删除
        </NButton>
      </NSpace>
    ),
  },
]);

/** 抽屉表单Props */
const editFormConfig = computed(
  (): DialogForm.Form => ({
    // 表单项配置
    config: [
      { name: "username", label: "用户名" },
      { name: "nickname", label: "用户昵称" },
      {
        name: "deptId",
        label: "所属部门",
        component: "treeSelect",
        props: {
          options: deptOptions.value,
          keyField: "value",
          labelField: "label",
          indent: 12,
        },
      },
      { name: "gender", label: "性别", component: "select", dict: "gender" },
      {
        name: "roleIds",
        label: "角色",
        component: "select",
        props: { multiple: true, options: roleOptions.value },
      },
      { name: "mobile", label: "手机号码" },
      { name: "email", label: "邮箱" },
      {
        name: "status",
        label: "状态",
        component: "radio",
        props: { options: statusOptions },
      },
    ],
    // NForm属性
    props: {
      rules: {
        username: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
        nickname: [{ required: true, message: "用户昵称不能为空", trigger: "blur" }],
        deptId: [{ required: true, message: "所属部门不能为空", trigger: "change" }],
        roleIds: [
          { required: true, type: "array", message: "用户角色不能为空", trigger: "change" },
        ],
        email: [
          {
            pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
            message: "请输入正确的邮箱地址",
            trigger: "blur",
          },
        ],
        mobile: [
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入正确的手机号码",
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
  drawerFormRef.value?.open(row ? "编辑用户" : "新增用户", modelValue.value);

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
    title: "系统提示",
    positiveText: "确定",
    negativeText: "取消",
    maskClosable: false,
    content: () => (
      <NSpace vertical>
        <NText>请输入 "{row.username}" 的新密码</NText>
        <NInput
          v-model:value={newPassword.value.pwd}
          type={"password"}
          show-password-on={"mousedown"}
          placeholder="请输入密码"
          status={newPassword.value.status}
        />
        {newPassword.value.status !== "success" && (
          <NText type={newPassword.value.status}>{newPassword.value.msg}</NText>
        )}
      </NSpace>
    ),
    onPositiveClick: () => {
      return new Promise<void>((resolve) => {
        // 校验密码
        const { pwd } = newPassword.value;

        if (pwd.length < 6 || pwd.length > 20) {
          newPassword.value.status = "warning";
          newPassword.value.msg = "密码长度必须介于 6 和 20 之间";
        } else if (/[<>"'|\\]/.test(pwd)) {
          newPassword.value.status = "error";
          newPassword.value.msg = "不能包含非法字符";
        } else {
          newPassword.value.status = "success";
          newPassword.value.msg = "";
          const { pwd } = newPassword.value;

          UserAPI.resetPassword(row.id, pwd)
            .then(() => window.$message.success("密码重置成功，请牢记新密码：" + pwd))
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

  InquiryBox(`确定要删除选中的用户吗？`).then(() => {
    UserAPI.deleteByIds(userIds).then(() => {
      window.$message.success("删除成功");
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
      window.$message.loading("正在下载数据，请稍候...");
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
