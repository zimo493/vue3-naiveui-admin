<template>
  <n-modal
    v-model:show="visible"
    w-500px
    preset="card"
    title="用户导入"
    :on-mask-click="cancel"
    :segmented="{ content: true, action: true }"
    @close="cancel"
  >
    <n-alert v-if="error" class="mb-[10px]" :title="error" type="error">
      <n-table :bordered="false" :single-line="false">
        <n-data-table
          :columns="[
            { title: '序号', key: 'no' },
            { title: '错误信息', key: 'title' },
          ]"
          :data="resultData"
          :bordered="false"
          size="small"
        />
      </n-table>
    </n-alert>
    <n-upload
      ref="uploadRef"
      multiple
      directory-dnd
      accept=".xls,.xlsx"
      :max="1"
      :default-upload="false"
      :custom-request="customRequest"
      :on-error="handleError"
      :on-remove="handleRemove"
      @before-upload="beforeUpload"
    >
      <n-upload-dragger>
        <div style="margin-bottom: 12px">
          <Icones icon="ep:upload-filled" :size="56" />
        </div>
        <n-text style="font-size: 16px">点击此处或者拖动文件到该区域上传</n-text>
        <n-p depth="3" style="margin: 8px 0 0">请不要上传敏感数据，以免造成不必要的损失。</n-p>
      </n-upload-dragger>
    </n-upload>
    <n-flex vertical align="center">
      <div>
        <span>
          仅允许导入
          <n-text type="error">.xlsx</n-text>
          /
          <n-text type="error">.xls</n-text>
          格式文件。
        </span>
        <n-button text type="primary" @click="importTemplate">下载模板</n-button>
      </div>
      <!-- <div v-html="error"></div> -->
    </n-flex>
    <template #action>
      <n-space justify="end">
        <n-button type="primary" :loading="loading" @click="handleSubmit">
          <template #icon>
            <Icones icon="ant-design:check-outlined" />
          </template>
          提交
        </n-button>
        <n-button strong secondary @click="cancel">
          <template #icon>
            <Icones icon="ant-design:close-outlined" />
          </template>
          取消
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>
<script lang="ts">
export default { name: "ImportUser" };
</script>
<script lang="ts" setup>
import type { UploadFileInfo, UploadCustomRequestOptions, UploadInst } from "naive-ui";

import { exportFile } from "@/utils";
import { useLoading } from "@/hooks";
import { MIMETYPE, ResultEnum } from "@/enums";

import UserAPI from "@/api/system/user";

const { loading, startLoading, endLoading } = useLoading();

defineExpose({
  open: () => {
    visible.value = true;
  },
});

const emit = defineEmits<{
  (e: "success"): void;
}>();

const uploadRef = ref<UploadInst | null>(null);

const visible = ref(false);

const resultData = ref<{ no: number; title: string }[]>([]);

/** 下载模板操作 */
const importTemplate = () => {
  UserAPI.downloadTemplate().then((response) => {
    window.$message.loading("正在下载数据，请稍候...");
    const fileName = decodeURI(response.headers["content-disposition"].split(";")[1].split("=")[1]);

    exportFile(response.data, MIMETYPE.xlsx, fileName);
  });
};

/** 文件上传前回调 */
const beforeUpload = async (data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => {
  // 文件类型判断
  if (!data.file.name.endsWith(".xls") && !data.file.name.endsWith(".xlsx")) {
    window.$message.error("文件格式不正确，请上传格式为 .xlsx 或 .xls 的文件");

    return false;
  }

  return true;
};
const error = ref("");
/** 自定义上传 */
const customRequest = ({
  file,
  data,
  headers,
  withCredentials,
  action,
  onFinish,
  onError,
  onProgress,
}: UploadCustomRequestOptions) => {
  startLoading();
  console.log(file);
  UserAPI.import("1", file.file as File, (e) => {
    onProgress({
      percent: Number(((e.loaded / Number(e.total)) * 100).toFixed(2)),
    });
  })
    .then((result) => {
      console.log(result);
      onFinish();
      if (result.code === ResultEnum.SUCCESS && result.invalidCount === 0) {
        window.$message.success("导入成功，导入数据：" + result.validCount + "条");
        emit("success");
        cancel();
      } else {
        error.value = `导入结果：${result.invalidCount}条无效数据，${result.validCount}条有效数据`;
        resultData.value = result.messageList.map((item, idx) => ({
          no: idx + 1,
          title: item,
        }));
      }
    })
    .catch((err) => {
      onError();
      console.log(err);
      error.value = err.toString().replaceAll("Error:", "");
    })
    .finally(() => endLoading());
};

/** 文件移除回调 */
const handleRemove = () => {
  error.value = "";
  resultData.value = [];

  return true;
};

/** 文件上传失败回调 */
const handleError = (options: { file: UploadFileInfo; event?: ProgressEvent }) => {
  console.log(options);
};

/*** 提交 */
const handleSubmit = () => {
  uploadRef.value?.submit();
};
/** 取消 */
const cancel = () => {
  error.value = "";
  resultData.value = [];
  visible.value = false;
};
</script>
