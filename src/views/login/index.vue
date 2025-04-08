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
  <n-el wh-full flex flex-col class="login" style="background-color: var(--body-color)">
    <div fixed top-40px right-40px text-lg>
      <DarkModeSwitch />
    </div>
    <n-el flex-1 flex-center>
      <n-el
        class="p-4xl sm:w-450px sm:h-700px"
        style="background: var(--card-color); border-radius: 10px; box-shadow: var(--box-shadow-1)"
      >
        <div w-full flex flex-col items-center>
          <SvgIconsLogo class="text-5em" />

          <n-badge :value="`v${pkg.version}`" type="success" :offset="[0, 15]">
            <h2 text-24px m-xl>{{ pkg.name }}</h2>
          </n-badge>

          <transition name="fade-slide" mode="out-in">
            <component :is="formComponents[formType]" v-model="formType" class="w-85%" />
          </transition>
        </div>
      </n-el>
    </n-el>
    <n-layout-footer w-full text-center bordered>
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
