import { defineMock } from "./base";

/*
 * 用户 mock（内存态）
 * 数据取自 sql/youlai_admin.sql 的 sys_user（用户名与演示角色一一对应）
 * 注意本模板的接口差异：
 *  - 删除   DELETE /users/{ids}（逗号分隔批量），不是 /users/{id}
 *  - 重置密码 PUT   /users/{id}/reset-password?password=xxx
 */

interface UserRow {
  id: string;
  username: string;
  nickname: string;
  mobile: string;
  gender: number;
  avatar: string;
  email: string;
  status: number;
  deptName: string | null;
  roleNames: string | null;
  createTime: string;
}

/** 列表数据 */
const userList: UserRow[] = [
  {
    id: "1",
    username: "root",
    nickname: "有来技术",
    mobile: "18812345677",
    gender: 0,
    avatar: "https://foruda.gitee.com/images/1723603502796844527/03cdca2a_716974.gif",
    email: "youlaitech@163.com",
    status: 1,
    deptName: null,
    roleNames: "超级管理员",
    createTime: "2026-09-26 08:10",
  },
  {
    id: "2",
    username: "admin",
    nickname: "系统管理员",
    mobile: "18888888888",
    gender: 1,
    avatar: "https://foruda.gitee.com/images/1723603502796844527/03cdca2a_716974.gif",
    email: "youlaitech@163.com",
    status: 1,
    deptName: "有来技术",
    roleNames: "系统管理员",
    createTime: "2026-09-26 08:10",
  },
  {
    id: "3",
    username: "test",
    nickname: "测试小用户",
    mobile: "18812345679",
    gender: 1,
    avatar: "https://foruda.gitee.com/images/1723603502796844527/03cdca2a_716974.gif",
    email: "youlaitech@163.com",
    status: 1,
    deptName: "测试部门",
    roleNames: "自定义权限用户",
    createTime: "2026-09-26 08:10",
  },
  {
    id: "4",
    username: "dept_manager",
    nickname: "部门主管",
    mobile: "18812345680",
    gender: 1,
    avatar: "https://foruda.gitee.com/images/1723603502796844527/03cdca2a_716974.gif",
    email: "manager@youlaitech.com",
    status: 1,
    deptName: "有来技术",
    roleNames: "部门主管",
    createTime: "2026-09-26 08:10",
  },
  {
    id: "5",
    username: "dept_member",
    nickname: "部门成员",
    mobile: "18812345681",
    gender: 1,
    avatar: "https://foruda.gitee.com/images/1723603502796844527/03cdca2a_716974.gif",
    email: "member@youlaitech.com",
    status: 1,
    deptName: "有来技术",
    roleNames: "部门成员",
    createTime: "2026-09-26 08:10",
  },
  {
    id: "6",
    username: "employee",
    nickname: "普通员工",
    mobile: "18812345682",
    gender: 1,
    avatar: "https://foruda.gitee.com/images/1723603502796844527/03cdca2a_716974.gif",
    email: "employee@youlaitech.com",
    status: 1,
    deptName: "研发部门",
    roleNames: "普通员工",
    createTime: "2026-09-26 08:10",
  },
  {
    id: "7",
    username: "custom_user",
    nickname: "自定义权限用户",
    mobile: "18812345683",
    gender: 1,
    avatar: "https://foruda.gitee.com/images/1723603502796844527/03cdca2a_716974.gif",
    email: "custom@youlaitech.com",
    status: 1,
    deptName: "测试部门",
    roleNames: "自定义权限用户",
    createTime: "2026-09-26 08:10",
  },
];

