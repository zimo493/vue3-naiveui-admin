<template>
  <n-upload
    v-model:file-list="fileList"
    :max="limit"
    :accept="accept"
    :list-type="type"
    :multiple="limit > 1"
    :directory-dnd="drag"
    :custom-request="customRequest"
    :on-error="handleError"
    :on-remove="handleRemove"
    :on-finish="handleFinish"
    v-bind="$attrs"
    @before-upload="beforeUpload"
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

import FileAPI, { type FileInfo } from "@/api/file";
import { InquiryBox } from "@/utils";

// 定义初始类型引用
type ModelValueType = "string" | "string-array" | "fileinfo" | "fileinfo-array";

// 推拽上传配置
interface DragOptions {
  icon?: string;
  iconSize?: number;
  title?: string;
}

const initialModelValueType = ref<ModelValueType>("string");
const initModelValueType = ref<boolean>(false); // 初始类型是否已经初始化过

const props = defineProps({
  /**
   * 请求携带的额外参数
   */
  data: {
    type: Object,
    default: () => {
      return {};
    },
  },
  /**
   * 上传文件的参数名
   */
  name: { type: String, default: "file" },
  /**
   * 文件上传数量限制
   */
  limit: { type: Number, default: 10 },
  /**
   * 单个文件的最大允许大小
   */
  maxFileSize: { type: Number, default: 10 },
  /**
   * 上传文件类型
   */
  accept: {
    type: String,
    default: "image/*", //  默认支持所有图片格式 ，如果需要指定格式，格式如下：'.png,.jpg,.jpeg,.gif,.bmp'
  },
  /**
   * 上传组件类型
   */
  type: { type: String as PropType<"text" | "image" | "image-card">, default: "image-card" },
  /**
   * 是否支持多选
   */
  multiple: {
    type: Boolean,
    default: true,
  },
  /**
   * 是否支持拖拽上传
   */
  drag: { type: Boolean, default: false },
  /**
   * 拖拽上传配置
   */
  dragOptions: {
    type: Object as PropType<DragOptions>,
    default: () => {
      return {
        icon: "ep:upload-filled",
        iconSize: 56,
        title: "点击此处 或 拖动文件到该区域进行上传",
      };
    },
  },
});

// 不在defineModel中引用props，避免被提升到setup函数外部
const modelValue = defineModel("modelValue", {
  type: [Array, String, Object] as PropType<string[] | string | FileInfo[] | FileInfo>,
  default: undefined,
});

// 内部使用数组管理文件列表
const internalValue = computed({
  get: () => {
    // 如果modelValue未定义，根据limit设置默认值
    if (modelValue.value === undefined) {
      return props.limit === 1 ? [] : [];
    }

    // 处理不同类型的modelValue
    if (typeof modelValue.value === "string") {
      // 字符串类型（单图/文件模式）转为数组
      return modelValue.value ? [modelValue.value] : [];
    } else if (Array.isArray(modelValue.value)) {
      // 数组类型（可能是字符串数组或FileInfo数组）
      return modelValue.value;
    } else if (modelValue.value && typeof modelValue.value === "object") {
      // 单个FileInfo对象
      return [modelValue.value];
    }

    return [];
  },
  set: (val: Array<string | FileInfo>) => {
    if (val.length === 0) {
      // 根据初始类型设置空值
      switch (initialModelValueType.value) {
        case "string":
          modelValue.value = "";
          break;
        case "fileinfo":
          modelValue.value = {} as FileInfo;
          break;
        case "string-array":
        case "fileinfo-array":
          modelValue.value = [];
          break;
        default:
          modelValue.value = props.limit === 1 ? "" : [];
      }
    } else {
      // 原有逻辑处理非空情况
      if (
        typeof modelValue.value === "string" ||
        (props.limit === 1 && modelValue.value === undefined)
      ) {
        modelValue.value = val[0]
          ? typeof val[0] === "string"
            ? val[0]
            : (val[0] as FileInfo).url
          : "";
      } else if (Array.isArray(modelValue.value)) {
        if (initialModelValueType.value === "fileinfo-array") {
          modelValue.value = val as FileInfo[];
        } else {
          modelValue.value = val.map((item) => (typeof item === "string" ? item : item.url));
        }
      } else if (modelValue.value && typeof modelValue.value === "object") {
        modelValue.value = val.length > 0 ? val[0] : [];
      } else {
        modelValue.value = props.limit === 1 ? "" : [];
      }
    }
  },
});

const fileList = ref<UploadFileInfo[]>([]);

const setFileList = (val: string[] | string | FileInfo[] | FileInfo) => {
  // 如果modelValue未定义，设置默认值
  if (val === undefined) {
    modelValue.value = props.limit === 1 ? "" : [];
  }

  // 根据internalValue初始化文件列表
  fileList.value = internalValue.value.map((item, idx) => {
    // 处理不同类型的item
    if (typeof item === "string") {
      // 如果是字符串（URL），尝试从URL中提取文件名
      let name = item;

      if (props.type === "text") {
        // 从URL中提取文件名
        const urlParts = item.split("/");

        if (urlParts.length > 0) {
          name = urlParts[urlParts.length - 1];
          // 如果URL包含查询参数，去除它们
          const queryParamIndex = name.indexOf("?");

          if (queryParamIndex > 0) {
            name = name.substring(0, queryParamIndex);
          }
        }
      }

      return {
        id: idx.toString(),
        url: item,
        name: name,
        status: "finished",
      };
    } else {
      // 如果是FileInfo对象，直接使用其name和url属性
      return {
        id: idx.toString(),
        url: item.url,
        name: item.name,
        status: "finished",
      };
    }
  });

  if (!initModelValueType.value) {
    // 确定初始类型
    if (val === undefined) {
      initialModelValueType.value = props.limit === 1 ? "string" : "string-array";
    } else {
      if (typeof val === "string") {
        initialModelValueType.value = "string";
      } else if (Array.isArray(val)) {
        if (val.length > 0) {
          initialModelValueType.value =
            typeof val[0] === "object" ? "fileinfo-array" : "string-array";
        } else {
          // 空数组，根据其他条件推断（例如 accept 或 type）
          initialModelValueType.value = props.type === "text" ? "fileinfo-array" : "string-array";
        }
      } else if (val && typeof val === "object") {
        initialModelValueType.value = "fileinfo";
      }
    }
    initModelValueType.value = true;
  }
};

