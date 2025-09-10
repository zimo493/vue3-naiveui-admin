import type { MIMETYPE } from "@/enums";
import Icones from "@/components/icones.vue";
import { $t } from "./i18n";

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
): Promise<boolean> =>
  new Promise((resolve, reject) => {
    window.$dialog[type]({
      title,
      content,
      positiveText: $t("button.ok"),
      negativeText: $t("button.cancel"),
      positiveButtonProps: {
        renderIcon: () => h(Icones, { icon: "ant-design:check-outlined", size: 16 }),
      },
      negativeButtonProps: {
        renderIcon: () => h(Icones, { icon: "ant-design:close-outlined", size: 16 }),
      },
      onPositiveClick: () => resolve(true),
      onAfterLeave: () => reject(false),
    });
  });

// 小于10前面补0
export const zeroFill = (num: number): string => String(num).padStart(2, "0");

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
 * @param locale 本地化设置，默认为中文
 * @returns 格式化后的时间字符串
 */
export const parseTime = (
  time: Date | string | number,
  pattern = "YYYY-MM-DD HH:mm:ss",
  locale: "zh-CN" | "en-US" = "zh-CN"
): string => {
  // 验证输入
  if (time === null || time === undefined) {
    throw new Error("parseTime: 时间参数不能为空");
  }

  // 创建日期对象
  let date: Date;

  if (time instanceof Date) {
    date = time;
  } else if (typeof time === "number") {
    // 处理时间戳（考虑秒和毫秒时间戳）
    date = time.toString().length < 13 ? new Date(time * 1000) : new Date(time);
  } else {
    date = new Date(time);
  }

  // 验证日期有效性
  if (isNaN(date.getTime())) {
    throw new Error("parseTime: 无效的日期");
  }

  // 本地化配置
  const locales = {
    "zh-CN": {
      weekdays: ["日", "一", "二", "三", "四", "五", "六"],
      meridiem: ["上午", "下午"],
    },
    "en-US": {
      weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      meridiem: ["AM", "PM"],
    },
  };

  const currentLocale = locales[locale];

  // 获取日期各部分
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();
  const weekday = date.getDay();

  // 12小时制处理
  const hours12 = hours % 12 || 12;
  const meridiem = hours < 12 ? currentLocale.meridiem[0] : currentLocale.meridiem[1];

  // 格式化映射
  const formatMap: Record<string, string> = {
    YYYY: String(year),
    YY: String(year).slice(-2),
    MM: String(month).padStart(2, "0"),
    M: String(month),
    DD: String(day).padStart(2, "0"),
    D: String(day),
    HH: String(hours).padStart(2, "0"),
    H: String(hours),
    hh: String(hours12).padStart(2, "0"),
    h: String(hours12),
    mm: String(minutes).padStart(2, "0"),
    m: String(minutes),
    ss: String(seconds).padStart(2, "0"),
    s: String(seconds),
    SSS: String(milliseconds).padStart(3, "0"),
    A: meridiem,
    dd: currentLocale.weekdays[weekday],
    d: String(weekday),
  };

  // 使用正则表达式替换占位符
  return pattern.replace(
    /YYYY|YY|MM|M|DD|D|HH|H|hh|h|mm|m|ss|s|SSS|A|dd|d/g,
    (match) => formatMap[match] || match
  );
};

/**
 * 日期格式化
 * @param time 时间
 * @returns 时间格式化
 */
export const formatDate = (time: Date | string | number) => parseTime(time, "YYYY-MM-DD");

/**
 * 日期时间格式化
 * @param time 时间
 * @returns 时间格式化
 */
export const formatDateTime = (time: Date | string | number) =>
  parseTime(time, "YYYY-MM-DD HH:mm:ss");

/**
 * 时间格式化
 * @param time 时间
 * @returns 时间格式化
 */
export const formatTime = (time: Date | string | number) => parseTime(time, "HH:mm:ss");

export const statusOptions = computed(() => [
  { label: $t("statusTag.normal"), value: 1, type: "success" },
  { label: $t("statusTag.disable"), value: 0, type: "error" },
]);
