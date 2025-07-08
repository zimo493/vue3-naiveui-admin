<template>
  <div p-2>
    <TablePro v-model="model" :form-config="formConfig" @reset="reset" @query="query">
      <template #before>
        <n-button>前置按钮</n-button>
      </template>
    </TablePro>
  </div>
</template>
<script lang="tsx" setup>
import { NButton, NEl, SelectOption } from "naive-ui";

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
    component: "radio-group",
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
    dict: "hobby",
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
    component: "date-picker",
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
// const rules: FormRules = {
//   name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
//   age: [{ required: true, type: "number", message: "请输入年龄", trigger: "blur" }],
//   notification: [
//     {
//       validator: (_: FormItemRule, value: number) => value === 1,
//       trigger: "change",
//       message: "请打开接收通知",
//     },
//   ],
//   birthday: [
//     {
//       type: "date",
//       required: true,
//       message: "请选择日期",
//       trigger: "change",
//     },
//   ],
//   password: [
//     { required: true, message: "请输入密码", trigger: "blur" },
//     { min: 6, message: "密码长度不能小于6位", trigger: "blur" },
//   ],
// };

const option = ref<SelectOption[]>([{ label: "男", value: 1 }]);

const query = async (val: DemoFormModel) => {
  console.log(model.value, val);
};

const reset = (val: DemoFormModel) => {
  console.log(model.value, "传递的值", val);
};
</script>
