<template>
  <div p-2>
    <TablePro v-model="model" :form-config="formConfig" @reset="reset" @query="query">
      <template #before>
        <n-button>前置按钮</n-button>
      </template>
      <template #controls>
        <n-button type="primary" @click="openForm('drawer')">
          <template #icon>
            <icon-park-outline-plus />
          </template>
          新增(抽屉)
        </n-button>
        <n-button type="primary" @click="openForm('modal')">
          <template #icon>
            <icon-park-outline-plus />
          </template>
          新增(对话框)
        </n-button>
      </template>
    </TablePro>

    <DrawerForm
      ref="drawerForm"
      v-model="editModel"
      :form="{
        config: editConfig,
        props: { rules, labelWidth: 100 },
      }"
      :loading="spin"
      @submit="handleSubmit"
    />
    <ModalForm
      ref="modalForm"
      v-model="editModel"
      :form="{
        config: editConfig,
        props: { rules },
      }"
      :loading="spin"
      @submit="handleSubmit"
    />
  </div>
</template>
<script lang="tsx" setup>
import { FormItemRule, FormRules, NButton, NEl, SelectOption } from "naive-ui";

// 定义表单数据模型
interface DemoFormModel {
  name?: string;
  age?: number;
  sex?: number;
  hobbies?: string[];
  notification?: number;
  birthday?: number;
  password?: string;
  aihao?: string;
  remark?: string;
}

const editConfig = computed((): FormPro.FormItemConfig[] =>
  formConfig.value.map((item) => {
    return {
      ...item,
      span: 24,
    };
  })
);
const editModel = ref<DemoFormModel>({});

/** 新增、编辑 */
const drawerFormRef = useTemplateRef("drawerForm");
const modalFormRef = useTemplateRef("modalForm");
const spin = ref(false);

const openForm = (type: "drawer" | "modal") => {
  spin.value = true;
  type === "drawer"
    ? drawerFormRef.value?.open("新增用户", editModel.value)
    : modalFormRef.value?.open("新增用户", editModel.value);
  setTimeout(() => {
    spin.value = false;
    editModel.value = {
      age: 18,
      birthday: 1753545600000,
      name: "23",
      hobbies: ["1", "3"],
      notification: 1,
      password: "435356436",
      remark: "43643645745746",
      sex: 2,
    };
  }, 2000);
};

const handleSubmit = async (v: DemoFormModel) => {
  console.log(v);
};

onMounted(async () => {
  option.value = await asyncData();
});

const loading = ref(false);

// 异步数据
const asyncData = () => {
  loading.value = true;

  return new Promise<SelectOption[]>((r) =>
    setTimeout(() => {
      r([
        { label: "男", value: 1 },
        { label: "女", value: 2 },
        { label: "未知", value: 3 },
      ]);
      loading.value = false;
    }, 3000)
  );
};

const formConfig = computed((): FormPro.FormItemConfig[] => [
  {
    name: "name",
    label: "姓名",
    props: { placeholder: "请你输入你的姓名" },
    labelMessage: "或许不想知道你的花园长得咋样",
    formItemProps: {
      // labelWidth: 200,
    },
    slots: {
      prefix: () => [h("div", {}, "🎈")],
      // suffix: () => [h("div", null, "后缀")],
    },
  },
  {
    name: "age",
    label: "年龄",
    component: "number",
    span: 3,
    labelMessage: "I wish they all could be California girls",
  },
  {
    name: "sex",
    label: "性别",
    span: 3,
    component: "select",
    props: {
      options: option.value,
      loading: loading.value,
    },
    slots: {
      header: () => [h("div", null, "不知道放些什么")],
      action: () => [h("div", null, "如果你点开了这个例子，你可能需要它")],
    },
  },
  {
    name: "sex",
    label: "性别选择",
    component: "radio",
    props: { options: option.value },
  },
  {
    name: "password",
    label: "密码",
    component: "password",
    props: { placeholder: "请输入密码" },
  },
  {
    name: "hobbies",
    label: "兴趣爱好",
    component: "select",
    hidden: model.value.sex === 2,
    props: {
      multiple: true,
      maxTagCount: "responsive",
    },
    dict: "notice_type",
  },
  {
    name: "notification",
    label: "接收通知",
    component: "switch",
    span: 2,
    props: {
      checkedValue: 1,
      uncheckedValue: -1,
    },
    slots: {
      icon: () => [h(NEl, {}, () => "😄")],
    },
  },
  {
    name: "birthday",
    label: "生日",
    component: "date",
    props: { type: "date" },
    span: 3,
    slots: {
      confirm: ({ onConfirm }) => [
        h(NButton, { type: "primary", size: "small", onClick: () => onConfirm() }, () => "确定😎"),
      ],
      clear: ({ onClear }) => [
        h(NButton, { size: "small", onClick: () => onClear() }, () => "取消🙄"),
      ],
      now: ({ onNow }) => [
        h(NButton, { type: "primary", size: "small", onClick: () => onNow() }, () => "就现在😁"),
      ],
    },
  },
  {
    name: "aihao",
    label: "爱好",
    span: 3,
    // component: () => h(NEl, {}, () => "哈哈哈哈哈哈哈哈"),
    component: () => <NEl>哈哈哈哈哈哈哈哈 😁</NEl>,
  },
  { label: "备注", name: "remark", component: "input" },
]);

// 初始化表单数据
const model = ref<DemoFormModel>({
  notification: 1,
});

// 表单验证规则
const rules: FormRules = {
  name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  age: [{ required: true, type: "number", message: "请输入年龄", trigger: "blur" }],
  notification: [
    {
      validator: (_: FormItemRule, value: number) => value === 1,
      trigger: "change",
      message: "请打开接收通知",
    },
  ],
  birthday: [
    {
      type: "date",
      required: true,
      message: "请选择日期",
      trigger: "change",
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "密码长度不能小于6位", trigger: "blur" },
  ],
};

const option = ref<SelectOption[]>([{ label: "男", value: 1 }]);

const query = (val: DemoFormModel) => {
  console.log(val);
};

const reset = (val: DemoFormModel) => {
  console.log(model.value, "传递的值", val);
};
</script>
