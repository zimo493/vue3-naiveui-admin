<template>
  <n-card>
    <n-radio-group v-model:value="radioValue" name="selectYear">
      <n-grid x-gap="20" y-gap="20" :cols="1">
        <n-gi>
          <n-flex align="center">
            <n-radio :value="1" />
            不填，允许的通配符[, - * /]
          </n-flex>
        </n-gi>
        <n-gi>
          <n-flex align="center">
            <n-radio :value="2" />
            每年
          </n-flex>
        </n-gi>
        <n-gi>
          <n-flex align="center">
            <n-radio :value="3" />
            周期从
            <n-input-number
              v-model:value="cycle01"
              :min="fullYear"
              :max="2098"
              clearable
              @update:value="radioChange(3)"
              @focus="radioChange(3)"
            />
            年到
            <n-input-number
              v-model:value="cycle02"
              :min="cycle01 ? cycle01 + 1 : fullYear + 1"
              :max="2099"
              clearable
              @update:value="radioChange(3)"
              @focus="radioChange(3)"
            />
            年
          </n-flex>
        </n-gi>
        <n-gi>
          <n-flex align="center">
            <n-radio :value="4" />
            周期从
            <n-input-number
              v-model:value="average01"
              :min="fullYear"
              :max="2098"
              clearable
              @update:value="radioChange(4)"
              @focus="radioChange(4)"
            />
            年开始，每
            <n-input-number
              v-model:value="average02"
              :min="1"
              :max="2099 - average01 || fullYear"
              clearable
              @update:value="radioChange(4)"
              @focus="radioChange(4)"
            />
            年执行一次
          </n-flex>
        </n-gi>
        <n-gi>
          <n-flex>
            <n-radio :value="5" />
            指定年
            <div style="flex: 1">
              <n-checkbox-group v-model:value="checkboxList" @update:value="radioChange(5)">
                <n-flex>
                  <n-checkbox
                    v-for="item in 11"
                    :key="item"
                    :value="item - 1 + fullYear"
                    :label="String(item - 1 + fullYear)"
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

defineOptions({ name: "CrontabYear" });

const { modelValue } = defineProps({
  modelValue: { required: true, type: String },
});

const emit = defineEmits<{
  (e: "update:modelValue", v: string): void;
}>();

const fullYear = ref<number>(Number(new Date().getFullYear()));
const radioValue = ref<number>(1);
const cycle01 = ref<number>(fullYear.value);
const cycle02 = ref<number>(cycle01.value + 1);
const average01 = ref<number>(fullYear.value);
const average02 = ref<number>(1);
const checkboxList = ref<number[]>([]);

const value = computed({
  get: () => modelValue,
  set: (v) => emit("update:modelValue", v),
});

watch(
  () => value.value,
  () => assign()
);
onMounted(() => {
  // 仅获取当前年份
  // fullYear.value = Number(new Date().getFullYear());
  // cycle01.value = fullYear.value;
  // cycle02.value = cycle01.value + 1;
  // average01.value = fullYear.value;
  assign();
});

// 赋值
const assign = () => {
  if (value.value === "") {
    radioValue.value = 1;
  } else if (value.value === "*") {
    radioValue.value = 2;
  } else if (value.value.indexOf("-") > -1) {
    radioValue.value = 3;
  } else if (value.value.indexOf("/") > -1) {
    radioValue.value = 4;
  } else {
    checkboxList.value = value.value.split(",").map((i) => +i);
    radioValue.value = 5;
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
      value.value = "";
    } else if (v === 2) {
      value.value = "*";
    } else if (v === 3) {
      value.value = cycleTotal.value;
    } else if (v === 4) {
      value.value = averageTotal.value;
    } else if (v === 5) {
      value.value = checkboxString.value;
    } else {
      value.value = "";
    }
  }
);

// 计算两个周期值
const cycleTotal = computed(() => {
  const cycle1 = checkNumber(cycle01.value, fullYear.value, 2098);
  const cycle2 = checkNumber(cycle02.value, cycle1 ? cycle1 + 1 : fullYear.value + 1, 2099);

  return cycle1 + "-" + cycle2;
});

watch(
  () => cycleTotal.value,
  (v) => (value.value = v)
);

// 计算平均用到的值
const averageTotal = computed(() => {
  const average1 = checkNumber(average01.value, fullYear.value, 2098);
  const average2 = checkNumber(average02.value, 1, 2099 - average1 || fullYear.value);

  return average1 + "/" + average2;
});

watch(
  () => averageTotal.value,
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
