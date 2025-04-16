<template>
  <div class="editor-wrapper">
    <!-- 工具栏 -->
    <Toolbar
      id="toolbar-container"
      :editor="editorRef"
      :default-config="toolbarConfig"
      :mode="mode"
    />
    <!-- 编辑器 -->
    <Editor
      id="editor-container"
      v-model="modelValue"
      :style="{ height, overflowY: 'hidden' }"
      :default-config="editorConfig"
      :mode="mode"
      @on-change="handleChange"
      @on-created="handleCreated"
    />
  </div>
</template>
<script lang="ts">
export default { name: "WangEditor" };
</script>

<script setup lang="ts">
import type { IDomEditor, IEditorConfig, SlateElement } from "@wangeditor-next/editor";
import { Editor, Toolbar } from "@wangeditor-next/editor-for-vue";
import "@wangeditor-next/editor/dist/css/style.css";

// 文件上传 API
import FileAPI from "@/api/file";

type ImageElement = SlateElement & {
  src: string;
  alt: string;
  url: string;
  href: string;
};

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  height: {
    type: String,
    default: "400px",
  },
});

const emit = defineEmits(["update:modelValue"]);
const modelValue = useVModel(props, "modelValue", emit);

const editorRef = shallowRef(); // 编辑器实例，必须用 shallowRef
const mode = ref("default"); // 编辑器模式

// 工具条配置
const toolbarConfig = ref({
  // excludeKeys: ["group-video"], // 隐藏上传视频按钮
});
/* 上传 */
const fileType = ref<string[]>([".jpg", ".jpeg", ".png", ".gif", ".bpm", ".webp"]);
const fileSize = ref<number>(5);
// 编辑器配置
const editorConfig = ref<Partial<IEditorConfig>>({
  placeholder: "请输入内容",
  MENU_CONF: {
    uploadImage: {
      base64LimitSize: 5 * 1024, // 5kb
      allowedFileTypes: fileType.value,

      server: "", // 上传图片的服务器地址
      metaWithUrl: false, // 是否在上传图片时携带 url 参数
      onSuccess: (file, res) => {
        console.log("上传图片成功", file, res);
      },
      onFailed: (file, res) => {
        console.log("上传图片失败", file, res);
      },
      onError: (file, err) => {
        console.log("上传图片出错", file, err);
      },
      // 自定义图片上传
      customUpload(file, insertFn) {
        // 校检文件类型
        let fileExtension = "";

        if (file.name.lastIndexOf(".") > -1) {
          fileExtension = "." + file.name.slice(file.name.lastIndexOf(".") + 1);
        }

        if (!fileType.value.includes(fileExtension)) {
          window.$message.error(`文件格式不正确, 请上传 ${fileType.value.join(" / ")} 格式文件!`);

          return false;
        }

        // 校检文件大小
        const isLt = file.size / 1024 / 1024 < fileSize.value;

        if (!isLt) {
          window.$message.error(`上传文件大小不能超过 ${fileSize.value} MB!`);

          return false;
        }
        // console.log(file);
        // 自定义上传
        FileAPI.uploadFile(file).then((res) => {
          // 插入图片
          insertFn(res.url, res.name, res.url);
        });
      },
    },
    insertImage: {
      onInsertedImage(imageNode: ImageElement) {
        if (!imageNode) return;
        const { src, alt, url, href } = imageNode;

        console.log(
          imageNode,
          "inserted image",
          src,
          alt,
          url,
          href,
          editorRef.value.getElemsByType("image")
        );
      },
    },
  },
});

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
  /* nextTick(() => {
    const toolbar = DomEditor.getToolbar(editor);
    console.log(toolbar?.getConfig().toolbarKeys); //获取工具栏的配置
  }); */
};

const handleChange = (editor: IDomEditor) => {
  modelValue.value = editor.getHtml();
};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;

  if (editor == null) return;
  editor.destroy();
});

defineExpose({
  disabled: () => editorRef.value.disable(),
});
</script>

<style scoped lang="scss">
.w-e-text-container {
  min-height: 300px;
}
</style>
