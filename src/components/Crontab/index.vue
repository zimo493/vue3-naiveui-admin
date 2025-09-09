<template>
  <n-modal
    v-model:show="visible"
    style="width: 1000px"
    preset="card"
    :title="t('crontab.title')"
    :segmented="{ content: true, action: true }"
    @after-leave="clearCron"
  >
    <n-grid x-gap="12" y-gap="12" :cols="1">
      <n-gi>
        <n-tabs type="segment" animated>
          <n-tab-pane name="second" :tab="t('crontab.second')">
            <CronSecond v-model="crontabValue.second" />
          </n-tab-pane>
          <n-tab-pane name="min" :tab="t('crontab.min')">
            <CronMin v-model="crontabValue.min" />
          </n-tab-pane>
          <n-tab-pane name="hour" :tab="t('crontab.hour')">
            <CronHour v-model="crontabValue.hour" />
          </n-tab-pane>
          <n-tab-pane name="day" :tab="t('crontab.day')">
            <CronDay v-model="crontabValue.day" />
          </n-tab-pane>
          <n-tab-pane name="month" :tab="t('crontab.month')">
            <CronMonth v-model="crontabValue.month" />
          </n-tab-pane>
          <n-tab-pane name="week" :tab="t('crontab.week')">
            <CronWeek v-model="crontabValue.week" />
          </n-tab-pane>
          <n-tab-pane name="year" :tab="t('crontab.year')">
            <CronYear v-model="crontabValue.year" />
          </n-tab-pane>
        </n-tabs>
      </n-gi>
      <n-gi>
        <n-card :title="t('crontab.timeExpression')" :segmented="{ content: true }">
          <template #header-extra>
            <n-flex align="center">
              {{ t("crontab.cronExpression") }}
              <n-tag type="success" :bordered="false">
                {{ crontabValueString }}
              </n-tag>
            </n-flex>
          </template>
          <div class="crontabValue">
            <div v-for="(item, key, index) in crontabValue" :key="index">
              {{ map[key] }}：
              <n-tag v-if="item" :bordered="false" size="small">
                {{ item }}
              </n-tag>
            </div>
          </div>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card :title="t('crontab.last10RunTime')" :segmented="{ content: true }">
          <CronResult v-model="crontabValueString" />
        </n-card>
      </n-gi>
    </n-grid>
    <template #action>
      <n-flex justify="end">
        <n-button type="primary" @click="handleSubmit">
          <template #icon>
            <Icones icon="ant-design:check-outlined" />
          </template>
          {{ t("button.ok") }}
        </n-button>
        <n-button type="warning" @click="clearCron">
          <template #icon>
            <Icones icon="ant-design:redo-outlined" />
          </template>
          {{ t("button.reset") }}
        </n-button>
        <n-button strong secondary @click="cancel">
          <template #icon>
            <Icones icon="ant-design:close-outlined" />
          </template>
          {{ t("button.cancel") }}
        </n-button>
      </n-flex>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
defineOptions({ name: "Crontab" });
const { t } = useI18n();

const { modelValue } = defineProps({
  modelValue: { type: String },
});

const emit = defineEmits<{
  (e: "update:modelValue", v?: string): void;
}>();

interface CrontabValue {
  second: string;
  min: string;
  hour: string;
  day: string;
  month: string;
  week: string;
  year: string;
}

const value = computed({
  get: () => modelValue,
  set: (v) => emit("update:modelValue", v),
});

defineExpose({
  open: () => {
    visible.value = true;
    crontabValue.value = getValue(); // 初始化值
  },
});

// 初始值
const defaultValue: CrontabValue = {
  second: "*",
  min: "*",
  hour: "*",
  day: "*",
  month: "*",
  week: "?",
  year: "",
};

// 反解析 表达式
const getValue = () => {
  if (value.value) {
    const arr = value.value.split(" ");

    if (arr.length >= 6) {
      //6 位以上是合法表达式
      const obj: CrontabValue = {
        second: arr[0],
        min: arr[1],
        hour: arr[2],
        day: arr[3],
        month: arr[4],
        week: arr[5],
        year: arr[6] ? arr[6] : "",
      };

      return { ...obj };
    } else {
      return { ...defaultValue };
    }
  } else {
    return { ...defaultValue };
  }
};

const crontabValue = ref<CrontabValue>(getValue());

const map = computed(
  (): CrontabValue => ({
    second: t("crontab.second"),
    min: t("crontab.min"),
    hour: t("crontab.hour"),
    day: t("crontab.day"),
    month: t("crontab.month"),
    week: t("crontab.week"),
    year: t("crontab.year"),
  })
);

watch(
  () => crontabValue.value.day,
  (v) => {
    if (v !== "?") {
      crontabValue.value.week = "?";
    }
  }
);

watch(
  () => crontabValue.value.week,
  (v) => {
    if (v !== "?") {
      crontabValue.value.day = "?";
    }
  }
);

const crontabValueString = computed(() => {
  const { second, min, hour, day, month, week, year } = crontabValue.value;

  return `${second} ${min} ${hour} ${day} ${month} ${week}${year ? " " + year : ""}`;
});

const visible = ref<boolean>(false);

// 确定
const handleSubmit = () => {
  value.value = crontabValueString.value;
  cancel();
};

// 重置
const clearCron = () => {
  crontabValue.value = { ...defaultValue };
};

// 取消
const cancel = () => {
  visible.value = false;
};
</script>

<style lang="scss" scoped>
.crontabValue {
  display: flex;

  & > div {
    flex: 1;
    white-space: nowrap;
  }
}
</style>
