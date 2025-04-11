import type { App, Directive } from "vue";

import { useAuthStoreHook } from "@/store";

export function install(app: App) {
  /**
   * 按钮权限
   */
  const updatePerm = (el: HTMLElement, permission: string[]) => {
    // 校验传入的权限值是否合法
    if (!permission || (typeof permission !== "string" && !Array.isArray(permission))) {
      throw new Error(
        "需要提供权限标识！例如：v-has-perm=\"'sys:user:add'\" 或 v-has-perm=\"['sys:user:add', 'sys:user:edit']\""
      );
    }
    const { roles, perms } = useAuthStoreHook().userInfo;

    // 超级管理员拥有所有权限
    if (roles.includes("ROOT")) {
      return;
    }
    // 检查权限
    const hasAuth = Array.isArray(permission)
      ? permission.some((perm) => perms.includes(perm))
      : perms.includes(permission);

    // 如果没有权限，移除该元素
    if (!hasAuth && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  };

  const hasPerm: Directive<HTMLElement, string[]> = {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
      updatePerm(el, binding.value);
    },
    updated(el: HTMLElement, binding: DirectiveBinding) {
      updatePerm(el, binding.value);
    },
  };

  app.directive("hasPerm", hasPerm);

  /** 角色权限指令 */
  const updateRole = (el: HTMLElement, value: string[]) => {
    // 校验传入的角色值是否合法
    if (!value || (typeof value !== "string" && !Array.isArray(value))) {
      throw new Error(
        "需要提供角色标识！例如：v-has-role=\"'ADMIN'\" 或 v-has-role=\"['ADMIN', 'TEST']\""
      );
    }

    const { roles } = useAuthStoreHook().userInfo;

    // 检查是否有对应角色权限
    const hasAuth = Array.isArray(value)
      ? value.some((role) => roles.includes(role))
      : roles.includes(value);

    // 如果没有权限，移除元素
    if (!hasAuth && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  };

  const hasRole: Directive<HTMLElement, string[]> = {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
      updateRole(el, binding.value);
    },
    updated(el: HTMLElement, binding: DirectiveBinding) {
      updateRole(el, binding.value);
    },
  };

  app.directive("hasRole", hasRole);
}
