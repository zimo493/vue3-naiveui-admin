<script setup lang="ts">
import type { FormInst } from "naive-ui";

const emit = defineEmits(["update:modelValue"]);

const rules = {
  account: {
    required: true,
    trigger: "blur",
    message: "用户名不能为空",
  },
};
const model = ref({
  account: "",
});
const formRef = useTemplateRef<FormInst>("form");

const handleRegister = async () => {
  await formRef.value?.validate();
  window.$message.warning("暂未实现，开发中 ...");
};
</script>

<template>
  <div>
    <n-h3 depth="3" class="text-center">重置密码</n-h3>
    <n-form ref="form" :rules="rules" :model="model" :show-label="false" size="large">
      <n-form-item path="account">
        <n-input v-model:value="model.account" clearable placeholder="请输入用户名">
          <template #prefix>
            <Icones icon="ant-design:user-outlined" />
          </template>
        </n-input>
      </n-form-item>
      <n-form-item>
        <n-space vertical :size="20" class="w-full">
          <n-button block type="warning" @click="handleRegister">重置密码</n-button>
          <n-flex justify="center">
            <n-text>想起密码？</n-text>
            <n-button text type="primary" @click="emit('update:modelValue', 'login')">
              登录
            </n-button>
          </n-flex>
        </n-space>
      </n-form-item>
    </n-form>
  </div>
</template>
