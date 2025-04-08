/**
 * 布尔组合式函数
 * @param initValue 初始值，默认为false
 */
export function useBoolean(initValue = false) {
  const bool = ref(initValue);

  const setBool = (value: boolean) => {
    bool.value = value;
  };
  const toggle = () => {
    setBool(!bool.value);
  };

  return {
    bool,
    setBool,
    setTrue: () => setBool(true),
    setFalse: () => setBool(false),
    toggle,
  };
}
