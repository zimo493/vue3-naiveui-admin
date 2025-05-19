import request from "@/utils";
import { type AxiosProgressEvent } from "axios";

const FILE_BASE_URL = "/api/v1/files";

export default {
  /**
   * 上传文件
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
   * @param file 文件对象
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
   * @param url 文件下载地址
   * @param fileName 文件名
   */
  async download(url: string, fileName?: string) {
    const res = await request({
      url,
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
 * @property name 文件名
 * @property url 文件路径
 */
export interface FileInfo {
  /** 文件名 */
  name: string;
  /** 文件路径 */
  url: string;
}