// watchEffect(async () => {
//   await nextTick();
//   setFileList(modelValue.value);
// });

watch(
  () => modelValue.value,
  (val) => {
    nextTick(() => setFileList(val));
  },
  { deep: true, immediate: true }
);

/** 自定义上传 */
const customRequest = ({ file, onFinish, onError, onProgress }: UploadCustomRequestOptions) => {
  const formData = new FormData();

  formData.append(props.name, file.file as File);
  // 添加参数处理
  Object.entries(props.data).forEach(([key, val]) => formData.append(key, val));

  FileAPI.upload(formData, (e) => {
    onProgress({ percent: Math.round((e.loaded / Number(e.total)) * 100) });
  })
    .then((result) => {
      // 设置文件URL和文件名
      file.url = result.url;

      // 如果是文件类型，确保文件名正确设置
      file.name = props.type === "text" ? file.file?.name || file.name : file.name;

      onFinish();
    })
    .catch((err) => {
      onError();
      console.log(err);
    });
};

const beforeUpload = (data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => {
  const file = data.file.file;

  if (!file) {
    return false;
  }

  // 校验文件类型：虽然 accept 属性限制了用户在文件选择器中可选的文件类型，但仍需在上传时再次校验文件实际类型，确保符合 accept 的规则
  const acceptTypes = props.accept.split(",").map((type) => type.trim());

  // 检查文件格式是否符合 accept
  const isValidType = acceptTypes.some((type) => {
    if (["*", "*.*"].includes(props.accept)) {
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
    window.$message.error(`上传文件的格式不正确，请上传格式为 ${props.accept} 的文件`);

    return false;
  }

  // 限制文件大小
  if (file.size > props.maxFileSize * 1024 * 1024) {
    window.$message.error("上传文件大小不能大于" + props.maxFileSize + "M");

    return false;
  }

  return true;
};

// 修改 handleFinish 中的类型判断
const handleFinish = ({ file }: { file: UploadFileInfo }) => {
  if (file?.url) {
    const newValue = [...internalValue.value];
    // 根据初始类型决定添加的数据类型
    const isFileInfoType = initialModelValueType.value === "fileinfo-array";

    if (isFileInfoType) {
      newValue.push({ name: file.name, url: file.url });
    } else {
      newValue.push(file.url);
    }

    internalValue.value = newValue;
  }
  window.$message.success("上传成功");
};

/**
 * 上传失败回调
 */
const handleError = ({ file }: { file: UploadFileInfo }) => {
  console.log("上传失败: " + file.name);
};

/**
 * 删除文件
 */
const handleRemove = async ({ file }: { file: UploadFileInfo }): Promise<boolean> => {
  try {
    const confirmResult = await InquiryBox(`确定删除 ${file.name} 吗？`);

    if (confirmResult) {
      const currentValue = [...internalValue.value];
      // 检查是否为FileInfo类型（即使删除后数组为空，也要保持一致的类型）
      const isFileInfoType =
        (Array.isArray(modelValue.value) &&
          modelValue.value.length > 0 &&
          typeof modelValue.value[0] === "object") ||
        (!Array.isArray(modelValue.value) &&
          modelValue.value &&
          typeof modelValue.value === "object") ||
        (Array.isArray(internalValue.value) &&
          internalValue.value.some(
            (item) => typeof item === "object" && "name" in item && "url" in item
          ));

      // 查找要删除的文件
      const idx = currentValue.findIndex((item) => {
        if (typeof item === "string") {
          return item === file.url;
        } else {
          return item.url === file.url;
        }
      });

      if (idx !== -1) {
        // 获取要删除的URL
        const [delItem] = currentValue.splice(idx, 1);
        const delUrl = typeof delItem === "string" ? delItem : delItem.url;

        // 确保 FileAPI.delete 返回一个 Promise
        await FileAPI.delete(delUrl);

        window.$message.success("删除成功");
        // 保持类型一致性，即使数组为空
        internalValue.value = currentValue;
        // 如果删除后数组为空，但原始类型是FileInfo，确保modelValue保持正确类型
        if (currentValue.length === 0 && isFileInfoType) {
          if (props.limit === 1) {
            // 单文件模式，保持为空的FileInfo数组
            modelValue.value = [];
          } else {
            // 多文件模式，保持为空的FileInfo数组
            modelValue.value = [];
          }
        }

        return true; // 删除成功返回 true
      }
    }

    return false; // 用户取消或未找到文件时返回 false
  } catch (err) {
    console.log(err);

    return false; // 捕获错误时返回 false
  }
};
</script>
