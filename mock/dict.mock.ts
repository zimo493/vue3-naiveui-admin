import { defineMock } from "./base";

/*
 * 字典 mock（内存态）
 * 数据取自 sql/youlai_admin.sql 的 sys_dict / sys_dict_item
 *  - GET  dicts                             字典类型分页
 *  - GET  dicts/options                     字典类型下拉
 *  - GET  dicts/:dictCode/items             字典项分页（管理页）
 *  - GET  dicts/:dictCode/items/options     字典项下拉（供 useDict / DictTag / FormPro 使用）
 * 前端直接消费 { value, label, tagType }，无需额外转换
 */

/** 字典类型 */
interface DictRow {
  id: string;
  dictCode: string;
  name: string;
  status: number;
}

/** 字典项 */
interface DictItemRow {
  id: string;
  dictCode: string;
  value: string;
  label: string;
  tagType: string;
  status: number;
  sort: number;
  remark: string | null;
}

/** 字典类型数据 */
const dictList: DictRow[] = [
  { id: "1", dictCode: "gender", name: "性别", status: 1 },
  { id: "2", dictCode: "notice_type", name: "通知类型", status: 1 },
  { id: "3", dictCode: "notice_level", name: "通知级别", status: 1 },
];

/** 字典项数据（按 dictCode 分组） */
const dictItemList: Record<string, DictItemRow[]> = {
  gender: [
    {
      id: "1",
      dictCode: "gender",
      value: "1",
      label: "男",
      tagType: "primary",
      status: 1,
      sort: 1,
      remark: null,
    },
    {
      id: "2",
      dictCode: "gender",
      value: "2",
      label: "女",
      tagType: "error",
      status: 1,
      sort: 2,
      remark: null,
    },
    {
      id: "3",
      dictCode: "gender",
      value: "0",
      label: "保密",
      tagType: "",
      status: 1,
      sort: 3,
      remark: null,
    },
  ],
  notice_type: [
    {
      id: "4",
      dictCode: "notice_type",
      value: "1",
      label: "系统升级",
      tagType: "success",
      status: 1,
      sort: 1,
      remark: null,
    },
    {
      id: "5",
      dictCode: "notice_type",
      value: "2",
      label: "系统维护",
      tagType: "primary",
      status: 1,
      sort: 2,
      remark: null,
    },
    {
      id: "6",
      dictCode: "notice_type",
      value: "3",
      label: "安全警告",
      tagType: "error",
      status: 1,
      sort: 3,
      remark: null,
    },
    {
      id: "7",
      dictCode: "notice_type",
      value: "4",
      label: "假期通知",
      tagType: "success",
      status: 1,
      sort: 4,
      remark: null,
    },
    {
      id: "8",
      dictCode: "notice_type",
      value: "5",
      label: "公司新闻",
      tagType: "primary",
      status: 1,
      sort: 5,
      remark: null,
    },
    {
      id: "9",
      dictCode: "notice_type",
      value: "99",
      label: "其他",
      tagType: "info",
      status: 1,
      sort: 99,
      remark: null,
    },
  ],
  notice_level: [
    {
      id: "10",
      dictCode: "notice_level",
      value: "L",
      label: "低",
      tagType: "info",
      status: 1,
      sort: 1,
      remark: null,
    },
    {
      id: "11",
      dictCode: "notice_level",
      value: "M",
      label: "中",
      tagType: "warning",
      status: 1,
      sort: 2,
      remark: null,
    },
    {
      id: "12",
      dictCode: "notice_level",
      value: "H",
      label: "高",
      tagType: "error",
      status: 1,
      sort: 3,
      remark: null,
    },
  ],
};

let nextDictId = 100;
let nextDictItemId = 1000;

