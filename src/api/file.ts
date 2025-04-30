import request from "@/utils";
import { type AxiosProgressEvent } from "axios";

const FILE_BASE_URL = "/api/v1/files";

export default {
  /**
   * 上传文件
   *
   * @param formData 文件对象
   * @param onUploadProgress 上传进度回调
   */
  upload: (formData: FormData, onUploadProgress?: (e: AxiosProgressEvent) => void) =>
    request<any, FileInfo>({
      url: FILE_BASE_URL,
      method: "post",
      data: formData,
      headers: { "Content-Type": "multipart/form-data", repeatSubmit: false },
      onUploadProgress,
    }),

  /**
   * 上传文件
   */
  uploadFile: (file: File) => {
    const formData = new FormData();

    formData.append("file", file);

    return request<any, FileInfo>({
      url: FILE_BASE_URL,
      method: "post",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /**
   * 删除文件
   *
   * @param filePath 文件完整路径
   */
  delete: (filePath?: string) =>
    request({
      url: FILE_BASE_URL,
      method: "delete",
      params: { filePath },
    }),

  /**
   * 下载文件
   * @param url
   * @param fileName
   */
  async download(url: string, fileName?: string) {
    const res = await request({
      url: url,
      method: "get",
      responseType: "blob",
    });
    const blob = new Blob([res.data]);
    const a = document.createElement("a");
    const url_2 = window.URL.createObjectURL(blob);

    a.href = url_2;
    a.download = fileName || "下载文件";
    a.click();
    window.URL.revokeObjectURL(url_2);
  },
};

/**
 * 文件API类型声明
 */
export interface FileInfo {
  /** 文件名 */
  name: string;
  /** 文件路径 */
  url: string;
}
