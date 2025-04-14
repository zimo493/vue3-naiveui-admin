import { del, get, post, put } from "@/utils";

const DEPT_BASE_URL = "/api/v1/dept";

export default {
  /**
   * 获取部门列表
   *
   * @param params 查询参数（可选）
   * @returns 部门树形表格数据
   */
  getList: (params?: Dept.Query) => get<Dept.VO[]>(`${DEPT_BASE_URL}`, params),

  /** 获取部门下拉列表 */
  getOptions: () => get<OptionType[]>(`${DEPT_BASE_URL}/options`),

  /**
   * 获取部门表单数据
   *
   * @param id 部门ID
   * @returns 部门表单数据
   */
  getFormData: (id: string) => get<Dept.Form>(`${DEPT_BASE_URL}/${id}/form`),

  /**
   * 新增部门
   *
   * @param data 部门表单数据
   * @returns 请求结果
   */
  create: (data: Dept.Form) => post(`${DEPT_BASE_URL}`, data),

  /**
   * 修改部门
   *
   * @param id 部门ID
   * @param data 部门表单数据
   * @returns 请求结果
   */
  update: (id: string, data: Dept.Form) => put(`${DEPT_BASE_URL}/${id}`, data),

  /**
   * 删除部门
   *
   * @param ids 部门ID，多个以英文逗号(,)分隔
   * @returns 请求结果
   */
  deleteByIds: (ids: string) => del(`${DEPT_BASE_URL}/${ids}`),
};
