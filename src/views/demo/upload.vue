<template>
  <n-form label-placement="left" :label-width="100">
    <n-form-item label="单图上传">
      <n-flex vertical w="[50%]">
        <UploadFile
          :value="picUrlStr"
          :limit="1"
          @upload="(val) => (picUrlStr = val.url)"
          @remove="picUrlStr = ''"
        />
        <n-code :code="JSON.stringify(picUrlStr, null, 2)" language="json" />
      </n-flex>
    </n-form-item>

    <n-form-item label="单图上传">
      <n-flex vertical w="[50%]">
        <UploadFile
          :value="picUrlArr"
          :limit="1"
          :loading="loading"
          @upload="(val) => picUrlArr.push(val.url)"
          @remove="(val) => picUrlArr.splice(picUrlArr.indexOf(val.url), 1)"
        />
        <n-code :code="JSON.stringify(picUrlArr, null, 2)" language="json" />
      </n-flex>
    </n-form-item>

    <n-form-item label="单图上传">
      <n-flex vertical w="[50%]">
        <UploadFile
          :value="picUrlObj"
          :limit="1"
          @upload="(val) => (picUrlObj = val)"
          @remove="picUrlObj = undefined"
        />
        <n-code :code="JSON.stringify(picUrlObj, null, 2)" language="json" />
      </n-flex>
    </n-form-item>

    <n-form-item label="多图上传">
      <n-flex vertical w="[50%]">
        <UploadFile
          :value="picUrls"
          :loading="loading2"
          @upload="(val) => picUrls.push(val.url)"
          @remove="(val) => removeFileByIndex(picUrls, val, val.idx)"
        />
        <n-code :code="JSON.stringify(picUrls, null, 2)" language="json" />
      </n-flex>
    </n-form-item>

    <n-form-item label="多图上传">
      <n-flex vertical w="[50%]">
        <UploadFile
          :value="picUrlInfos"
          type="image"
          @upload="(val) => picUrlInfos.push(val)"
          @remove="(val) => removeFile(picUrlInfos, val)"
        >
          <n-button strong secondary type="primary">点我上传图片</n-button>
        </UploadFile>
        <n-code :code="JSON.stringify(picUrlInfos, null, 2)" language="json" />
      </n-flex>
    </n-form-item>

    <n-form-item label="单文件上传">
      <n-flex vertical w="[50%]">
        <n-alert type="info" title="没有name属性则从url中提取文件名" />
        <UploadFile
          :value="fileUrl"
          type="text"
          :limit="1"
          accept=".pdf,.doc,.docx,.xls,.xlsx"
          @upload="(val) => (fileUrl = val.url)"
          @remove="fileUrl = ''"
        >
          <n-button type="primary">文件上传</n-button>
        </UploadFile>
        <n-code :code="JSON.stringify(fileUrl, null, 2)" language="json" />
      </n-flex>
    </n-form-item>

    <n-form-item label="多文件上传">
      <n-flex vertical w="[50%]">
        <n-alert type="info" title="自定义文件名" />
        <UploadFile
          :value="fileUrls"
          type="text"
          accept="*.*"
          :limit="3"
          @upload="(val) => fileUrls.push(val)"
          @remove="(val) => removeFile(fileUrls, val)"
        >
          <n-button type="primary">文件上传</n-button>
        </UploadFile>
        <n-code :code="JSON.stringify(fileUrls, null, 2)" language="json" />
      </n-flex>
    </n-form-item>

    <n-form-item label="拖拽上传">
      <n-flex vertical w="[50%]">
        <UploadFile
          :value="dragFileUrls"
          :limit="2"
          drag
          type="text"
          accept="*.*"
          @upload="(val) => dragFileUrls.push(val.url)"
          @remove="(val) => dragFileUrls.splice(dragFileUrls.indexOf(val.url), 1)"
        >
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

const loading = ref(false);
const loading2 = ref(false);

onMounted(async () => {
  picUrlStr.value = "https://s2.loli.net/2023/05/24/yNsxFC8rLHMZQcK.jpg";
  loading.value = true;
  loading2.value = true;
  picUrlArr.value = await asyncData([
    "https://foruda.gitee.com/images/1723603502796844527/03cdca2a_716974.gif",
  ]);
  loading.value = false;
  picUrls.value = await asyncData([
    "https://s2.loli.net/2023/05/24/yNsxFC8rLHMZQcK.jpg",
    "https://foruda.gitee.com/images/1723603502796844527/03cdca2a_716974.gif",
    "https://s2.loli.net/2023/05/24/yNsxFC8rLHMZQcK.jpg",
  ]);
  loading2.value = false;
});

const asyncData = (data: string[]) =>
  new Promise<string[]>((resolve) => setTimeout(() => resolve(data), 2000));

// 单图上传
const picUrlStr = ref<string>("");
const picUrlArr = ref<string[]>([]);
const picUrlObj = ref<FileInfo | undefined>({
  name: "自定义图片名.jpg",
  url: "https://s2.loli.net/2023/05/24/yNsxFC8rLHMZQcK.jpg",
});

// 多图上传
const picUrls = ref<string[]>([]);

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
const dragFileUrls = ref<string[]>(["https://example.com/documents/report.xlsx"]);

// 删除文件
const removeFile = (arr: FileInfo[], file: FileInfo) => {
  const idx = arr.findIndex((item) => item.url === file.url && item.name === file.name);

  if (idx !== -1) {
    arr.splice(idx, 1);
  }
};

// 重名文件根据idx删除
const removeFileByIndex = (arr: string[], file: FileInfo, idx: number) => {
  if (arr[idx] === file.url) {
    arr.splice(idx, 1);
  }
};
</script>
