<template>
  <div>
    <n-h3 mt-0 depth="3" text-center>{{ t("login.login") }}</n-h3>
    <n-form ref="form" :rules="rules" :model="model" :show-label="false" size="large">
      <n-form-item path="username">
        <n-input
          v-model:value="model.username"
          clearable
          :placeholder="t('input') + t('login.username')"
          @keyup.enter="handleLoginSubmit"
        >
          <template #prefix>
            <Icones :size="22" icon="ant-design:user-outlined" />
          </template>
        </n-input>
      </n-form-item>
      <n-form-item path="password">
        <n-input
          v-model:value="model.password"
          :placeholder="t('input') + t('login.password')"
          type="password"
          clearable
          show-password-on="mousedown"
          @keyup.enter="handleLoginSubmit"
        >
          <template #password-invisible-icon>
            <icon-park-outline-preview-close-one />
          </template>
          <template #password-visible-icon>
            <icon-park-outline-preview-open />
          </template>
          <template #prefix>
            <Icones :size="20" icon="ant-design:lock-outlined" />
          </template>
        </n-input>
      </n-form-item>
      <n-form-item path="captchaCode">
        <n-flex align="center" :size="10">
          <n-input
            ref="captcha"
            v-model:value="model.captchaCode"
            :placeholder="t('input') + t('login.captcha')"
            clearable
            class="flex-1"
            @keyup.enter="handleLoginSubmit"
          >
            <template #prefix>
              <Icones :size="20" icon="ant-design:verified-outlined" />
            </template>
          </n-input>
          <n-spin size="small" :show="captchaLoading">
            <n-el
              cursor-pointer
              h="[40px]"
              w="[120px]"
              flex
              items-center
              justify-center
              border-rd-3px
              overflow-hidden
              bg="hover:var(--n-color-target)"
              transition-all
              duration-200
              @click="getCaptcha"
            >
              <img
                v-if="captchaBase64"
                w="[100%]"
                h="[100%]"
                object-cover
                :src="captchaBase64"
                alt="captchaCode"
              />
              <n-text v-else depth="3" text="12px">点击获取验证码</n-text>
            </n-el>
          </n-spin>
        </n-flex>
      </n-form-item>
      <n-flex vertical :size="20">
        <div class="flex-y-center justify-between">
          <n-checkbox v-model:checked="model.rememberMe">{{ t("login.rememberMe") }}</n-checkbox>
          <n-button type="primary" text @click="toOtherForm('resetPwd')">
            {{ t("login.forget") }}
          </n-button>
        </div>
        <n-button
          block
          type="primary"
          size="large"
          :loading="loading"
          :disabled="loading"
          @click="handleLoginSubmit"
        >
          {{ loading ? t("login.logIn") : t("login.login") }}
        </n-button>
        <n-flex align="center" justify="center">
          <n-text>{{ t("login.noAccount") }}</n-text>
          <n-button type="primary" text @click="toOtherForm('register')">
            {{ t("register.register") }}
          </n-button>
        </n-flex>
      </n-flex>
    </n-form>

    <n-divider>
      <span op-80>{{ t("common.others") }}</span>
    </n-divider>
    <n-flex justify="center">
      <CommonWrapper>
        <Icones :size="20" icon="icon-park-outline:phone-telephone" />
      </CommonWrapper>
      <CommonWrapper>
        <Icones :size="20" icon="icon-park-outline:wechat" />
      </CommonWrapper>
      <CommonWrapper>
        <Icones :size="20" icon="icon-park-outline:tencent-qq" />
      </CommonWrapper>
      <CommonWrapper>
        <Icones :size="20" icon="icon-park-outline:github-one" />
      </CommonWrapper>
    </n-flex>
  </div>
</template>
<script setup lang="tsx">
import type { FormInst, FormRules, InputInst } from "naive-ui";
import { useAuthStoreHook } from "@/store";
import AuthAPI from "@/api/auth";
import { router } from "@/router";
import { LocationQuery, RouteLocationRaw } from "vue-router";
import { decrypt, encrypt, local } from "@/utils";

const route = useRoute();
const t = useI18n().t;
const authStore = useAuthStoreHook();

const emit = defineEmits(["update:modelValue"]);
const toOtherForm = (type: "register" | "resetPwd") => emit("update:modelValue", type);

onMounted(() => {
  getCaptcha();
  getCookie();
});

