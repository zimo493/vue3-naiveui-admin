<template>
  <n-modal
    v-model:show="visible"
    preset="card"
    title="图片裁剪"
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
          <!-- <div class="avatar-upload-preview">
          <img :src="previews.url" :style="previews.img" />
        </div> -->
          <div flex-center h-450px v-html="previews.html" />
        </n-gi>
      </n-grid>
      <n-grid x-gap="10">
        <n-gi :span="14">
          <n-flex justify="space-between">
            <div>
              <n-upload>
                <n-button strong type="success">
                  <template #icon>
                    <Icones icon="ant-design:cloud-upload-outlined" />
                  </template>
                  上传文件
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
            请上传
            <template v-if="fileSize">
              大小不超过
              <n-text type="error">{{ fileSize }}MB</n-text>
            </template>
            <template v-if="fileType">
              格式为
              <n-text type="error">{{ fileType.join(" / ") }}</n-text>
            </template>
            的文件
          </n-text>
        </n-gi>
        <n-gi :span="10">
          <n-flex justify="center">
            <n-button type="primary">
              <template #icon>
                <Icones icon="ant-design:check-outlined" />
              </template>
              提交
            </n-button>
          </n-flex>
        </n-gi>
      </n-grid>
    </n-flex>
  </n-modal>
</template>
<script setup lang="tsx">
import { VueCropper } from "vue-cropper";
import "vue-cropper/dist/index.css";

interface Previews {
  img: string;
  url: string;
  html: string;
}

const props = defineProps({
  image: { type: String, default: "" },
  width: { type: Number, default: 800 },
});

defineExpose({
  open: () => {
    console.log(11111);

    visible.value = true;
    option.img = props.image;
  },
});

const visible = ref(false);

const fileType = ref<string[]>(["png", "jpg", "jpeg"]); // 文件格式
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

/** 取消 */
const cancel = () => {
  visible.value = false;
};
</script>
