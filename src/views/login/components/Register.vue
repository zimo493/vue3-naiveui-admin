<template>
  <div>
    <n-h2 depth="3" class="text-center">注 册</n-h2>
    <n-form ref="form" :rules="rules" :model="model" :show-label="false" size="large">
      <n-form-item path="username">
        <n-input v-model:value="model.username" clearable placeholder="请输入用户名">
          <template #prefix>
            <Icones icon="ant-design:user-outlined" />
          </template>
        </n-input>
      </n-form-item>
      <n-form-item path="password">
        <n-input
          v-model:value="model.password"
          type="password"
          placeholder="请输入密码"
          clearable
          show-password-on="click"
        >
          <template #password-invisible-icon>
            <icon-park-outline-preview-close-one />
          </template>
          <template #password-visible-icon>
            <icon-park-outline-preview-open />
          </template>
          <template #prefix>
            <Icones icon="ant-design:lock-outlined" />
          </template>
        </n-input>
      </n-form-item>
      <n-form-item path="confirmPassword">
        <n-input
          v-model:value="model.confirmPassword"
          type="password"
          placeholder="请再次输入密码"
          clearable
          show-password-on="click"
        >
          <template #password-invisible-icon>
            <icon-park-outline-preview-close-one />
          </template>
          <template #password-visible-icon>
            <icon-park-outline-preview-open />
          </template>
          <template #prefix>
            <Icones icon="ant-design:lock-outlined" />
          </template>
        </n-input>
      </n-form-item>
      <n-form-item v-if="enabled" path="captchaCode">
        <n-input
          ref="captcha"
          v-model:value="model.captchaCode"
          clearable
          placeholder="请输入验证码"
          @keyup.enter="handleRegister"
        >
          <template #prefix>
            <Icones icon="ant-design:verified-outlined" />
          </template>
        </n-input>
        <n-spin size="small" :show="captchaLoading">
          <n-el cursor-pointer h="[40px]" ml="[10px]" w="[120px]" @click="getCaptcha">
            <img
              shadow="[var(--box-shadow-1)]"
              w="[100%]"
              object-cover
              border-rd-3px
              :src="captchaBase64"
              alt="captchaCode"
            />
          </n-el>
        </n-spin>
      </n-form-item>
      <n-form-item>
        <n-space vertical :size="20" class="w-full">
          <div>
            <n-checkbox v-model:checked="isRead">我已同意并阅读</n-checkbox>
            <n-button type="primary" text>用户协议</n-button>
          </div>
          <n-button
            block
            type="primary"
            :loading="isLoading"
            :disabled="isLoading"
            @click="handleRegister"
          >
            注 册
          </n-button>
          <n-flex justify="center">
            <n-text>已有账号？</n-text>
            <n-button text type="primary" @click="toLogin">登录</n-button>
          </n-flex>
        </n-space>
      </n-form-item>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import type { FormInst, FormItemRule, FormRules } from "naive-ui";
import AuthAPI from "@/api/auth";

onMounted(() => getCaptcha());

const emit = defineEmits(["update:modelValue"]);

const toLogin = () => {
  emit("update:modelValue", "login");
};

const validatePassword = (rule: FormItemRule, value: string): boolean =>
  !!model.value.password &&
  model.value.password.startsWith(value) &&
  model.value.password.length >= value.length &&
  value === model.value.password;

const rules: FormRules = {
  username: [{ required: true, trigger: "blur", message: "用户名不能为空" }],
  password: [
    { required: true, trigger: "blur", message: "密码不能为空" },
    {
      min: 5,
      max: 20,
      message: "密码长度在5到20个字符之间",
      trigger: "blur",
    },
    {
      pattern: /^[^<>"'|\\]+$/,
      message: "密码不能包含特殊字符",
      trigger: "blur",
    },
  ],
  confirmPassword: [
    {
      required: true,
      validator: validatePassword,
      message: "两次密码输入不一致",
      trigger: ["blur", "password-input"],
    },
  ],
  captchaCode: [{ required: true, trigger: "blur", message: "验证码不能为空" }],
};

interface Model extends Auth.LoginFormData {
  confirmPassword: string;
}

const model = ref<Model>({
  username: "admin",
  password: "123456",
  confirmPassword: "",
  captchaKey: "",
  captchaCode: "",
  rememberMe: false,
});

const isRead = ref(false);

const enabled = ref<boolean>(true); // 验证码开关

const captchaBase64 = ref<string>(""); // 验证码图片Base64字符串

const captchaLoading = ref<boolean>(false); // 验证码加载中

const getCaptcha = () => {
  captchaLoading.value = true;
  AuthAPI.getCaptcha()
    .then((data) => {
      model.value.captchaKey = data.captchaKey;
      captchaBase64.value = data.captchaBase64;
    })
    .finally(() => (captchaLoading.value = false));
};

const formRef = useTemplateRef<FormInst>("form");

const isLoading = ref<boolean>(false);

const handleRegister = async () => {
  await formRef.value?.validate();
  if (!isRead.value) {
    return window.$message.error("请先阅读并同意用户协议");
  }

  window.$message.warning("暂未实现，开发中 ...");
};
</script>
