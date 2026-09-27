import type { TagProps } from "naive-ui";

/**
 * 后端标签样式到 naive-ui 标签类型的换算表
 *
 * 后端存的是 Element 的标签语义，naive-ui 没有 danger 这一档
 */
const TAG_TYPES: Record<string, TagProps["type"]> = {
  primary: "primary",
  success: "success",
  warning: "warning",
  info: "info",
  danger: "error",
  error: "error",
};

/**
 * 标签样式转 naive-ui 的标签类型
 *
 * @param tagType 后端返回的标签样式，为空表示不显示标签
 * @returns naive-ui 的 type，认不出来的取值退到 default
 */
export function toTagType(tagType?: string): TagProps["type"] | undefined {
  if (!tagType) return undefined;

  return TAG_TYPES[tagType.toLowerCase()] ?? "default";
}
