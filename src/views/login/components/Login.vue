<template>
  <div>
    <n-h3 mt-0 depth="3" text-center>登录</n-h3>
    <n-form ref="formRef" :rules="rules" :model="model" :show-label="false" size="large">
      <n-form-item path="username">
        <n-input
          v-model:value="model.username"
          clearable
          placeholder="请输入用户名"
          @keyup.enter="handleLoginSubmit"
        >
          <template #prefix>
            <NovaIcon :size="22" icon="ant-design:user-outlined" />
          </template>
        </n-input>
      </n-form-item>
      <n-form-item path="password">
        <n-input
          v-model:value="model.password"
          placeholder="请输入密码"
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
            <NovaIcon :size="20" icon="ant-design:lock-outlined" />
          </template>
        </n-input>
      </n-form-item>
      <n-form-item path="captchaCode">
        <n-input
          ref="captchaRef"
          v-model:value="model.captchaCode"
          placeholder="请输入验证码"
          clearable
          @keyup.enter="handleLoginSubmit"
        >
          <template #prefix>
            <NovaIcon :size="20" icon="ant-design:verified-outlined" />
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
              alt="code"
            />
          </n-el>
        </n-spin>
      </n-form-item>
      <n-space vertical :size="20">
        <div class="flex-y-center justify-between">
          <n-checkbox v-model:checked="model.rememberMe">记住我</n-checkbox>
          <n-button type="primary" text @click="toOtherForm('resetPwd')">忘记密码？</n-button>
        </div>
        <n-button
          block
          type="primary"
          size="large"
          :loading="loading"
          :disabled="loading"
          @click="handleLoginSubmit"
        >
          登录
        </n-button>
        <n-flex align="center" justify="center">
          <n-text>您没有账号？</n-text>
          <n-button type="primary" text @click="toOtherForm('register')">注册</n-button>
        </n-flex>
      </n-space>
    </n-form>

    <n-divider>
      <span op-80>其他</span>
    </n-divider>
    <n-space justify="center">
      <CommonWrapper>
        <NovaIcon :size="20" icon="icon-park-outline:phone-telephone" />
      </CommonWrapper>
      <CommonWrapper>
        <NovaIcon :size="20" icon="icon-park-outline:wechat" />
      </CommonWrapper>
      <CommonWrapper>
        <NovaIcon :size="20" icon="icon-park-outline:tencent-qq" />
      </CommonWrapper>
      <CommonWrapper>
        <NovaIcon :size="20" icon="icon-park-outline:github-one" />
      </CommonWrapper>
    </n-space>
  </div>
</template>
<script setup lang="tsx">
import type { FormInst, FormRules, InputInst } from "naive-ui";
import { useAuthStore } from "@/store";
import AuthAPI from "@/api/auth";
import { router } from "@/router";
import { LocationQuery, RouteLocationRaw } from "vue-router";
import Cookies from "js-cookie";
import { decrypt, encrypt } from "@/utils";

const route = useRoute();
const authStore = useAuthStore();

const emit = defineEmits(["update:modelValue"]);
const toOtherForm = (type: "register" | "resetPwd") => emit("update:modelValue", type);

onMounted(() => {
  getCaptcha();
  getCookie();
});

const formRef = ref<FormInst>();

const captchaRef = ref<InputInst | null>(null);

const loading = ref(false); // 按钮 loading 状态

const model = ref<Auth.LoginFormData>({
  username: "",
  password: "",
  captchaKey: "",
  captchaCode: "",
  rememberMe: false,
});

const rules = ref<FormRules>({
  username: [{ required: true, trigger: "blur", message: "请输入用户名" }],
  password: [
    { required: true, trigger: "blur", message: "请输入密码" },
    { min: 6, message: "密码长度不能小于6位", trigger: "blur" },
  ],
  captchaCode: [{ required: true, trigger: "blur", message: "请输入验证码" }],
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
  const userName = Cookies.get("username");
  const pwd = Cookies.get("password");
  const rememberMe = Cookies.get("rememberMe");
  const { username, password } = model.value;

  model.value.username = userName === undefined ? username : userName;
  model.value.password = pwd === undefined ? password : decrypt(pwd) || "";
  model.value.rememberMe = rememberMe === undefined ? false : Boolean(rememberMe);
};

const handleLoginSubmit = async () => {
  try {
    // 1. 表单验证
    await formRef.value?.validate();

    loading.value = true;

    // 2. 执行登录
    await authStore.login(model.value);

    // 3. 获取用户信息
    await authStore.getUserInfo();

    // 4. 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码
    if (model.value.rememberMe) {
      Cookies.set("rememberMe", model.value.rememberMe.toString(), {
        expires: 10,
      });
      Cookies.set("username", model.value.username, { expires: 10 });
      const pwd = encrypt(model.value.password);

      pwd ? Cookies.set("password", pwd, { expires: 10 }) : null;
    } else {
      // 否则移除
      Cookies.remove("username");
      Cookies.remove("password");
      Cookies.remove("rememberMe");
    }

    // 5. 解析并跳转目标地址
    const redirect = resolveRedirectTarget(route.query);

    await router.push(redirect);
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
