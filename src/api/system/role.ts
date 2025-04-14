import { get } from "@/utils";

const ROLE_BASE_URL = "/api/v1/roles";

export default {
  /** 获取角色下拉数据源 */
  getOptions: () => get<OptionType[]>(ROLE_BASE_URL + "/options"),
};