const formRef = useTemplateRef<FormInst>("form");

const captchaRef = useTemplateRef<InputInst>("captcha");

const loading = ref(false); // 按钮 loading 状态

const model = ref<Auth.LoginFormData>({
  username: "",
  password: "",
  captchaKey: "",
  captchaCode: "",
  rememberMe: false,
});

const rules = ref<FormRules>({
  username: [{ required: true, trigger: "blur", message: t("input") + t("login.username") }],
  password: [
    { required: true, trigger: "blur", message: t("input") + t("login.password") },
    { min: 6, message: t("rules.passwordLength"), trigger: "blur" },
  ],
  captchaCode: [{ required: true, trigger: "blur", message: t("input") + t("login.captcha") }],
});

// 获取验证码
const captchaLoading = ref(false); // 验证码按钮 loading 状态
const captchaBase64 = ref(); // 验证码图片Base64字符串
const getCaptcha = () => {
  captchaLoading.value = true;
  AuthAPI.getCaptcha()
    .then((data) => {
      model.value.captchaKey = data.captchaKey;
      captchaBase64.value = data.captchaBase64;
    })
    .finally(() => (captchaLoading.value = false));
};

const getCookie = () => {
  const loginInfo = local.get("remember");

  if (loginInfo) {
    model.value.username =
      loginInfo.username === undefined ? loginInfo.username : loginInfo.username;
    model.value.password =
      loginInfo.password === undefined ? loginInfo.password : decrypt(loginInfo.password) || "";
    model.value.rememberMe =
      loginInfo.rememberMe === undefined ? false : Boolean(loginInfo.rememberMe);
  }
};

const handleLoginSubmit = async () => {
  // 1. 表单验证
  await formRef.value?.validate();

  try {
    loading.value = true;

    // 2. 执行登录
    await authStore.login(model.value);

    // 3. 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码
    if (model.value.rememberMe) {
      const pwd = encrypt(model.value.password);

      local.set(
        "remember",
        {
          username: model.value.username,
          password: typeof pwd === "string" ? pwd : "",
          rememberMe: model.value.rememberMe,
        },
        60 * 60 * 24 * 10
      );
    } else {
      // 否则移除
      local.remove("remember");
    }

    // 4. 解析并跳转目标地址
    const redirect = resolveRedirectTarget(route.query);

    console.log(redirect, "redirect");

    await router.push(redirect);

    window.$message.success(t("login.success"));
  } catch (e) {
    console.log(e);
    getCaptcha();
    model.value.captchaCode = "";
    captchaRef.value?.focus();
  } finally {
    loading.value = false;
  }
};

/**
 * 解析重定向目标
 * @param query 路由查询参数
 * @returns 标准化后的路由地址对象
 */
function resolveRedirectTarget(query: LocationQuery): RouteLocationRaw {
  // 默认跳转路径
  const defaultPath = "/";

  // 获取原始重定向路径
  const rawRedirect = (query.redirect as string) || defaultPath;

  try {
    // 6. 使用Vue Router解析路径
    const resolved = router.resolve(rawRedirect);

    return {
      path: resolved.path,
      query: resolved.query,
    };
  } catch {
    // 7. 异常处理：返回安全路径
    return { path: defaultPath };
  }
}
</script>

<style scoped>
/* 修复输入框灰色背景问题 */
:deep(.n-input) {
  background: transparent !important;
  background-color: transparent !important;
}

:deep(.n-input .n-input__input-el) {
  background: transparent !important;
  background-color: transparent !important;
}

:deep(.n-input .n-input-wrapper) {
  background: transparent !important;
  background-color: transparent !important;
}

:deep(.n-input--focus .n-input-wrapper) {
  background: transparent !important;
  background-color: transparent !important;
}

:deep(.n-input--focus .n-input__input-el) {
  background: transparent !important;
  background-color: transparent !important;
}

:deep(.n-input__input) {
  background: transparent !important;
  background-color: transparent !important;
}

:deep(.n-input__input-el):autofill,
:deep(.n-input__input-el):-webkit-autofill,
:deep(.n-input__input-el):-webkit-autofill:hover,
:deep(.n-input__input-el):-webkit-autofill:focus {
  background: transparent !important;
  background-color: transparent !important;
  -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
  transition: background-color 5000s ease-in-out 0s !important;
  -webkit-text-fill-color: inherit !important;
}
</style>
