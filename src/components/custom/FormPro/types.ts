import { type FormRules } from "naive-ui";

export enum FormItemType {
  Input = "input", // 文本输入框
  Number = "number", // 数字输入框
  Password = "password", // 密码输入框
  Textarea = "textarea", // 文本域
  Select = "select", // 下拉选择器
  Datepicker = "datepicker", // 日期选择器
  Timepicker = "timepicker", // 时间选择器
  Switch = "switch", // 开关选择器
  Radio = "radio", // 单选按钮
  Checkbox = "checkbox", // 多选按钮
  TreeSelect = "tree-select", // 树形选择器
  Text = "text", // 文本
}

type FormType =
  | FormItemType.Input
  | FormItemType.Number
  | FormItemType.Password
  | FormItemType.Select
  | FormItemType.Datepicker
  | FormItemType.Timepicker
  | FormItemType.Switch
  | FormItemType.Radio
  | FormItemType.Checkbox
  | FormItemType.TreeSelect
  | FormItemType.Textarea
  | FormItemType.Text;

export interface ItemOption {
  label: string; // 标签名
  value: string | number; // 值
  disabled?: boolean; // 是否禁用
}

export interface FormItem<V> {
  field: keyof V | "dateRange"; // 字段名
  labelMessage?: string; // 标签提示信息
  type?: FormType; // 输入框类型
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

export interface FormOption<T extends Recordable> {
  fields: FormItem<T>[]; // 表单项
  rules?: FormRules; // 表单校验规则
  labelWidth?: number; // 标签的长度
  showLabel?: boolean; // 是否显示标签
  showFeedback?: boolean; // 是否显示校验反馈
  labelPlacement?: "left" | "top"; // 标签位置
  labelAlign?: "left" | "right"; // 标签对齐方式
  gutter?: number; // 栅格间隔
}
