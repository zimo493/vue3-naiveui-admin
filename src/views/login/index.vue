<script setup lang="ts">
type LayoutMap = "login" | "register" | "resetPwd";
const formType = ref<LayoutMap>("login");
const formComponents = {
  login: defineAsyncComponent(() => import("./components/Login.vue")),
  register: defineAsyncComponent(() => import("./components/Register.vue")),
  resetPwd: defineAsyncComponent(() => import("./components/ResetPwd.vue")),
};

const { pkg } = __APP_INFO__;
</script>

<template>
  <!-- bg="[var(--body-color)]" -->
  <n-el wh-full flex flex-col bg="[url(@/assets/images/login-bg.svg)]" bg-center bg-cover>
    <div fixed top-40px right-40px text-lg flex gap-2>
      <DarkModeSwitch />
      <LangSwitch />
    </div>
    <n-el flex-1 flex-center>
      <n-el border-rd-10px shadow="[var(--box-shadow-2)]" sm:w-450px sm:h-700px p-4xl>
        <div w-full flex flex-col items-center>
          <SvgIconsLogo class="text-5em" />

          <n-badge :value="`v${pkg.version}`" type="success" :offset="[0, 15]">
            <n-h1 text-24px p-xl m-0>{{ pkg.name }}</n-h1>
          </n-badge>

          <transition name="fade-slide" mode="out-in">
            <component :is="formComponents[formType]" v-model="formType" class="w-85%" />
          </transition>
        </div>
      </n-el>
    </n-el>
    <n-layout-footer h-30px flex-center>
      <!-- 登录页底部版权 -->
      <n-text size="small" whitespace-nowrap text-12px>
        Copyright © 2021 - 2025
        <a href="https://www.youlai.tech/" target="_blank">youlai.tech</a>
        All Rights Reserved.
        <a href="https://beian.miit.gov.cn/" target="_blank">皖ICP备20006496号-2</a>
      </n-text>
    </n-layout-footer>
  </n-el>
</template>
