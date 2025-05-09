/**
 * 日期范围参数处理
 * @returns
 */
export const useRange = () => {
  const params: Recordable = {};
  const setRange = (val?: [string, string], propName = "Time") =>
    ([params[`begin${propName}`], params[`end${propName}`]] = val ? val : [null, null]);

  function handleRange<T extends Recordable>(query: T): T {
    return { ...query, params, dateRange: void 0 };
  }

  return {
    setRange,
    handleRange,
  };
};
