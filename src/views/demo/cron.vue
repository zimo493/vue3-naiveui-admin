<template>
  <div>
    <n-grid x-gap="12" :cols="2">
      <n-gi>
        <n-input-group>
          <n-input v-model:value="cronExpression" placeholder="请输入或生成表达式" clearable />
          <n-button type="primary" @click="() => crontabRef?.open()">
            <template #icon>
              <Icones icon="ant-design:clock-circle-outlined" />
            </template>
            {{ t("crontab.button") }}
          </n-button>
        </n-input-group>
      </n-gi>
    </n-grid>
    <!-- 表达式生成 -->
    <Crontab ref="crontab" v-model="cronExpression" />
  </div>
</template>
<script lang="ts" setup>
defineOptions({ name: "Cron" });
const { t } = useI18n();

const crontabRef = useTemplateRef("crontab");

const cronExpression = ref("0 0 0 * * ?");
</script>
