import { del, get, post, put } from "@/utils";

const DICT_BASE_URL = "/api/v1/dicts";

type DictTagType = import("naive-ui").TagProps["type"];

const decodeDictTagType = (val?: unknown): DictTagType | undefined => {
  const normalized = String(val ?? "")
    .trim()
    .toLowerCase();

  if (!normalized) return undefined;

  if (
    normalized === "default" ||
    normalized === "primary" ||
    normalized === "success" ||
    normalized === "info" ||
    normalized === "warning" ||
    normalized === "error"
  ) {
    return normalized as DictTagType;
  }

  return undefined;
};

const encodeDictTagType = (tagType?: unknown): DictTagType | "" => {
  const normalized = String(tagType ?? "")
    .trim()
    .toLowerCase();

  if (!normalized) return "";

  if (
    normalized === "default" ||
    normalized === "primary" ||
    normalized === "success" ||
    normalized === "info" ||
    normalized === "warning" ||
    normalized === "error"
  ) {
    return normalized as DictTagType;
  }

  return "";
};

export default {
  /**
   * 获取字典分页列表
   * @param dictCode 字典编码
   * @param params 查询参数
   */
  getDictItemPage: (dictCode: string, params: DictData.Query) =>
    get<PageResult<DictData.VO>>(`${DICT_BASE_URL}/${dictCode}/items`, params).then((res) => ({
      data: (res.data ?? []).map((item) => ({
        ...item,
        tagType: decodeDictTagType((item as any).tagType) as any,
      })),
      page: res.page ?? null,
    })),

  /**
   * 获取字典项列表
   * @param dictCode 字典编码
   */
  getDictItems: (dictCode: string) =>
    get<DictData.Option[]>(`${DICT_BASE_URL}/${dictCode}/items/options`).then((items) =>
      items.map((item) => ({
        ...item,
        tagType: decodeDictTagType((item as any).tagType) as any,
      }))
    ),

  /**
   * 新增字典项
   * @param dictCode 字典编码
   * @param data 字典项表单数据
   */
  createDictItem: (dictCode: string, data: DictData.Form) =>
    post(`${DICT_BASE_URL}/${dictCode}/items`, {
      ...data,
      tagType: encodeDictTagType((data as any).tagType),
    }),

  /**
   * 获取字典项表单数据
   *
   * @param dictCode 字典编码
   * @param id 字典项id
   */
  getDictItemFormData: (dictCode: string, id: string) =>
    get<DictData.Form>(`${DICT_BASE_URL}/${dictCode}/items/${id}/form`).then((form) => ({
      ...form,
      tagType: decodeDictTagType((form as any).tagType) as any,
    })),

  /**
   * 修改字典项
   * @param dictCode 字典编码
   * @param id 字典项id
   * @param data 字典项表单数据
   */
  updateDictItem: (dictCode: string, id: string, data: DictData.Form) =>
    put(`${DICT_BASE_URL}/${dictCode}/items/${id}`, {
      ...data,
      tagType: encodeDictTagType((data as any).tagType),
    }),

  /**
   * 删除字典项
   * @param dictCode 字典编码
   * @param ids 字典项id集合
   */
  deleteDictItems: (dictCode: string, ids: string) =>
    del(`${DICT_BASE_URL}/${dictCode}/items/${ids}`),
};
