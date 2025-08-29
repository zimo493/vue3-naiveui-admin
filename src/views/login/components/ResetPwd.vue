<script setup lang="ts">
import type { FormInst } from "naive-ui";

const t = useI18n().t;

const emit = defineEmits(["update:modelValue"]);

const rules = {
  account: {
    required: true,
    trigger: "blur",
    message: t("input") + t("login.username"),
  },
};
const model = ref({
  account: "",
});
const formRef = useTemplateRef<FormInst>("form");

const handleRegister = async () => {
  await formRef.value?.validate();
  window.$message.warning(t("common.notImplemented"));
};
</script>

<template>
  <div>
    <n-h3 mt-0 depth="3" text-center>{{ t("resetPwd.reset") }}</n-h3>
    <n-form ref="form" :rules="rules" :model="model" :show-label="false" size="large">
      <n-form-item path="account">
        <n-input v-model:value="model.account" clearable placeholder="请输入用户名">
          <template #prefix>
            <Icones icon="ant-design:user-outlined" />
          </template>
        </n-input>
      </n-form-item>
      <n-form-item>
        <n-flex vertical :size="20" class="w-full">
          <n-button block type="warning" @click="handleRegister">
            {{ t("resetPwd.reset") }}
          </n-button>
          <n-flex justify="center">
            <n-text>{{ t("resetPwd.recall") }}</n-text>
            <n-button text type="primary" @click="emit('update:modelValue', 'login')">
              {{ t("login.login") }}
            </n-button>
          </n-flex>
        </n-flex>
      </n-form-item>
    </n-form>
  </div>
</template>
