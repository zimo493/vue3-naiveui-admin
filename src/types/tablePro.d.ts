declare namespace TablePro {
  type FormItemType =
    | "input" // 文本输入框
    | "number" // 数字输入框
    | "password" // 密码输入框
    | "textarea" // 文本域
    | "select" // 下拉选择器
    | "datepicker" // 日期选择器
    | "timepicker" // 时间选择器
    | "switch" // 开关选择器
    | "radio" // 单选按钮
    | "checkbox" // 多选按钮
    | "tree-select" // 树形选择器
    | "text";

  export interface ItemOption {
    label: string; // 标签名
    value: string | number; // 值
    disabled?: boolean; // 是否禁用
  }

  export interface FormItem<V> {
    field: keyof V | "dateRange"; // 字段名
    labelMessage?: string; // 标签提示信息
    type?: FormItemType; // 输入框类型
    label?: string; // 输入框标题
    showLabel?: boolean; // 是否显示标签
    colSpan?: number; // 栅格占据的列数默认24
    disabled?: boolean; // 表单是否可修改 默认false
    readonly?: boolean; // 表单是否只读 默认false
    clearable?: boolean; // 是否可清空 默认true
    placeholder?: string; // 占位符
    prop?: string; // 表单校验
    options?: ItemOption[]; // 选择器的可选子选项
    dict?: string; // 字典
    dateFormat?: string; // 日期格式
    otherOptions?: {
      [key: string]: string | number | boolean | Array<number | string> | ((...args: any[]) => any);
    }; // 其他配置
    otherEvents?: { [key: string]: (...args: any[]) => any }; // 其他事件
    isHidden?: boolean; // 是否隐藏
    slotName?: string; // 自定义插槽名
  }

  export interface FormOption<T> {
    fields: FormItem<T>[]; // 表单项
    rules?: import("naive-ui").FormRules; // 表单校验规则
    labelWidth?: number; // 标签的长度
    showLabel?: boolean; // 是否显示标签
    showFeedback?: boolean; // 是否显示校验反馈
    labelPlacement?: "left" | "top"; // 标签位置
    labelAlign?: "left" | "right"; // 标签对齐方式
    gutter?: number; // 栅格间隔
  }
}
