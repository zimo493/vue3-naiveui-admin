import { get } from "@/utils";

const LOG_BASE_URL = "/api/v1/logs";

export default {
  /**
   * 获取日志分页列表
   * @param params 查询参数
   */
  getPage: (params: Log.Query) => get<PageResult<Log.VO>>(`${LOG_BASE_URL}`, params),
};
