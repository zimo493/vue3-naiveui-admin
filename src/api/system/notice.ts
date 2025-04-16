import { del, get, post, put } from "@/utils";

const NOTICE_BASE_URL = "/api/v1/notices";

export default {
  /** 获取通知公告分页数据 */
  getPage: (params?: Notice.Query) =>
    get<PageResult<Notice.VO[]>>(`${NOTICE_BASE_URL}/page`, params),

  /**
   * 获取通知公告表单数据
   *
   * @param id 通知
   * @returns 通知表单数据
   */
  getFormData: (id: string) => get<Notice.Form>(`${NOTICE_BASE_URL}/${id}/form`),

  /**
   * 添加通知公告
   *
   * @param data 通知表单数据
   * @returns
   */
  create: (data: Notice.Form) => post(`${NOTICE_BASE_URL}`, data),

  /**
   * 更新通知公告
   *
   * @param id 通知ID
   * @param data 通知表单数据
   */
  update: (id: string, data: Notice.Form) => put(`${NOTICE_BASE_URL}/${id}`, data),

  /**
   * 批量删除通知公告，多个以英文逗号(,)分割
   *
   * @param ids 通知公告ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds: (ids: string) => del(`${NOTICE_BASE_URL}/${ids}`),

  /**
   * 发布通知
   *
   * @param id 被发布的通知公告id
   * @returns
   */
  publish: (id: string) => put(`${NOTICE_BASE_URL}/${id}/publish`),

  /**
   * 撤回通知
   *
   * @param id 撤回的通知id
   * @returns
   */
  revoke: (id: string) => put(`${NOTICE_BASE_URL}/${id}/revoke`),

  /**
   * 查看通知
   *
   * @param id
   */
  getDetail: (id: string) => get<Notice.DetailVO>(`${NOTICE_BASE_URL}/${id}/detail`),

  /* 全部已读 */
  readAll: () => put(`${NOTICE_BASE_URL}/read-all`),

  /** 获取我的通知分页列表 */
  getMyNoticePage: (params?: Notice.Query) =>
    get<PageResult<Notice.VO[]>>(`${NOTICE_BASE_URL}/my-page`, params),
};
