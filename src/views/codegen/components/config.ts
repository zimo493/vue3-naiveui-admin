import { $t } from "@/utils";

/**
 * 表单类型
 */
export const FormType = computed(
  (): Record<string, OptionItem> => ({
    INPUT: { value: 1, label: $t("codeGen.formType.input") },
    SELECT: { value: 2, label: $t("codeGen.formType.select") },
    RADIO: { value: 3, label: $t("codeGen.formType.radio") },
    CHECK_BOX: { value: 4, label: $t("codeGen.formType.checkbox") },
    INPUT_NUMBER: { value: 5, label: $t("codeGen.formType.number") },
    SWITCH: { value: 6, label: $t("codeGen.formType.switch") },
    TEXT_AREA: { value: 7, label: $t("codeGen.formType.textarea") },
    DATE: { value: 8, label: $t("codeGen.formType.date") },
    DATE_TIME: { value: 9, label: $t("codeGen.formType.dataTime") },
    HIDDEN: { value: 10, label: $t("codeGen.formType.hidden") },
  })
);

/**
 * 查询类型
 */
export const QueryType: Record<string, OptionItem> = {
  /** 等于 */
  EQ: { value: 1, label: "=" },

  /** 模糊匹配 */
  LIKE: { value: 2, label: "LIKE '%s%'" },

  /** 包含 */
  IN: { value: 3, label: "IN" },

  /** 范围 */
  BETWEEN: { value: 4, label: "BETWEEN" },

  /** 大于 */
  GT: { value: 5, label: ">" },

  /** 大于等于 */
  GE: { value: 6, label: ">=" },

  /** 小于 */
  LT: { value: 7, label: "<" },

  /** 小于等于 */
  LE: { value: 8, label: "<=" },

  /** 不等于 */
  NE: { value: 9, label: "!=" },

  /** 左模糊匹配 */
  LIKE_LEFT: { value: 10, label: "LIKE '%s'" },

  /** 右模糊匹配 */
  LIKE_RIGHT: { value: 11, label: "LIKE 's%'" },
};
