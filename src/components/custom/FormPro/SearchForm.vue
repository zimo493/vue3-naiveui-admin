<template>
  <n-form
    ref="ruleForm"
    v-bind="$attrs"
    :rules="rules"
    :model="val"
    :label-align="labelAlign"
    :label-placement="labelPlacement"
    :label-width="labelWidth"
    :show-label="showLabel"
    :show-feedback="false"
  >
    <n-grid :x-gap="gutter" :y-gap="gutter">
      <template v-for="item in sliceCodList" :key="item.field">
        <n-form-item-grid-item
          v-if="!item.isHidden"
          :span="item.colSpan ?? defaultSpan"
          :label="item.label"
          :path="item.field"
        >
          <template v-if="item.labelMessage" #label>
            <FormTipLabel :label="item.label" :msg="item.labelMessage" />
          </template>

          <!-- 优先展示自定义插槽 -->
          <template v-if="item.slotName != undefined">
            <slot :name="item.slotName" />
          </template>
          <template v-else>
            <FieldRenderer v-model="val" :item="item" />
          </template>
        </n-form-item-grid-item>
      </template>
      <n-gi :span="rSpanCount">
        <n-flex :justify="operationButtonPosition === 'left' ? 'start' : 'end'">
          <slot name="before" />
          <n-button type="primary" :loading="loading" @click="handleQuery">
            <template #icon>
              <icon-park-outline-search />
            </template>
            搜索
          </n-button>
          <n-button strong secondary :loading="loading" @click="resetQuery">
            <template #icon>
              <icon-park-outline-redo />
            </template>
            重置
          </n-button>
          <n-button v-show="showFoldBtn" type="primary" text @click="toggleCollapse">
            <template #icon>
              <Icones
                :icon="isCollapse ? 'icon-park-outline:down' : 'icon-park-outline:up'"
                :size="24"
              />
            </template>
            {{ isCollapse ? "展开" : "收起" }}
          </n-button>
          <slot name="after" />
        </n-flex>
      </n-gi>
    </n-grid>
  </n-form>
</template>
<script lang="ts" setup>
import { type FormInst } from "naive-ui";
import { useDict } from "@/hooks";
import FormTipLabel from "@/components/custom/FormTipLabel";
import FieldRenderer from "./component/FieldRender.vue";

defineOptions({ name: "SearchForm" });

const {
  fields,
  modelValue = {},
  gutter = 16,
  labelPlacement = "left",
  labelAlign = "right",
  rules = {},
  showLabel = true,
  loading = false,
  operationButtonPosition = "right",
  collapseLength: foldingLength,
  controlsSpan: operateSpan,
} = defineProps({
  fields: {
    required: true,
    type: Array as PropType<TablePro.FormItem<Recordable>[]>,
  },
  modelValue: { type: Object as PropType<Recordable> },
  labelPlacement: { type: String as PropType<"left" | "top"> },
  labelAlign: { type: String as PropType<"left" | "right"> },
  rules: { type: Object as PropType<TablePro.FormOption<Recordable>["rules"]> },
  gutter: { type: Number },
  labelWidth: { type: Number },
  showLabel: { type: Boolean },
  loading: { type: Boolean },
  collapseLength: { type: Number },
  controlsSpan: { type: Number },
  operationButtonPosition: { type: String as PropType<"left" | "right"> },
});

const emit = defineEmits<{
  (e: "update:modelValue", v: Recordable): void;
  (e: "reset", v: Recordable): void;
  (e: "submit", v: Recordable): void;
}>();

onMounted(() => getSpanCount());

const controlsSpan = operateSpan ?? 4;

const ruleFormRef = useTemplateRef<FormInst>("ruleForm"); // 获取表单实例
const isCollapse = ref(true); // 默认折叠
const defaultSpan = 4; // 默认 span 为 4
const collapseLength = foldingLength ?? 3; // 默认折叠长度为 3

// 判断是否需要显示折叠按钮
const showFoldBtn = computed(() => {
  const fieldList = fields || [];

  return fieldList.length > collapseLength;
});
const rSpanCount = ref<number>(controlsSpan); // 默认给按钮区域分配 4 的 span

const val = computed({
  get: () => modelValue,
  set: (v) => {
    emit("update:modelValue", v);
  },
});

// 切片计算
const sliceCodList = computed(() => {
  return fields?.slice(0, isCollapse.value ? collapseLength : fields.length).map((item) => {
    if (!item.type) item.type = "input";
    if (item.dict) {
      if (["select", "radio", "checkbox"].includes(item.type)) {
        const dict = useDict(item.dict);

        item.options = dict[item.dict].value.map((i) => ({
          label: i.label,
          value: i.value,
        }));

        return item;
      }

      return item;
    }

    return item;
  });
});

/** 表单默认值 */
const defaultValue = { ...val.value };

// 提交按钮触发
const handleQuery = async () => {
  await ruleFormRef.value?.validate();
  emit("submit", val.value);
};

// 重置按钮触发
function resetQuery() {
  ruleFormRef.value?.restoreValidation();
  Object.keys(val.value).forEach((key) => {
    val.value[key] = unref(defaultValue)[key] || null;
  });
  emit("reset", val.value);
}

// 计算右侧按钮区域的 span 值
const getSpanCount = () => {
  let totalSpan = 0;
  const visibleItems = (isCollapse.value ? fields?.slice(0, collapseLength) : fields) ?? [];

  // 计算每行的 span 值
  let currentLineSpan = 0;

  for (const item of visibleItems) {
    const itemSpan = item.colSpan ?? defaultSpan;

    if (currentLineSpan + itemSpan > 24) {
      currentLineSpan = itemSpan;
    } else {
      currentLineSpan += itemSpan;
    }
  }
  totalSpan += currentLineSpan;

  // 计算剩余的 span 值
  const remainingSpan = 24 - (totalSpan % 24);

  rSpanCount.value = remainingSpan < controlsSpan ? 24 : remainingSpan;
};

// 切换折叠状态
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
  getSpanCount();
};
</script>
