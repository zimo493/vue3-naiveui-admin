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
        <span text-18px font-bold>{{ t("watermark.title") }}</span>
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
import { NEl, NSlider } from "naive-ui";

defineOptions({
  name: "SettingWatermark",
});

const { t } = useI18n();

const watermark = useWatermarkStoreHook();

const { config } = storeToRefs(watermark);

const formConfig: FormPro.FormItemConfig[] = [
  {
    name: "fontSize",
    label: t("watermark.fontSize"),
    component: "number",
    span: 12,
    props: { max: 28 },
  },
  {
    name: "fontColor",
    label: t("watermark.fontColor"),
    component: "color-picker",
    span: 12,
  },
  {
    name: "fontStyle",
    label: t("watermark.fontStyle.title"),
    component: "select",
    span: 12,
    props: {
      options: [
        { label: t("watermark.fontStyle.normal"), value: "normal" },
        { label: t("watermark.fontStyle.italic"), value: "italic" },
        { label: t("watermark.fontStyle.oblique"), value: "oblique" },
      ],
    },
  },
  {
    name: "fontWeight",
    label: t("watermark.fontWeight"),
    component: "number",
    span: 12,
    props: { min: 100, max: 900, step: 100 },
  },
  {
    name: "rotate",
    label: t("watermark.rotate"),
    span: 12,
    component: () => <NSlider v-model:value={config.value.rotate} min={-90} max={90} />,
  },
  {
    name: "globalRotate",
    label: t("watermark.globalRotate"),
    span: 12,
    component: () => <NSlider v-model:value={config.value.globalRotate} min={-180} max={180} />,
  },
  {
    name: "cross",
    label: t("watermark.cross"),
    component: "switch",
    span: 12,
    props: { round: false },
    slots: {
      checked: () => <NEl>{t("common.yes")}</NEl>,
      unchecked: () => <NEl>{t("common.no")}</NEl>,
    },
  },
  {
    name: "lineHeight",
    label: t("watermark.lineHeight"),
    span: 12,
    component: "number",
    props: { min: 1 },
  },
  {
    name: "height",
    label: t("watermark.height"),
    span: 12,
    component: "number",
    props: { min: 1 },
  },
  { name: "width", label: t("watermark.width"), span: 12, component: "number", props: { min: 1 } },
  { name: "xGap", label: t("watermark.xGap"), span: 12, component: "number" },
  { name: "yGap", label: t("watermark.yGap"), span: 12, component: "number" },
  { name: "xOffset", label: t("watermark.xOffset"), span: 12, component: "number" },
  { name: "yOffset", label: t("watermark.yOffset"), span: 12, component: "number" },
  { name: "zIndex", label: t("watermark.zIndex"), span: 12, component: "number" },
  {
    name: "textAlign",
    label: t("watermark.textAlign.title"),
    component: "select",
    span: 12,
    props: {
      options: [
        { label: t("watermark.textAlign.left"), value: "left" },
        { label: t("watermark.textAlign.center"), value: "center" },
        { label: t("watermark.textAlign.right"), value: "right" },
      ],
    },
  },
];

const reset = () => watermark.reset();
</script>
