import { defineMock } from "./base";

/*
 * 部门 mock（内存态）
 * 数据取自 sql/youlai_admin.sql 的 sys_dept；列表返回树形结构
 * 注意：列表 VO 的父级字段是 parentid（小写），表单是 parentId，与后端保持一致
 */

interface DeptRow {
  id: string;
  name: string;
  code: string;
  parentId: string;
  sort: number;
  status: number;
}

const deptList: DeptRow[] = [
  { id: "1", name: "有来技术", code: "YOULAI", parentId: "0", sort: 1, status: 1 },
  { id: "2", name: "研发部门", code: "RD001", parentId: "1", sort: 1, status: 1 },
  { id: "3", name: "测试部门", code: "QA001", parentId: "1", sort: 2, status: 1 },
];

let nextDeptId = 100;

const childrenOf = (parentId: string): DeptRow[] =>
  deptList.filter((d) => d.parentId === parentId).sort((a, b) => a.sort - b.sort);

/** 树形结构（列表 VO 用 parentid 小写字段） */
function buildTree(parentId = "0"): Record<string, unknown>[] {
  return childrenOf(parentId).map((d) => {
    const children = buildTree(d.id);

    return {
      id: d.id,
      name: d.name,
      code: d.code,
      parentid: d.parentId,
      sort: d.sort,
      status: d.status,
      createTime: "2026-09-26 08:10",
      updateTime: null,
      ...(children.length ? { children } : {}),
    };
  });
}

export default defineMock([
  // 部门树
  {
    url: "depts",
    method: ["GET"],
    body({ query }) {
      const keywords = String(query?.keywords ?? "").trim();
      const status =
        query?.status === undefined || query?.status === "" ? undefined : Number(query.status);
      let tree = buildTree();

      if (keywords || status !== undefined) {
        const flat = deptList.filter((d) => {
          if (keywords && !d.name.includes(keywords)) return false;
          if (status !== undefined && d.status !== status) return false;

          return true;
        });

        tree = flat.map((d) => ({
          id: d.id,
          name: d.name,
          code: d.code,
          parentid: d.parentId,
          sort: d.sort,
          status: d.status,
        }));
      }

      return { code: "00000", data: tree, msg: "一切ok" };
    },
  },

  // 部门下拉（排除自身与子孙，避免把自己设为上级）
  {
    url: "depts/options",
    method: ["GET"],
    body({ query }) {
      const exclude = String(query?.excludeId ?? "");
      const banned = new Set<string>();
      const collect = (id: string) => {
        banned.add(id);
        childrenOf(id).forEach((c) => collect(c.id));
      };

      if (exclude) collect(exclude);
      const data = deptList
        .filter((d) => !banned.has(d.id))
        .map((d) => ({ value: d.id, label: d.name }));

      return { code: "00000", data, msg: "一切ok" };
    },
  },

  // 部门表单
  {
    url: "depts/:id/form",
    method: ["GET"],
    body({ params }) {
      const dept = deptList.find((d) => d.id === String(params.id));

      return {
        code: "00000",
        data: dept
          ? {
              id: dept.id,
              name: dept.name,
              code: dept.code,
              parentId: dept.parentId,
              sort: dept.sort,
              status: dept.status,
            }
          : null,
        msg: "一切ok",
      };
    },
  },

  // 新增部门（禁止把自己/子孙设为上级）
  {
    url: "depts",
    method: ["POST"],
    body({ body }) {
      const parentId = String(body.parentId ?? "0");
      const id = String(nextDeptId++);

      deptList.push({
        id,
        name: body.name ?? "",
        code: body.code ?? "",
        parentId,
        sort: Number(body.sort ?? 99),
        status: Number(body.status ?? 1),
      });

      return { code: "00000", data: null, msg: "新增部门" + (body.name ?? "") + "成功" };
    },
  },

  // 修改部门
  {
    url: "depts/:id",
    method: ["PUT"],
    body({ params, body }) {
      const dept = deptList.find((d) => d.id === String(params.id));

      if (dept) {
        const parentId = String(body.parentId ?? dept.parentId);
        // 上级不能是自己或自己的子孙，否则会造成环
        const banned = new Set<string>();
        const collect = (id: string) => {
          banned.add(id);
          childrenOf(id).forEach((c) => collect(c.id));
        };

        collect(dept.id);
        Object.assign(dept, {
          name: body.name ?? dept.name,
          code: body.code ?? dept.code,
          parentId: banned.has(parentId) ? dept.parentId : parentId,
          sort: Number(body.sort ?? dept.sort),
          status: Number(body.status ?? dept.status),
        });
      }

      return { code: "00000", data: null, msg: "修改部门" + (body.name ?? params.id) + "成功" };
    },
  },

  // 删除部门（逗号分隔批量，级联删除子孙）
  {
    url: "depts/:ids",
    method: ["DELETE"],
    body({ params }) {
      const ids = String(params.ids)
        .split(",")
        .map((s) => s.trim());
      const all = new Set<string>();
      const collect = (id: string) => {
        all.add(id);
        childrenOf(id).forEach((c) => collect(c.id));
      };

      ids.forEach(collect);
      for (let i = deptList.length - 1; i >= 0; i -= 1) {
        if (all.has(deptList[i].id)) deptList.splice(i, 1);
      }

      return { code: "00000", data: null, msg: "删除部门" + params.ids + "成功" };
    },
  },
]);
