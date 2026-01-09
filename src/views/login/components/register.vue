<template>
  <div>
    <n-h3 mt-0 depth="3" text-center>{{ t("register.register") }}</n-h3>
    <n-form ref="form" :rules="rules" :model="model" :show-label="false" size="large">
      <n-form-item path="username">
        <n-input
          v-model:value="model.username"
          clearable
          :placeholder="t('input') + t('login.username')"
        >
          <template #prefix>
            <Icones icon="ant-design:user-outlined" />
          </template>
        </n-input>
      </n-form-item>
      <n-form-item path="password">
        <n-input
          v-model:value="model.password"
          type="password"
          :placeholder="t('input') + t('login.password')"
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
          :placeholder="t('input') + t('login.password')"
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
          :placeholder="t('input') + t('login.captcha')"
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
        <n-flex vertical :size="20" class="w-full">
          <div>
            <n-checkbox v-model:checked="isRead">{{ t("register.readAndAgree") }}</n-checkbox>
            <n-button type="primary" text>{{ t("register.userAgreement") }}</n-button>
          </div>
          <n-button
            block
            type="primary"
            :loading="isLoading"
            :disabled="isLoading"
            @click="handleRegister"
          >
            {{ t("register.register") }}
          </n-button>
          <n-flex justify="center">
            <n-text>{{ t("register.haveAccount") }}</n-text>
            <n-button text type="primary" @click="toLogin">{{ t("login.login") }}</n-button>
          </n-flex>
        </n-flex>
      </n-form-item>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import type { FormInst, FormItemRule, FormRules } from "naive-ui";
import AuthAPI from "@/api/auth";
import { useI18n } from "vue-i18n";

const t = useI18n().t;

onMounted(() => getCaptcha());

const emit = defineEmits(["update:modelValue"]);

const toLogin = () => {
  emit("update:modelValue", "login");
};

const validatePassword = (_rule: FormItemRule, value: string): boolean =>
  !!model.value.password &&
  model.value.password.startsWith(value) &&
  model.value.password.length >= value.length &&
  value === model.value.password;

const rules: FormRules = {
  username: [{ required: true, trigger: "blur", message: t("input") + t("login.username") }],
  password: [
    { required: true, trigger: "blur", message: t("input") + t("login.password") },
    {
      min: 5,
      max: 20,
      message: t("rules.passwordLength"),
      trigger: "blur",
    },
    {
      pattern: /^[^<>"'|\\]+$/,
      message: t("register.noSpecialChars"),
      trigger: "blur",
    },
  ],
  confirmPassword: [
    {
      required: true,
      validator: validatePassword,
      message: t("register.passwordNotMatch"),
      trigger: ["blur", "password-input"],
    },
  ],
  captchaCode: [{ required: true, trigger: "blur", message: t("input") + t("login.captcha") }],
};

interface Model extends Auth.LoginFormData {
  confirmPassword: string;
}

const model = ref<Model>({
  username: "admin",
  password: "123456",
  confirmPassword: "",
  captchaId: "",
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
      model.value.captchaId = data.captchaId;
      captchaBase64.value = data.captchaBase64;
    })
    .finally(() => (captchaLoading.value = false));
};

const formRef = useTemplateRef<FormInst>("form");

const isLoading = ref<boolean>(false);

const handleRegister = async () => {
  await formRef.value?.validate();
  if (!isRead.value) {
    return window.$message.error(t("register.readAndAgreeFirst"));
  }

  window.$message.warning(t("common.notImplemented"));
};
</script>
