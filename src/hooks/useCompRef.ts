/** 生成带完整类型标注的组件实例 ref */

export const useCompRef = <T extends abstract new (...args: any) => any>(_component: T) =>
  ref<InstanceType<T> | null>(null);
