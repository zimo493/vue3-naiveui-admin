import type { MIMETYPE } from "@/enums";
import Icones from "@/components/common/Icones.vue";
import { $t } from "./i18n";

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
            const params = propName + "[" + key + "]";
            const subPart = encodeURIComponent(params) + "=";

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
  title = $t("common.sysTip")
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    window.$dialog[type]({
      title,
      content,
      positiveText: $t("button.ok"),
      negativeText: $t("button.cancel"),
      positiveButtonProps: {
        secondary: true,
        strong: true,
        renderIcon: () => h(Icones, { icon: "ant-design:check-outlined", size: 16 }),
      },
      negativeButtonProps: {
        text: true,
        renderIcon: () => h(Icones, { icon: "ant-design:close-outlined", size: 16 }),
      },
      onPositiveClick: () => resolve(true),
      onAfterLeave: () => reject(false),
    });
  });
};

// 小于10前面补0
export const zeroFill = (num: number): string => (num < 10 ? "0" + num : num.toString());

export const checkNumber = (value: number, minLimit: number, maxLimit: number): number => {
  // 添加参数有效性检查
  if (minLimit > maxLimit) {
    throw new Error("minLimit must be less than or equal to maxLimit");
  }

  // 使用条件运算符简化代码
  value = Math.floor(value);
  value = value < minLimit ? minLimit : value > maxLimit ? maxLimit : value;

  return value;
};

export const exportFile = (fileData: BlobPart, fileType: MIMETYPE, fileName: string) => {
  const blob = new Blob([fileData], { type: fileType });
  const downloadUrl = window.URL.createObjectURL(blob);

  const downloadLink = document.createElement("a");

  downloadLink.href = downloadUrl;
  downloadLink.download = fileName;

  document.body.appendChild(downloadLink);
  downloadLink.click();

  document.body.removeChild(downloadLink);
  window.URL.revokeObjectURL(downloadUrl);
};

/**
 * @description 格式化时间工具函数
 * @param time 时间，可以是 Date 对象、时间戳或时间字符串
 * @param pattern 时间格式，例如 'YYYY-MM-DD HH:mm:ss 周dd'
 * @returns 格式化后的时间字符串
 */
export const parseTime = (
  time: Date | string | number,
  pattern = "YYYY-MM-DD HH:mm:ss"
): string => {
  const date = time instanceof Date ? time : new Date(time);

  // 如果 date 是无效的 Date 对象
  if (isNaN(date.getTime())) {
    throw new Error("parseTime: => 无效的日期");
  }

  // 定义星期几的映射
  const weekdays: string[] = ["日", "一", "二", "三", "四", "五", "六"];

  // 定义格式化规则
  const formatMap: Record<string, string> = {
    YYYY: String(date.getFullYear()),
    MM: String(date.getMonth() + 1).padStart(2, "0"),
    DD: String(date.getDate()).padStart(2, "0"),
    HH: String(date.getHours()).padStart(2, "0"),
    mm: String(date.getMinutes()).padStart(2, "0"),
    ss: String(date.getSeconds()).padStart(2, "0"),
    dd: weekdays[date.getDay()], // 周几
  };

  // 替换 pattern 中的占位符
  return pattern.replace(/YYYY|MM|DD|HH|mm|ss|dd/g, (match) => formatMap[match]);
};

/**
 * 路径转驼峰
 * @param path 路径
 * @example
 * pathToHump("user/list") // "userList"
 * @returns 驼峰路径
 */
export const pathToHump = (path?: string): string => {
  if (!path) return "";
  // 移除斜杠
  const withoutSlash = path.replaceAll("/", "");

  // 按分隔符（横杠、斜杠等）拆分成单词数组
  const words = withoutSlash.split(/[-/_]/);

  // 将每个单词首字母大写并连接
  return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join("");
};

export const statusOptions = computed(() => [
  { label: $t("statusTag.normal"), value: 1, type: "success" },
  { label: $t("statusTag.disable"), value: 0, type: "error" },
]);
