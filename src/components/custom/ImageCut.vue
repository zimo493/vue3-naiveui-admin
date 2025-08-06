<template>
  <n-modal
    v-model:show="visible"
    preset="card"
    :title="t('components.upload.cut')"
    :on-mask-click="cancel"
    :style="{ width: width + 'px' }"
    :segmented="{ content: true, action: true }"
    @close="cancel"
  >
    <n-flex vertical :size="[0, 16]">
      <n-grid x-gap="10">
        <n-gi h-450px :span="14">
          <VueCropper v-if="visible" ref="cropper" v-bind="option" @real-time="realTime" />
        </n-gi>
        <n-gi :span="10">
          <div flex-center h-450px v-html="previews.html" />
        </n-gi>
      </n-grid>
      <n-grid x-gap="10">
        <n-gi :span="14">
          <n-flex justify="space-between" mb-10px>
            <div>
              <n-upload
                :show-file-list="false"
                :default-upload="false"
                :on-change="handelChange"
                :on-before-upload="beforeUpload"
              >
                <n-button strong type="success">
                  <template #icon>
                    <Icones icon="ant-design:cloud-upload-outlined" />
                  </template>
                  {{ t("components.upload.select") }}
                </n-button>
              </n-upload>
            </div>
            <n-flex>
              <n-button secondary @click="changeScale(1)">
                <template #icon>
                  <Icones icon="ant-design:plus-outlined" />
                </template>
              </n-button>
              <n-button secondary @click="changeScale(-1)">
                <template #icon>
                  <Icones icon="ant-design:minus-outlined" />
                </template>
              </n-button>
              <n-button secondary @click="rotateLeft()">
                <template #icon>
                  <Icones icon="ant-design:rotate-left-outlined" />
                </template>
              </n-button>
              <n-button secondary @click="rotateRight()">
                <template #icon>
                  <Icones icon="ant-design:rotate-right-outlined" />
                </template>
              </n-button>
            </n-flex>
          </n-flex>
          <n-text>
            {{ t("components.upload.promptStart") }}
            <template v-if="fileSize">
              {{ t("components.upload.sizeLimit") }}
              <n-text type="error">{{ fileSize }}MB</n-text>
            </template>
            <template v-if="fileType">
              {{ t("components.upload.fileTypes") }}
              <n-text type="error">{{ fileType.join(" / ") }}</n-text>
            </template>
            {{ t("components.upload.promptEnd") }}
          </n-text>
        </n-gi>
        <n-gi :span="10">
          <n-flex justify="center">
            <n-button type="primary" :loading="loading" @click="submit">
              <template #icon>
                <Icones icon="ant-design:check-outlined" />
              </template>
              {{ t("button.submit") }}
            </n-button>
          </n-flex>
        </n-gi>
      </n-grid>
    </n-flex>
  </n-modal>
</template>
<script setup lang="tsx">
import type { UploadFileInfo } from "naive-ui";

import { useLoading } from "@/hooks";

import { VueCropper } from "vue-cropper";
import "vue-cropper/dist/index.css";

interface Previews {
  img: string;
  url: string;
  html: string;
}

const { image = "", width = 800 } = defineProps({
  image: { type: String },
  width: { type: Number },
});

const { t } = useI18n();

const { loading, startLoading, endLoading } = useLoading();

const emit = defineEmits({
  submit: (val: File) => val,
});

const visible = ref(false);

const fileType = ref<string[]>(["png", "jpg", "jpeg", "webp"]); // 文件格式
const fileSize = ref<number>(5); //文件大小

const option = reactive({
  img: "", // 裁剪图片的地址 url 地址, base64, blob
  outputSize: 1, // 裁剪生成图片的质量
  outputType: "jpeg", // 裁剪生成图片的格式 jpeg, png, webp
  info: true, // 裁剪框的大小信息
  canScale: true, // 图片是否允许滚轮缩放
  autoCrop: true, // 是否默认生成截图框
  autoCropWidth: 200, // 默认生成截图框宽度
  autoCropHeight: 200, // 默认生成截图框高度
  fixedBox: false, // 固定截图框大小 不允许改变
  fixed: true, // 是否开启截图框宽高固定比例，这个如果设置为true，截图框会是固定比例缩放的，如果设置为false，则截图框的狂宽高比例就不固定了
  fixedNumber: [1, 1], // 截图框的宽高比例 [ 宽度 , 高度 ]
  canMove: true, // 上传图片是否可以移动
  canMoveBox: true, // 截图框能否拖动
  original: false, // 上传图片按照原始比例渲染
  centerBox: true, // 截图框是否被限制在图片里面
  infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
  full: true, // 是否输出原图比例的截图
  enlarge: "1", // 图片根据截图框输出比例倍数
  mode: "contain", // 图片默认渲染方式 contain , cover, 100px, 100% auto
});

const cropper = ref();

/** 向左旋转图片 */
const rotateLeft = () => cropper.value?.rotateLeft();

/** 向右旋转图片 */
const rotateRight = () => cropper.value?.rotateRight();
/**
 * 图片缩放
 * @param num 缩放比例
 */
const changeScale = (num: number) => cropper.value?.changeScale(num);

/** 预览图片 */
const previews = ref<Previews>({ img: "", url: "", html: "" });

/** 实时预览 */
const realTime = (data: Previews) => (previews.value = data);

/** 上传文件前校验 */
const beforeUpload = (data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => {
  const file = data.file.file;

  if (!file) {
    return false;
  }

  // 校检文件类型
  if (fileType.value) {
    let fileExtension = "";

    if (file.name.lastIndexOf(".") > -1) {
      fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
    }
    const isTypeOk = fileType.value.some((type) => {
      if (file.type.indexOf(type) > -1) return true;

      return !!(fileExtension && fileExtension.indexOf(type) > -1);
    });

    if (!isTypeOk) {
      window.$message.error(
        t("components.upload.incorrectFormat", { type: fileType.value.join(" / ") })
      );

      return false;
    }
  }

  // 校检文件大小
  if (fileSize.value) {
    const isLt = file.size / 1024 / 1024 < fileSize.value;

    if (!isLt) {
      window.$message.error(t("components.upload.incorrectSize", { size: fileSize.value }));

      return false;
    }
  }

  return true;
};

const fileName = ref(""); // 文件名
/** 提取文件名从URL的逻辑 */
const extractFileNameFromUrl = (url: string): string => {
  const urlParts = url.split("/");
  let name = urlParts.length > 0 ? urlParts[urlParts.length - 1] : url;
  const queryParamIndex = name.indexOf("?");

  if (queryParamIndex > 0) {
    name = name.substring(0, queryParamIndex);
  }

  return name;
};
/** 上传改变 */
const handelChange = (data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => {
  fileName.value = data.file.name;
  option.img = URL.createObjectURL(data.file.file as File);
};

/** 提交 */
const submit = () => {
  cropper.value?.getCropBlob((data: Blob) => {
    const file = new File([data], fileName.value, { type: data.type });

    emit("submit", file);
  });
};

/** 取消 */
const cancel = () => {
  previews.value = { img: "", url: "", html: "" };
  option.img = "";
  visible.value = false;
};

/** 暴露 */
defineExpose({
  open: () => {
    visible.value = true;
    option.img = image;
    fileName.value = image ? extractFileNameFromUrl(image) : "avatar.jpeg";
  },
  close: () => cancel(),
  startLoading: () => startLoading(),
  endLoading: () => endLoading(),
});
</script>
