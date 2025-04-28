<template>
  <n-form label-placement="left" :label-width="100">
    <n-form-item label="单图上传">
      <n-flex vertical w="[50%]">
        <UploadFile v-model="picUrlStr" :limit="1" />
        <n-code :code="JSON.stringify(picUrlStr, null, 2)" language="json" />
      </n-flex>
    </n-form-item>

    <n-form-item label="单图上传">
      <n-flex vertical w="[50%]">
        <UploadFile v-model="picUrlArr" :limit="1" />
        <n-code :code="JSON.stringify(picUrlArr, null, 2)" language="json" />
      </n-flex>
    </n-form-item>

    <n-form-item label="多图上传">
      <n-flex vertical w="[50%]">
        <UploadFile v-model="picUrls" />
        <n-code :code="JSON.stringify(picUrls, null, 2)" language="json" />
      </n-flex>
    </n-form-item>

    <n-form-item label="多图上传">
      <n-flex vertical w="[50%]">
        <UploadFile v-model="picUrlInfos" type="image">
          <n-button strong secondary type="primary">点我上传图片</n-button>
        </UploadFile>
        <n-code :code="JSON.stringify(picUrlInfos, null, 2)" language="json" />
      </n-flex>
    </n-form-item>

    <n-form-item label="单文件上传">
      <n-flex vertical w="[50%]">
        <n-alert type="info" title="没有name属性则从url中提取文件名" />
        <UploadFile v-model="fileUrl" type="text" :limit="1" accept=".pdf,.doc,.docx,.xls,.xlsx">
          <n-button type="primary">文件上传</n-button>
        </UploadFile>
        <n-code :code="JSON.stringify(fileUrl, null, 2)" language="json" />
      </n-flex>
    </n-form-item>

    <n-form-item label="多文件上传">
      <n-flex vertical w="[50%]">
        <n-alert type="info" title="自定义文件名" />
        <UploadFile v-model="fileUrls" type="text" accept="*.*" :limit="3">
          <n-button type="primary">文件上传</n-button>
        </UploadFile>
        <n-code :code="JSON.stringify(fileUrls, null, 2)" language="json" />
      </n-flex>
    </n-form-item>

    <n-form-item label="拖拽上传">
      <n-flex vertical w="[50%]">
        <UploadFile v-model="dragFileUrls" type="text" accept="*.*" :limit="2" drag>
          <!-- 自定义拖拽区显示的内容 -->
          <n-p depth="3" style="margin: 8px 0 0">请不要上传敏感数据，以免造成不必要的损失</n-p>
        </UploadFile>
        <n-code :code="JSON.stringify(dragFileUrls, null, 2)" language="json" />
      </n-flex>
    </n-form-item>
  </n-form>
</template>
<script lang="tsx" setup>
import type { FileInfo } from "@/api/file";

const asyncData = (data: string[]) => {
  return new Promise<string[]>((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 2000);
  });
};

// 单图上传
const picUrlStr = ref<string>("");
const picUrlArr = ref<string[]>([]);

// 多图上传
const picUrls = ref<string[]>([]);

// 使用onMounted和async/await确保数据正确加载
onMounted(async () => {
  picUrlStr.value = "https://s2.loli.net/2023/05/24/yNsxFC8rLHMZQcK.jpg";
  picUrlArr.value = await asyncData([
    "https://foruda.gitee.com/images/1723603502796844527/03cdca2a_716974.gif",
  ]);
  picUrls.value = await asyncData([
    "https://s2.loli.net/2023/05/24/yNsxFC8rLHMZQcK.jpg",
    "https://foruda.gitee.com/images/1723603502796844527/03cdca2a_716974.gif",
  ]);
});

const picUrlInfos = ref<FileInfo[]>([
  { name: "自定义图片名.jpg", url: "https://s2.loli.net/2023/05/24/yNsxFC8rLHMZQcK.jpg" },
  {
    name: "头像.gif",
    url: "https://foruda.gitee.com/images/1723603502796844527/03cdca2a_716974.gif",
  },
]);

// 单文件上传
// const fileUrl = ref<FileInfo>({
//   name: "自定义文件名.pdf",
//   url: "https://example.com/documents/sample.pdf",
// });
const fileUrl = ref<string>("https://example.com/documents/contract.docx");
// const fileUrl = ref<FileInfo[]>([
//   { name: "自定义文件名.pdf", url: "https://example.com/documents/sample.pdf" },
// ]);

// 文件上传（使用FileInfo接口，支持自定义文件名）
const fileUrls = ref<FileInfo[]>([
  { name: "自定义文件名.pdf", url: "https://example.com/documents/sample.pdf" },
  { name: "季度报表.xlsx", url: "https://example.com/documents/report.xlsx" },
]);

// 拖拽上传
const dragFileUrls = ref<FileInfo[]>([
  { name: "季度报表.xlsx", url: "https://example.com/documents/report.xlsx" },
]);
</script>