export default defineMock([
  // 字典类型分页
  {
    url: "dicts",
    method: ["GET"],
    body({ query }) {
      const keywords = String(query?.keywords ?? "").trim();
      const pageNum = Math.max(1, Number(query?.pageNum) || 1);
      const pageSize = Math.max(1, Number(query?.pageSize) || 10);
      const list = dictList.filter((item) =>
        keywords ? item.name.includes(keywords) || item.dictCode.includes(keywords) : true
      );

      return {
        code: "00000",
        data: {
          list: list.slice((pageNum - 1) * pageSize, pageNum * pageSize),
          total: list.length,
        },
        msg: "一切ok",
      };
    },
  },

  // 字典类型下拉
  {
    url: "dicts/options",
    method: ["GET"],
    body() {
      return {
        code: "00000",
        data: dictList.map((i) => ({ value: i.dictCode, label: i.name })),
        msg: "一切ok",
      };
    },
  },

  // 字典类型表单
  {
    url: "dicts/:id/form",
    method: ["GET"],
    body({ params }) {
      const item = dictList.find((i) => i.id === String(params.id));

      return { code: "00000", data: item ?? null, msg: "一切ok" };
    },
  },

  // 新增字典类型
  {
    url: "dicts",
    method: ["POST"],
    body({ body }) {
      const id = String(nextDictId++);
      const item = {
        id,
        dictCode: body.dictCode ?? "",
        name: body.name ?? "",
        status: Number(body.status ?? 1),
      };

      dictList.push(item);
      dictItemList[item.dictCode] = dictItemList[item.dictCode] ?? [];

      return { code: "00000", data: null, msg: "新增字典" + item.name + "成功" };
    },
  },

  // 修改字典类型
  {
    url: "dicts/:id",
    method: ["PUT"],
    body({ params, body }) {
      const item = dictList.find((i) => i.id === String(params.id));

      if (item) {
        Object.assign(item, {
          name: body.name ?? item.name,
          dictCode: body.dictCode ?? item.dictCode,
          status: Number(body.status ?? item.status),
        });
      }

      return { code: "00000", data: null, msg: "修改字典" + (body.name ?? params.id) + "成功" };
    },
  },

  // 删除字典类型（级联删除字典项）
  {
    url: "dicts/:ids",
    method: ["DELETE"],
    body({ params }) {
      String(params.ids)
        .split(",")
        .forEach((id) => {
          const idx = dictList.findIndex((i) => i.id === id.trim());

          if (idx !== -1) {
            delete dictItemList[dictList[idx].dictCode];
            dictList.splice(idx, 1);
          }
        });

      return { code: "00000", data: null, msg: "删除字典" + params.ids + "成功" };
    },
  },

  // 字典项分页（管理页）
  {
    url: "dicts/:dictCode/items",
    method: ["GET"],
    body({ params, query }) {
      const all = dictItemList[String(params.dictCode)] ?? [];
      const keywords = String(query?.keywords ?? "").trim();
      const pageNum = Math.max(1, Number(query?.pageNum) || 1);
      const pageSize = Math.max(1, Number(query?.pageSize) || 10);
      const list = all.filter((item) =>
        keywords ? item.label.includes(keywords) || item.value.includes(keywords) : true
      );

      return {
        code: "00000",
        data: {
          list: list.slice((pageNum - 1) * pageSize, pageNum * pageSize),
          total: list.length,
        },
        msg: "一切ok",
      };
    },
  },

  // 字典项下拉（useDict / DictTag / FormPro 使用；仅返回启用项，结构 { value, label, tagType }）
  {
    url: "dicts/:dictCode/items/options",
    method: ["GET"],
    body({ params }) {
      const all = dictItemList[String(params.dictCode)] ?? [];
      const data = all
        .filter((i) => i.status === 1)
        .sort((a, b) => a.sort - b.sort)
        .map((i) => ({ value: i.value, label: i.label, tagType: i.tagType || undefined }));

      return { code: "00000", data, msg: "一切ok" };
    },
  },

  // 字典项表单
  {
    url: "dicts/:dictCode/items/:id/form",
    method: ["GET"],
    body({ params }) {
      const all = dictItemList[String(params.dictCode)] ?? [];
      const item = all.find((i) => i.id === String(params.id));

      return { code: "00000", data: item ?? null, msg: "一切ok" };
    },
  },

  // 新增字典项
  {
    url: "dicts/:dictCode/items",
    method: ["POST"],
    body({ params, body }) {
      const code = String(params.dictCode);

      dictItemList[code] = dictItemList[code] ?? [];
      const item: DictItemRow = {
        id: String(nextDictItemId++),
        dictCode: code,
        value: body.value ?? "",
        label: body.label ?? "",
        tagType: body.tagType ?? "",
        status: Number(body.status ?? 1),
        sort: Number(body.sort ?? 99),
        remark: body.remark ?? null,
      };

      dictItemList[code].push(item);

      return { code: "00000", data: null, msg: "新增字典项" + item.label + "成功" };
    },
  },

  // 修改字典项
  {
    url: "dicts/:dictCode/items/:id",
    method: ["PUT"],
    body({ params, body }) {
      const all = dictItemList[String(params.dictCode)] ?? [];
      const item = all.find((i) => i.id === String(params.id));

      if (item) {
        Object.assign(item, {
          value: body.value ?? item.value,
          label: body.label ?? item.label,
          tagType: body.tagType ?? item.tagType,
          status: Number(body.status ?? item.status),
          sort: Number(body.sort ?? item.sort),
          remark: body.remark ?? item.remark,
        });
      }

      return { code: "00000", data: null, msg: "修改字典项" + (body.label ?? params.id) + "成功" };
    },
  },

  // 删除字典项（支持逗号分隔批量）
  {
    url: "dicts/:dictCode/items/:ids",
    method: ["DELETE"],
    body({ params }) {
      const code = String(params.dictCode);
      const ids = String(params.ids)
        .split(",")
        .map((s) => s.trim());

      dictItemList[code] = (dictItemList[code] ?? []).filter((i) => !ids.includes(i.id));

      return { code: "00000", data: null, msg: "删除字典项" + params.ids + "成功" };
    },
  },
]);
