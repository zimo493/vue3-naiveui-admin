/**
 * 封装组件的ref
 * @param _component
 * @returns 完整类型标注的响应式组件实例
 * @example const ref = useCompRef(NButton)
 */

export const useCompRef = <T extends abstract new (...args: any) => any>(_component: T) =>
  ref<InstanceType<T> | null>(null);
