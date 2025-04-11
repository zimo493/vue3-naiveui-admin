import { get } from "@/utils";

const DEPT_BASE_URL = "/api/v1/dept";

export default {
  /** 获取部门下拉列表 */
  getOptions: () => get<OptionType[]>(`${DEPT_BASE_URL}/options`),
};
