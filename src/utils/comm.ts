/**
 * 参数处理
 * @param {*} params  参数
 */
export function tansParams(params: { [key: string]: any }) {
  let result = "";

  for (const propName of Object.keys(params)) {
    const value = params[propName];
    const part = encodeURIComponent(propName) + "=";

    if (value !== null && value !== "" && typeof value !== "undefined") {
      if (typeof value === "object") {
        for (const key of Object.keys(value)) {
          if (value[key] !== null && value[key] !== "" && typeof value[key] !== "undefined") {
            let params = propName + "[" + key + "]";
            var subPart = encodeURIComponent(params) + "=";

            result += subPart + encodeURIComponent(value[key]) + "&";
          }
        }
      } else {
        result += part + encodeURIComponent(value) + "&";
      }
    }
  }

  return result;
}

/**
 * 询问框
 * @param content 提示文字
 * @param type 提示类型 success | warning | error
 * @param title 标题
 * @returns
 */
export const InquiryBox = (
  content: string,
  type: "success" | "warning" | "error" = "warning",
  title: string = "系统提示"
) => {
  return new Promise<void>((resolve, reject) => {
    window.$dialog[type]({
      title,
      content,
      positiveText: "确定",
      negativeText: "取消",
      onPositiveClick: () => resolve(),
      onAfterLeave: () => reject(),
    });
  });
};