/** 表单数据（含 deptId / roleIds） */
const userMap: Record<string, UserRow & { deptId: string | null; roleIds: string[] }> = {
  "1": {
    id: "1",
    username: "root",
    nickname: "有来技术",
    mobile: "18812345677",
    gender: 0,
    avatar: "https://foruda.gitee.com/images/1723603502796844527/03cdca2a_716974.gif",
    email: "youlaitech@163.com",
    status: 1,
    deptName: null,
    roleNames: "超级管理员",
    createTime: "2026-09-26 08:10",
    deptId: null,
    roleIds: ["1"],
  },
  "2": {
    id: "2",
    username: "admin",
    nickname: "系统管理员",
    mobile: "18888888888",
    gender: 1,
    avatar: "https://foruda.gitee.com/images/1723603502796844527/03cdca2a_716974.gif",
    email: "youlaitech@163.com",
    status: 1,
    deptName: "有来技术",
    roleNames: "系统管理员",
    createTime: "2026-09-26 08:10",
    deptId: "1",
    roleIds: ["2"],
  },
  "3": {
    id: "3",
    username: "test",
    nickname: "测试小用户",
    mobile: "18812345679",
    gender: 1,
    avatar: "https://foruda.gitee.com/images/1723603502796844527/03cdca2a_716974.gif",
    email: "youlaitech@163.com",
    status: 1,
    deptName: "测试部门",
    roleNames: "自定义权限用户",
    createTime: "2026-09-26 08:10",
    deptId: "3",
    roleIds: ["7"],
  },
  "4": {
    id: "4",
    username: "dept_manager",
    nickname: "部门主管",
    mobile: "18812345680",
    gender: 1,
    avatar: "https://foruda.gitee.com/images/1723603502796844527/03cdca2a_716974.gif",
    email: "manager@youlaitech.com",
    status: 1,
    deptName: "有来技术",
    roleNames: "部门主管",
    createTime: "2026-09-26 08:10",
    deptId: "1",
    roleIds: ["4"],
  },
  "5": {
    id: "5",
    username: "dept_member",
    nickname: "部门成员",
    mobile: "18812345681",
    gender: 1,
    avatar: "https://foruda.gitee.com/images/1723603502796844527/03cdca2a_716974.gif",
    email: "member@youlaitech.com",
    status: 1,
    deptName: "有来技术",
    roleNames: "部门成员",
    createTime: "2026-09-26 08:10",
    deptId: "1",
    roleIds: ["5"],
  },
  "6": {
    id: "6",
    username: "employee",
    nickname: "普通员工",
    mobile: "18812345682",
    gender: 1,
    avatar: "https://foruda.gitee.com/images/1723603502796844527/03cdca2a_716974.gif",
    email: "employee@youlaitech.com",
    status: 1,
    deptName: "研发部门",
    roleNames: "普通员工",
    createTime: "2026-09-26 08:10",
    deptId: "2",
    roleIds: ["6"],
  },
  "7": {
    id: "7",
    username: "custom_user",
    nickname: "自定义权限用户",
    mobile: "18812345683",
    gender: 1,
    avatar: "https://foruda.gitee.com/images/1723603502796844527/03cdca2a_716974.gif",
    email: "custom@youlaitech.com",
    status: 1,
    deptName: "测试部门",
    roleNames: "自定义权限用户",
    createTime: "2026-09-26 08:10",
    deptId: "3",
    roleIds: ["7"],
  },
};

let nextUserId = 100;

/** 部门/角色映射 */
const DEPT_ID_NAME: Record<string, string> = {
  "1": "有来技术",
  "2": "研发部门",
  "3": "测试部门",
};

const ROLE_ID_NAME: Record<string, string> = {
  "1": "超级管理员",
  "2": "系统管理员",
  "3": "访问游客",
  "4": "部门主管",
  "5": "部门成员",
  "6": "普通员工",
  "7": "自定义权限用户",
};

/** 当前登录用户的权限标识（取 sys_menu 中按钮的 perm） */
const ALL_PERMS: string[] = [
  "sys:user:list",
  "sys:user:create",
  "sys:user:update",
  "sys:user:delete",
  "sys:user:reset-password",
  "sys:user:import",
  "sys:user:export",
  "sys:role:list",
  "sys:role:create",
  "sys:role:update",
  "sys:role:delete",
  "sys:role:assign",
  "sys:menu:list",
  "sys:menu:create",
  "sys:menu:update",
  "sys:menu:delete",
  "sys:dept:list",
  "sys:dept:create",
  "sys:dept:update",
  "sys:dept:delete",
  "sys:dict:list",
  "sys:dict:create",
  "sys:dict:update",
  "sys:dict:delete",
  "sys:dict-item:list",
  "sys:dict-item:create",
  "sys:dict-item:update",
  "sys:dict-item:delete",
  "sys:log:list",
  "sys:config:list",
  "sys:config:create",
  "sys:config:update",
  "sys:config:delete",
  "sys:config:refresh",
  "sys:notice:list",
  "sys:notice:create",
  "sys:notice:update",
  "sys:notice:delete",
  "sys:notice:publish",
  "sys:notice:revoke",
];

