<template>
  <n-modal
    v-model:show="visible"
    w-500px
    preset="card"
    :title="t('user.import.user')"
    :on-mask-click="cancel"
    :segmented="{ content: true, action: true }"
    @close="cancel"
  >
    <n-alert v-if="error" class="mb-[10px]" :title="error" type="error">
      <n-table :bordered="false" :single-line="false">
        <n-data-table
          :columns="[
            { title: t('user.import.table.no'), key: 'no' },
            { title: t('user.import.table.title'), key: 'title' },
          ]"
          :data="resultData"
          :bordered="false"
          size="small"
        />
      </n-table>
    </n-alert>
    <n-upload
      ref="upload"
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
        <n-text style="font-size: 16px">{{ t("user.import.upload") }}</n-text>
        <n-p depth="3" style="margin: 8px 0 0">{{ t("user.import.uploadTip") }}</n-p>
      </n-upload-dragger>
    </n-upload>
    <n-flex vertical align="center">
      <n-flex>
        <span>
          {{ t("user.import.uploadTip2") }}
          <n-text type="error">.xlsx</n-text>
          /
          <n-text type="error">.xls</n-text>
          {{ t("user.import.uploadTip3") }}
        </span>
        <n-button text type="primary" @click="importTemplate">
          {{ t("button.downloadTemplate") }}
        </n-button>
      </n-flex>
      <!-- <div v-html="error"></div> -->
    </n-flex>
    <template #action>
      <n-flex justify="end">
        <n-button type="primary" :loading="loading" @click="handleSubmit">
          <template #icon>
            <Icones icon="ant-design:check-outlined" />
          </template>
          {{ t("button.submit") }}
        </n-button>
        <n-button strong secondary @click="cancel">
          <template #icon>
            <Icones icon="ant-design:close-outlined" />
          </template>
          {{ t("button.cancel") }}
        </n-button>
      </n-flex>
    </template>
  </n-modal>
</template>
<script lang="ts" setup>
import type { UploadFileInfo, UploadCustomRequestOptions, UploadInst } from "naive-ui";

import { exportFile } from "@/utils";
import { useLoading } from "@/hooks";
import { MIMETYPE, ResultEnum } from "@/enums";

import UserAPI from "@/api/system/user";

const { t } = useI18n();
const { loading, startLoading, endLoading } = useLoading();

defineOptions({ name: "ImportUser" });

defineExpose({
  open: () => {
    visible.value = true;
  },
});

const emit = defineEmits<{
  (e: "success"): void;
}>();

const uploadRef = useTemplateRef<UploadInst>("upload");

const visible = ref(false);

const resultData = ref<{ no: number; title: string }[]>([]);

/** 下载模板操作 */
const importTemplate = () => {
  UserAPI.downloadTemplate().then((response) => {
    window.$message.loading(t("common.downloading"));
    const fileName = decodeURI(response.headers["content-disposition"].split(";")[1].split("=")[1]);

    exportFile(response.data, MIMETYPE.xlsx, fileName);
  });
};

/** 文件上传前回调 */
const beforeUpload = async (data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => {
  // 文件类型判断
  if (!data.file.name.endsWith(".xls") && !data.file.name.endsWith(".xlsx")) {
    window.$message.error(t("components.upload.incorrectFormat", { type: ".xlsx / .xls" }));

    return false;
  }

  return true;
};
const error = ref("");
/** 自定义上传 */
const customRequest = ({ file, onFinish, onError, onProgress }: UploadCustomRequestOptions) => {
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
        window.$message.success(t("user.import.success", { value: result.validCount }));
        emit("success");
        cancel();
      } else {
        // error.value = `导入结果：${result.invalidCount}条无效数据，${result.validCount}条有效数据`;
        error.value = t("user.import.result", {
          invalid: result.invalidCount,
          valid: result.validCount,
        });
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
