import { defineMock } from "./base";

/*
 * 角色 mock（内存态）
 * 数据取自 sql/youlai_admin.sql 的 sys_role；列表由 roleMap 派生，增删改即时生效
 * 注意：删除用 /roles/{ids}（支持逗号分隔批量）
 */

interface RoleRow {
  id: string;
  name: string;
  code: string;
  sort: number;
  status: number;
  dataScope: number;
  deptIds?: string[];
  createTime: string;
  updateTime: string | null;
}

/** 角色数据（内存态） */
const roleMap: Record<string, RoleRow> = {
  "1": {
    id: "1",
    name: "超级管理员",
    code: "ROOT",
    sort: 1,
    status: 1,
    dataScope: 1,
    createTime: "2026-09-26 08:10",
    updateTime: null,
  },
  "2": {
    id: "2",
    name: "系统管理员",
    code: "ADMIN",
    sort: 2,
    status: 1,
    dataScope: 1,
    createTime: "2026-09-26 08:10",
    updateTime: null,
  },
  "3": {
    id: "3",
    name: "访问游客",
    code: "GUEST",
    sort: 3,
    status: 1,
    dataScope: 3,
    createTime: "2026-09-26 08:10",
    updateTime: null,
  },
  "4": {
    id: "4",
    name: "部门主管",
    code: "DEPT_MANAGER",
    sort: 4,
    status: 1,
    dataScope: 2,
    createTime: "2026-09-26 08:10",
    updateTime: null,
  },
  "5": {
    id: "5",
    name: "部门成员",
    code: "DEPT_MEMBER",
    sort: 5,
    status: 1,
    dataScope: 3,
    createTime: "2026-09-26 08:10",
    updateTime: null,
  },
  "6": {
    id: "6",
    name: "普通员工",
    code: "EMPLOYEE",
    sort: 6,
    status: 1,
    dataScope: 4,
    createTime: "2026-09-26 08:10",
    updateTime: null,
  },
  "7": {
    id: "7",
    name: "自定义权限用户",
    code: "CUSTOM_USER",
    sort: 7,
    status: 1,
    dataScope: 5,
    deptIds: [],
    createTime: "2026-09-26 08:10",
    updateTime: null,
  },
};

/** 菜单授权（内存态）：超级管理员/系统管理员默认全量 */
const roleMenuIds: Record<string, string[]> = {};

/** 新增角色 id 游标 */
let nextRoleId = 100;

const listRoles = (): RoleRow[] => Object.values(roleMap).sort((a, b) => a.sort - b.sort);

export default defineMock([
  // 角色分页列表
  {
    url: "roles",
    method: ["GET"],
    body({ query }) {
      const keywords = String(query?.keywords ?? "").trim();
      const pageNum = Math.max(1, Number(query?.pageNum) || 1);
      const pageSize = Math.max(1, Number(query?.pageSize) || 10);
      const list = listRoles().filter((item) =>
        keywords ? item.name.includes(keywords) || item.code.includes(keywords) : true
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

  // 角色下拉
  {
    url: "roles/options",
    method: ["GET"],
    body() {
      return {
        code: "00000",
        data: listRoles().map((i) => ({ value: i.id, label: i.name })),
        msg: "一切ok",
      };
    },
  },

  // 角色表单
  {
    url: "roles/:id/form",
    method: ["GET"],
    body({ params }) {
      const role = roleMap[String(params.id)];

      return { code: "00000", data: role ?? null, msg: "一切ok" };
    },
  },

  // 角色已授权菜单 id
  {
    url: "roles/:roleId/menu-ids",
    method: ["GET"],
    body({ params }) {
      const id = String(params.roleId);
      const data = roleMenuIds[id] ?? (id === "1" || id === "2" ? ALL_MENU_IDS : []);

      return { code: "00000", data, msg: "一切ok" };
    },
  },

  // 保存角色菜单授权
  {
    url: "roles/:roleId/menus",
    method: ["PUT"],
    body({ params, body }) {
      const ids = Array.isArray(body) ? body : (body?.menuIds ?? []);

      roleMenuIds[String(params.roleId)] = ids.map(String);

      return { code: "00000", data: null, msg: "分配权限成功" };
    },
  },

  // 角色自定义数据权限部门
  {
    url: "roles/:roleId/dept-ids",
    method: ["GET"],
    body({ params }) {
      const role = roleMap[String(params.roleId)];

      return {
        code: "00000",
        data: role?.dataScope === 5 ? (role.deptIds ?? []) : [],
        msg: "一切ok",
      };
    },
  },

  // 新增角色
  {
    url: "roles",
    method: ["POST"],
    body({ body }) {
      const id = String(nextRoleId++);
      const role: RoleRow = {
        id,
        name: body.name ?? "",
        code: body.code ?? "",
        sort: Number(body.sort ?? 99),
        status: Number(body.status ?? 1),
        dataScope: Number(body.dataScope ?? 1),
        createTime: "2026-09-26 08:10",
        updateTime: null,
      };

      if (role.dataScope === 5) role.deptIds = body.deptIds ?? [];
      roleMap[id] = role;

      return { code: "00000", data: null, msg: "新增角色" + role.name + "成功" };
    },
  },

  // 修改角色
  {
    url: "roles/:id",
    method: ["PUT"],
    body({ params, body }) {
      const role = roleMap[String(params.id)];

      if (role) {
        Object.assign(role, {
          name: body.name ?? role.name,
          code: body.code ?? role.code,
          sort: Number(body.sort ?? role.sort),
          status: Number(body.status ?? role.status),
          dataScope: Number(body.dataScope ?? role.dataScope),
          updateTime: "2026-09-26 08:10",
        });
        if (role.dataScope === 5) role.deptIds = body.deptIds ?? role.deptIds ?? [];
      }

      return { code: "00000", data: null, msg: "修改角色" + (body.name ?? params.id) + "成功" };
    },
  },

  // 删除角色（支持逗号分隔批量）
  {
    url: "roles/:ids",
    method: ["DELETE"],
    body({ params }) {
      String(params.ids)
        .split(",")
        .forEach((id) => {
          delete roleMap[id.trim()];
          delete roleMenuIds[id.trim()];
        });

      return { code: "00000", data: null, msg: "删除角色" + params.ids + "成功" };
    },
  },
]);

/** 全部菜单 id（与 mock/menu.mock.ts 的菜单数据一致） */
const ALL_MENU_IDS: string[] = [
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "110",
  "111",
  "112",
  "113",
  "114",
  "115",
  "116",
  "117",
  "120",
  "121",
  "122",
  "123",
  "124",
  "125",
  "130",
  "131",
  "132",
  "133",
  "134",
  "140",
  "141",
  "142",
  "143",
  "144",
  "150",
  "151",
  "152",
  "153",
  "154",
  "160",
  "161",
  "162",
  "163",
  "164",
  "170",
  "171",
  "180",
  "181",
  "182",
  "183",
  "184",
  "185",
  "190",
  "191",
  "192",
  "193",
  "194",
  "195",
  "196",
  "210",
  "310",
  "410",
  "420",
  "430",
  "440",
  "510",
  "610",
  "620",
  "630",
  "640",
  "650",
  "660",
  "710",
  "810",
  "811",
  "812",
  "813",
  "910",
  "920",
];
