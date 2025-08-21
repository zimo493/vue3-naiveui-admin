<template>
  <n-card>
    <n-radio-group v-model:value="radioValue" name="selectWeek">
      <n-grid x-gap="20" y-gap="20" :cols="1">
        <n-gi>
          <n-flex align="center">
            <n-radio :value="1" />
            {{ t("crontab.wildcard.week") }}
          </n-flex>
        </n-gi>
        <n-gi>
          <n-flex align="center">
            <n-radio :value="2" />
            {{ t("crontab.none") }}
          </n-flex>
        </n-gi>
        <n-gi>
          <n-flex align="center">
            <n-radio :value="3" />
            {{ t("crontab.cycle") }}
            <n-radio-group
              v-model:value="cycle01"
              name="radiobuttongroup1"
              size="small"
              @update:value="radioChange(3)"
            >
              <n-radio-button
                v-for="song in weekList"
                :key="song.value"
                :value="song.value"
                :disabled="song.value === 1"
                :label="song.label"
              />
            </n-radio-group>
            <div>{{ t("crontab.to") }}</div>
            <n-radio-group
              v-model:value="cycle02"
              name="radiobuttongroup2"
              size="small"
              @update:value="radioChange(3)"
            >
              <n-radio-button
                v-for="song in weekList"
                :key="song.value"
                :value="song.value"
                :disabled="song.value < cycle01 && song.value !== 1"
                :label="song.label"
              />
            </n-radio-group>
          </n-flex>
        </n-gi>
        <n-gi>
          <n-flex align="center">
            <n-radio :value="4" />
            {{ t("crontab.cycle") }}{{ t("crontab.weeks.first") }}
            <n-input-number
              v-model:value="average01"
              :min="1"
              :max="4"
              clearable
              @update:value="radioChange(4)"
              @focus="radioChange(4)"
            />
            {{ t("crontab.week") }}{{ t("crontab.weeks.of") }}
            <n-radio-group
              v-model:value="average02"
              name="radiobuttongroup3"
              size="small"
              @update:value="radioChange(4)"
            >
              <n-radio-button
                v-for="song in weekList"
                :key="song.value"
                :value="song.value"
                :label="song.label"
              />
            </n-radio-group>
          </n-flex>
        </n-gi>
        <n-gi>
          <n-flex align="center">
            <n-radio :value="5" />
            {{ t("crontab.weeks.last") }}
            <n-radio-group
              v-model:value="weekday"
              name="radiobuttongroup4"
              size="small"
              @update:value="radioChange(5)"
            >
              <n-radio-button
                v-for="song in weekList"
                :key="song.value"
                :value="song.value"
                :label="song.label"
              />
            </n-radio-group>
          </n-flex>
        </n-gi>
        <n-gi>
          <n-flex align="center">
            <n-radio :value="6" />
            {{ t("crontab.specify") }}{{ t("crontab.week") }}
            <div style="flex: 1">
              <n-checkbox-group v-model:value="checkboxList" @update:value="radioChange(6)">
                <n-flex>
                  <n-checkbox
                    v-for="item in weekList"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </n-flex>
              </n-checkbox-group>
            </div>
          </n-flex>
        </n-gi>
      </n-grid>
    </n-radio-group>
  </n-card>
</template>
<script lang="ts" setup>
import { checkNumber } from "@/utils";

defineOptions({ name: "CrontabWeek" });
const { t } = useI18n();

const { modelValue } = defineProps({
  modelValue: { required: true, type: String },
});

const emit = defineEmits<{
  (e: "update:modelValue", v: string): void;
}>();

const radioValue = ref<number>(2);
const weekday = ref<number>(2);
const cycle01 = ref<number>(2);
const cycle02 = ref<number>(3);
const average01 = ref<number>(1);
const average02 = ref<number>(2);
const checkboxList = ref<number[]>([]);
const weekList = computed(() => [
  { value: 2, label: t("crontab.weeks.list.1") },
  { value: 3, label: t("crontab.weeks.list.2") },
  { value: 4, label: t("crontab.weeks.list.3") },
  { value: 5, label: t("crontab.weeks.list.4") },
  { value: 6, label: t("crontab.weeks.list.5") },
  { value: 7, label: t("crontab.weeks.list.6") },
  { value: 1, label: t("crontab.weeks.list.0") },
]);

const value = computed({
  get: () => modelValue,
  set: (v) => emit("update:modelValue", v),
});

console.log(value.value);

watch(
  () => value.value,
  () => assign()
);
onMounted(() => assign());

// 赋值
const assign = () => {
  if (value.value === "*") {
    radioValue.value = 1;
  } else if (value.value === "?") {
    radioValue.value = 2;
  } else if (value.value.indexOf("-") > -1) {
    const indexArr = value.value.split("-");

    cycle01.value = isNaN(+indexArr[0]) ? 0 : +indexArr[0];
    cycle02.value = +indexArr[1];
    radioValue.value = 3;
  } else if (value.value.indexOf("#") > -1) {
    const indexArr = value.value.split("#");

    average01.value = isNaN(+indexArr[1]) ? 1 : +indexArr[1];
    average02.value = +indexArr[0];
    radioValue.value = 4;
  } else if (value.value.indexOf("L") > -1) {
    const indexArr = value.value.split("L");

    weekday.value = isNaN(+indexArr[0]) ? 1 : +indexArr[0];
    radioValue.value = 5;
  } else {
    checkboxList.value = value.value.split(",").map((i) => +i);
    radioValue.value = 6;
  }
};

// 单选按钮值变化时
const radioChange = (v: number) => {
  if (radioValue.value !== v) {
    radioValue.value = v;
  }
};

watch(
  () => radioValue.value,
  (v) => {
    if (v === 1) {
      value.value = "*";
    } else if (v === 2) {
      value.value = "?";
    } else if (v === 3) {
      value.value = cycleTotal.value;
    } else if (v === 4) {
      value.value = averageTotal.value;
    } else if (v === 5) {
      value.value = weekdayCheck.value;
    } else if (v === 6) {
      value.value = checkboxString.value;
    } else {
      value.value = "*";
    }
  }
);

// 计算两个周期值
const cycleTotal = computed(() => {
  return checkNumber(cycle01.value, 1, 7) + "-" + checkNumber(cycle02.value, 1, 7);
});

watch(
  () => cycleTotal.value,
  (v) => (value.value = v)
);

// 计算平均用到的值
const averageTotal = computed(() => {
  return checkNumber(average02.value, 1, 7) + "#" + checkNumber(average01.value, 1, 4);
});

watch(
  () => averageTotal.value,
  (v) => (value.value = v)
);

// 最近的工作日（格式）
const weekdayCheck = computed(() => {
  return checkNumber(weekday.value, 1, 7) + "L";
});

watch(
  () => weekdayCheck.value,
  (v) => (value.value = v)
);

// 计算勾选的checkbox值合集
const checkboxString = computed(() => {
  const str = checkboxList.value.join();

  return str === "" ? "*" : str;
});

watch(
  () => checkboxString.value,
  (v) => (value.value = v)
);
</script>
