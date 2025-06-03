<template>
  <n-spin v-if="loading" />
  <n-upload
    v-else
    v-model:file-list="fileList"
    :max="limit"
    :accept="accept"
    :list-type="type"
    :multiple="limit > 1 ? multiple : false"
    :directory-dnd="drag"
    :custom-request="customRequest"
    :on-error="handleError"
    :on-remove="handleRemove"
    :on-finish="handleFinish"
    :on-before-upload="beforeUpload"
    v-bind="$attrs"
  >
    <n-upload-dragger v-if="drag">
      <div style="margin-bottom: 12px">
        <Icones :icon="dragOptions.icon" :size="dragOptions.iconSize" />
      </div>
      <n-text style="font-size: 16px">{{ dragOptions.title }}</n-text>
      <slot />
    </n-upload-dragger>
    <slot v-else />
  </n-upload>
</template>
<script lang="tsx" setup>
import type { PropType } from "vue";
import type { UploadCustomRequestOptions, UploadFileInfo } from "naive-ui";

import { InquiryBox } from "@/utils";

import FileAPI, { type FileInfo } from "@/api/file";

type PassValue = string[] | string | FileInfo[] | FileInfo | undefined;

// 推拽上传配置
interface DragOptions {
  icon?: string;
  iconSize?: number;
  title?: string;
}

interface RemoveFile extends FileInfo {
  idx: number;
}

/** 自定义事件 */
const emit = defineEmits({
  upload: (val: FileInfo) => val,
  remove: (val: RemoveFile) => val,
});

const {
  value = [],
  data = {},
  name = "file",
  limit = 10,
  maxFileSize = 10,
  accept = "image/*",
  type = "image-card",
  multiple = true,
  drag = false,
  dragOptions = {
    icon: "ep:upload-filled",
    iconSize: 50,
    title: "点击此处 或 拖动文件到该区域进行上传",
  },
  loading = false,
} = defineProps({
  /**
   * 文件上传值
   */
  value: {
    type: [Array, String, Object] as PropType<PassValue>,
  },
  /**
   * 请求携带的额外参数
   */
  data: { type: Object },
  /**
   * 上传文件的参数名
   */
  name: { type: String },
  /**
   * 文件上传数量限制
   */
  limit: { type: Number },
  /**
   * 单个文件的最大允许大小
   */
  maxFileSize: { type: Number },
  /**
   * 上传文件类型
   * - 默认支持所有图片格式 ，如果需要指定格式，格式如下：'.png,.jpg,.jpeg,.gif,.bmp'
   */
  accept: { type: String },
  /**
   * 上传组件类型
   */
  type: { type: String as PropType<"text" | "image" | "image-card"> },
  /**
   * 是否支持多选
   */
  multiple: { type: Boolean },
  /**
   * 是否支持拖拽上传
   */
  drag: { type: Boolean },
  /**
   * 拖拽上传配置
   */
  dragOptions: { type: Object as PropType<DragOptions> },
  /**
   * 是否显示加载中
   */
  loading: { type: Boolean },
});

const fileList = ref<UploadFileInfo[]>([]);

// 提取文件名从URL的逻辑
const extractFileNameFromUrl = (url: string): string => {
  const urlParts = url.split("/");
  let name = urlParts.length > 0 ? urlParts[urlParts.length - 1] : url;
  const queryParamIndex = name.indexOf("?");

  if (queryParamIndex > 0) {
    name = name.substring(0, queryParamIndex);
  }

  return name;
};

/** 设置文件项 */
const setFileItem = (url: string, name?: string): UploadFileInfo => ({
  url,
  id: Math.random().toString(36).substring(2),
  name: name || extractFileNameFromUrl(url),
  status: "finished",
});

/** 设置文件列表 */
const setFileList = (val: PassValue) => {
  if (!val || (Array.isArray(val) && val.length === 0)) {
    fileList.value = [];

    return;
  }
  if (Array.isArray(val)) {
    fileList.value = val.map((item) =>
      typeof item === "string" ? setFileItem(item) : setFileItem(item.url, item.name)
    );
  } else if (typeof val === "string") {
    fileList.value = [setFileItem(val)];
  } else {
    fileList.value = [setFileItem(val.url, val.name)];
  }
};

watch(
  () => value,
  (val) => nextTick(() => val && setFileList(val)),
  { deep: true, immediate: true }
);

/** 自定义上传 */
const customRequest = ({ file, onFinish, onError, onProgress }: UploadCustomRequestOptions) => {
  const formData = new FormData();

  formData.append(name, file.file as File);
  // 添加参数处理
  Object.entries(data).forEach(([key, val]) => formData.append(key, val));

  FileAPI.upload(formData, (e) => {
    onProgress({ percent: Math.round((e.loaded / Number(e.total)) * 100) });
  })
    .then((result) => {
      // 设置文件URL和文件名
      file.url = result.url;
      file.name = result.name;
      onFinish();
    })
    .catch((err) => {
      onError();
      console.log(err);
    });
};

/** 上传文件前校验 */
const beforeUpload = (data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => {
  const file = data.file.file;

  if (!file) {
    return false;
  }

  // 校验文件类型：虽然 accept 属性限制了用户在文件选择器中可选的文件类型，但仍需在上传时再次校验文件实际类型，确保符合 accept 的规则
  const acceptTypes = accept.split(",").map((type) => type.trim());

  // 检查文件格式是否符合 accept
  const isValidType = acceptTypes.some((type) => {
    if (["*", "*.*"].includes(accept)) {
      return true;
    } else if (type === "image/*") {
      // 如果是 image/*，检查 MIME 类型是否以 "image/" 开头
      return file.type.startsWith("image/");
    } else if (type.startsWith(".")) {
      // 如果是扩展名 (.png, .jpg)，检查文件名是否以指定扩展名结尾
      return file.name.toLowerCase().endsWith(type);
    } else {
      // 如果是具体的 MIME 类型 (image/png, image/jpeg)，检查是否完全匹配
      return file.type === type;
    }
  });

  if (!isValidType) {
    window.$message.error(`上传文件的格式不正确，请上传格式为 ${accept} 的文件`);

    return false;
  }

  // 限制文件大小
  if (file.size > maxFileSize * 1024 * 1024) {
    window.$message.error("上传文件大小不能大于" + maxFileSize + "M");

    return false;
  }

  return true;
};

/** 上传成功回调 */
const handleFinish = ({ file }: { file: UploadFileInfo }) => {
  if (file?.url) {
    emit("upload", { url: file.url, name: file.name });
  }
  window.$message.success("上传成功");
};

/** 上传失败回调 */
const handleError = ({ file }: { file: UploadFileInfo }) => {
  console.log("上传失败: " + file.name);
};

/** 删除文件 */
const handleRemove = async ({
  file,
  index,
}: {
  file: UploadFileInfo;
  index: number;
}): Promise<boolean> => {
  try {
    const confirmResult = await InquiryBox(`确定删除 ${file.name} 吗？`);

    if (confirmResult) {
      if (file.status === "error") return true;
      const url = file.url ?? "";

      await FileAPI.delete(url);
      emit("remove", { url, name: file.name, idx: index });
      window.$message.success("删除成功");

      return true;
    }

    return false; // 用户取消或未找到文件时返回 false
  } catch (err) {
    console.log(err);

    return false; // 捕获错误时返回 false
  }
};
</script>
