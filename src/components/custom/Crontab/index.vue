<template>
  <n-modal
    v-model:show="visible"
    style="width: 1000px"
    preset="card"
    title="Cron表达式生成器"
    :segmented="{ content: true, action: true }"
    @after-leave="clearCron"
  >
    <n-grid x-gap="12" y-gap="12" :cols="1">
      <n-gi>
        <n-tabs type="segment" animated>
          <n-tab-pane name="second" tab="秒">
            <Second v-model="crontabValue.second" />
          </n-tab-pane>
          <n-tab-pane name="min" tab="分">
            <Min v-model="crontabValue.min" />
          </n-tab-pane>
          <n-tab-pane name="hour" tab="时">
            <Hour v-model="crontabValue.hour" />
          </n-tab-pane>
          <n-tab-pane name="day" tab="日">
            <Day v-model="crontabValue.day" />
          </n-tab-pane>
          <n-tab-pane name="month" tab="月">
            <Month v-model="crontabValue.month" />
          </n-tab-pane>
          <n-tab-pane name="week" tab="周">
            <Week v-model="crontabValue.week" />
          </n-tab-pane>
          <n-tab-pane name="year" tab="年">
            <Year v-model="crontabValue.year" />
          </n-tab-pane>
        </n-tabs>
      </n-gi>
      <n-gi>
        <n-card title="时间表达式" :segmented="{ content: true }">
          <template #header-extra>
            Cron 表达式：
            <n-tag type="success" :bordered="false">
              {{ crontabValueString }}
            </n-tag>
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
        <n-card title="最近10次运行时间" :segmented="{ content: true }">
          <Result v-model="crontabValueString" />
        </n-card>
      </n-gi>
    </n-grid>
    <template #action>
      <n-space justify="end">
        <n-button type="primary" @click="handleSubmit">
          <template #icon>
            <Icones icon="ant-design:check-outlined" />
          </template>
          确定
        </n-button>
        <n-button type="warning" @click="clearCron">
          <template #icon>
            <Icones icon="ant-design:redo-outlined" />
          </template>
          重置
        </n-button>
        <n-button strong secondary @click="cancel">
          <template #icon>
            <Icones icon="ant-design:close-outlined" />
          </template>
          取消
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>
<script lang="ts">
export default { name: "Crontab" };
</script>

<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: String,
  },
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
  get: () => props.modelValue,
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

const map: CrontabValue = {
  second: "秒",
  min: "分钟",
  hour: "小时",
  day: "日",
  month: "月",
  week: "周",
  year: "年",
};

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
