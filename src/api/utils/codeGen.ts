import request, { del, get, post } from "@/utils";

const GENERATOR_BASE_URL = "/api/v1/codegen";

export default {
  /**
   * 获取数据表分页列表
   * @param params 查询参数
   */
  getTablePage: (params: CodeGen.Query) =>
    get<PageResult<CodeGen.VO[]>>(`${GENERATOR_BASE_URL}/table/page`, params),

  /**
   * 获取代码生成配置
   * @param tableName 数据表名
   */
  getGenConfig: (tableName: string) =>
    get<CodeGen.ConfigForm>(`${GENERATOR_BASE_URL}/${tableName}/config`),

  /**
   * 保存代码生成配置
   * @param tableName 数据表名
   * @param data 代码生成配置
   */
  saveGenConfig: (tableName: string, data: CodeGen.ConfigForm) =>
    post<CodeGen.ConfigForm>(`${GENERATOR_BASE_URL}/${tableName}/config`, data),

  /**
   * 获取代码生成预览数据
   * @param tableName 数据表名
   * @param pageType 页面类型 `classic` | `curd`
   */
  getPreviewData: (tableName: string, pageType: CodeGen.ConfigForm["pageType"]) =>
    get<CodeGen.PreviewVO[]>(`${GENERATOR_BASE_URL}/${tableName}/preview`, { pageType }),

  /**
   * 重置代码生成配置
   * @param tableName 数据表名
   */
  resetGenConfig: (tableName: string) => del(`${GENERATOR_BASE_URL}/${tableName}/config`),

  /**
   * 下载 zip 文件
   * @param tableName 数据表名
   * @param pageType 页面类型 `classic` | `curd`
   */
  download: (tableName: string, pageType: CodeGen.ConfigForm["pageType"]) =>
    request({
      url: `${GENERATOR_BASE_URL}/${tableName}/download`,
      method: "get",
      params: { pageType },
      responseType: "blob",
    }),
};