export default defineMock([
  // 当前登录用户信息（admin）
  {
    url: "users/me",
    method: ["GET"],
    body: {
      code: "00000",
      data: {
        userId: "2",
        username: "admin",
        nickname: "系统管理员",
        avatar: "https://foruda.gitee.com/images/1723603502796844527/03cdca2a_716974.gif",
        roles: ["ROOT"],
        perms: ALL_PERMS,
      },
      msg: "一切ok",
    },
  },

  // 用户分页列表
  {
    url: "users",
    method: ["GET"],
    body({ query }) {
      const keywords = String(query?.keywords ?? "").trim();
      const status =
        query?.status === undefined || query?.status === "" ? undefined : Number(query.status);
      const deptId = String(query?.deptId ?? "").trim();
      const pageNum = Math.max(1, Number(query?.pageNum) || 1);
      const pageSize = Math.max(1, Number(query?.pageSize) || 10);
      const deptName = deptId ? DEPT_ID_NAME[deptId] : "";
      const list = userList.filter((item) => {
        if (
          keywords &&
          !item.username.includes(keywords) &&
          !item.nickname.includes(keywords) &&
          !item.mobile.includes(keywords)
        )
          return false;
        if (status !== undefined && item.status !== status) return false;
        if (deptName && item.deptName !== deptName) return false;

        return true;
      });

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

  // 用户下拉
  {
    url: "users/options",
    method: ["GET"],
    body() {
      return {
        code: "00000",
        data: userList.map((i) => ({ value: i.id, label: i.nickname })),
        msg: "一切ok",
      };
    },
  },

  // 用户表单
  {
    url: "users/:userId/form",
    method: ["GET"],
    body({ params }) {
      const item = userMap[String(params.userId)];

      return { code: "00000", data: item ?? null, msg: "一切ok" };
    },
  },

  // 新增用户
  {
    url: "users",
    method: ["POST"],
    body({ body }) {
      const id = String(nextUserId++);
      const roleNames = (body.roleIds ?? [])
        .map((rid: string) => ROLE_ID_NAME[String(rid)])
        .filter(Boolean)
        .join(",");
      const item: UserRow = {
        id,
        username: body.username ?? "",
        nickname: body.nickname ?? "",
        mobile: body.mobile ?? "",
        gender: Number(body.gender ?? 1),
        avatar:
          body.avatar || "https://foruda.gitee.com/images/1723603502796844527/03cdca2a_716974.gif",
        email: body.email ?? "",
        status: Number(body.status ?? 1),
        deptName: DEPT_ID_NAME[String(body.deptId ?? "")] ?? null,
        roleNames: roleNames || null,
        createTime: "2026-09-26 08:10",
      };

      userList.unshift(item);
      userMap[id] = {
        ...item,
        deptId: String(body.deptId ?? ""),
        roleIds: (body.roleIds ?? []).map(String),
      };

      return { code: "00000", data: null, msg: "新增用户" + item.nickname + "成功" };
    },
  },

  // 修改用户
  {
    url: "users/:id",
    method: ["PUT"],
    body({ params, body }) {
      const item = userList.find((u) => u.id === String(params.id));

      if (item) {
        Object.assign(item, {
          nickname: body.nickname ?? item.nickname,
          mobile: body.mobile ?? item.mobile,
          gender: Number(body.gender ?? item.gender),
          email: body.email ?? item.email,
          status: Number(body.status ?? item.status),
          deptName: body.deptId
            ? (DEPT_ID_NAME[String(body.deptId)] ?? item.deptName)
            : item.deptName,
          roleNames: body.roleIds
            ? body.roleIds
                .map((r: string) => ROLE_ID_NAME[String(r)])
                .filter(Boolean)
                .join(",") || null
            : item.roleNames,
        });
        userMap[item.id] = {
          ...userMap[item.id],
          ...item,
          deptId: String(body.deptId ?? userMap[item.id]?.deptId ?? ""),
          roleIds: (body.roleIds ?? userMap[item.id]?.roleIds ?? []).map(String),
        };
      }

      return { code: "00000", data: null, msg: "修改用户" + (body.nickname ?? params.id) + "成功" };
    },
  },

  // 删除用户（逗号分隔批量）
  {
    url: "users/:ids",
    method: ["DELETE"],
    body({ params }) {
      const ids = String(params.ids)
        .split(",")
        .map((s) => s.trim());

      for (let i = userList.length - 1; i >= 0; i -= 1) {
        if (ids.includes(userList[i].id)) userList.splice(i, 1);
      }
      ids.forEach((id) => delete userMap[id]);

      return { code: "00000", data: null, msg: "删除用户" + params.ids + "成功" };
    },
  },

  // 重置密码（password 走 query）
  {
    url: "users/:id/reset-password",
    method: ["PUT"],
    body({ params, query }) {
      return {
        code: "00000",
        data: null,
        msg: "重置用户" + params.id + "密码成功" + (query?.password ? "" : ""),
      };
    },
  },

  // 下载导入模板
  {
    url: "users/template",
    method: ["GET"],
    headers: {
      "Content-Disposition":
        "attachment; filename=%E7%94%A8%E6%88%B7%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx",
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  },

  // 导出用户
  {
    url: "users/export",
    method: ["GET"],
    headers: {
      "Content-Disposition": "attachment; filename=%E7%94%A8%E6%88%B7%E5%88%97%E8%A1%A8.xlsx",
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  },

  // 导入用户
  {
    url: "users/import",
    method: ["POST"],
    body: {
      code: "00000",
      data: { code: "00000", invalidCount: 0, validCount: 2, messageList: [] },
      msg: "一切ok",
    },
  },

  // 个人中心信息
  {
    url: "users/profile",
    method: ["GET"],
    body: {
      code: "00000",
      data: {
        id: "2",
        username: "admin",
        nickname: "系统管理员",
        avatar: "https://foruda.gitee.com/images/1723603502796844527/03cdca2a_716974.gif",
        gender: 1,
        mobile: "18888888888",
        email: "youlaitech@163.com",
        deptName: "有来技术",
        roleNames: "系统管理员",
        createTime: "2026-09-26 08:10",
      },
      msg: "一切ok",
    },
  },

  // 修改个人中心信息
  {
    url: "users/profile",
    method: ["PUT"],
    body() {
      return { code: "00000", data: null, msg: "修改个人信息成功" };
    },
  },

  // 修改密码
  {
    url: "users/password",
    method: ["PUT"],
    body() {
      return { code: "00000", data: null, msg: "修改密码成功" };
    },
  },

  // 发送手机验证码
  {
    url: "users/mobile/code",
    method: ["POST"],
    body({ query }) {
      return { code: "00000", data: null, msg: "验证码已发送至 " + (query?.mobile ?? "") };
    },
  },

  // 绑定/更换手机号
  {
    url: "users/mobile",
    method: ["PUT"],
    body() {
      return { code: "00000", data: null, msg: "手机号绑定成功" };
    },
  },

  // 解绑手机号（密码走 body）
  {
    url: "users/mobile",
    method: ["DELETE"],
    body() {
      return { code: "00000", data: null, msg: "手机号解绑成功" };
    },
  },

  // 发送邮箱验证码
  {
    url: "users/email/code",
    method: ["POST"],
    body({ query }) {
      return { code: "00000", data: null, msg: "验证码已发送至 " + (query?.email ?? "") };
    },
  },

  // 绑定/更换邮箱
  {
    url: "users/email",
    method: ["PUT"],
    body() {
      return { code: "00000", data: null, msg: "邮箱绑定成功" };
    },
  },

  // 解绑邮箱（密码走 query）
  {
    url: "users/email",
    method: ["DELETE"],
    body() {
      return { code: "00000", data: null, msg: "邮箱解绑成功" };
    },
  },
]);
