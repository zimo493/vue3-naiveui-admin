<template>
  <n-popover trigger="click" placement="top">
    <template #trigger>
      <n-button text>
        <template #icon>
          <icon-park-outline-setting />
        </template>
      </n-button>
    </template>
    <n-flex w-500px vertical>
      <n-flex p-y-2 justify="space-between">
        <span text-18px font-bold>水印设置</span>
        <n-button type="warning" size="small" @click="reset">
          <template #icon>
            <icon-park-outline-redo />
          </template>
          {{ t("button.reset") }}
        </n-button>
      </n-flex>
      <FormPro
        v-model="config"
        :form-config="formConfig"
        :form-props="{
          labelWidth: 'auto',
          showFeedback: false,
        }"
        :grid-props="{ yGap: 10 }"
      />
    </n-flex>
  </n-popover>
</template>

<script lang="tsx" setup>
import { useWatermarkStoreHook } from "@/store";
import { NColorPicker, NEl, NSlider } from "naive-ui";

defineOptions({
  name: "SettingWatermark",
});

const { t } = useI18n();

const watermark = useWatermarkStoreHook();

const { config } = storeToRefs(watermark);

const formConfig: FormPro.FormItemConfig[] = [
  {
    name: "fontSize",
    label: "字体大小",
    component: "number",
    span: 12,
  },
  {
    name: "fontColor",
    label: "字体颜色",
    span: 12,
    component: () => <NColorPicker v-model:value={config.value.fontColor} />,
  },
  {
    name: "fontStyle",
    label: "字体样式",
    component: "select",
    span: 12,
    props: {
      options: [
        { label: "正常", value: "normal" },
        { label: "斜体", value: "italic" },
        { label: "倾斜", value: "oblique" },
      ],
    },
  },
  {
    name: "fontWeight",
    label: "字重",
    component: "number",
    span: 12,
    props: {
      min: 100,
      max: 900,
      step: 100,
    },
  },
  {
    name: "rotate",
    label: "旋转角度",
    span: 12,
    component: () => <NSlider v-model:value={config.value.rotate} min={-90} max={90} />,
  },
  {
    name: "globalRotate",
    label: "整体旋转",
    span: 12,
    component: () => <NSlider v-model:value={config.value.globalRotate} min={-180} max={180} />,
  },
  {
    name: "cross",
    label: "跨越边界",
    component: "switch",
    span: 12,
    props: {
      round: false,
    },
    slots: {
      checked: () => <NEl>是</NEl>,
      unchecked: () => <NEl>否</NEl>,
    },
  },
  {
    name: "lineHeight",
    label: "行高",
    span: 12,
    component: "number",
    props: {
      min: 1,
    },
  },
  {
    name: "height",
    label: "高度",
    span: 12,
    component: "number",
    props: {
      min: 1,
    },
  },
  {
    name: "width",
    label: "宽度",
    span: 12,
    component: "number",
    props: {
      min: 1,
    },
  },
  {
    name: "xGap",
    label: "X轴间隔",
    span: 12,
    component: "number",
  },
  {
    name: "yGap",
    label: "Y轴间隔",
    span: 12,
    component: "number",
  },
  {
    name: "xOffset",
    label: "X轴偏移",
    span: 12,
    component: "number",
  },
  {
    name: "yOffset",
    label: "Y轴偏移",
    span: 12,
    component: "number",
  },
  {
    name: "zIndex",
    label: "层级",
    span: 12,
    component: "number",
  },
  {
    name: "textAlign",
    label: "对齐方式",
    component: "select",
    span: 12,
    props: {
      options: [
        { label: "左对齐", value: "left" },
        { label: "居中", value: "center" },
        { label: "右对齐", value: "right" },
      ],
    },
  },
];

const reset = () => watermark.reset();
</script>
