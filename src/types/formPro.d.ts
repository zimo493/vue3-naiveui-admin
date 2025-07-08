type Component = import("vue").Component;
type VNode = import("vue").VNode;
type GridFromItem = import("naive-ui").GridItemProps & import("naive-ui").FormItemProps;

/**
 * 响应式 span 配置
 */
interface ResponsiveSpan {
  mobile?: number; // < 768px
  tablet?: number; // 768px - 1024px
  desktop?: number; // >= 1024px
}

/**
 * 基础表单项配置
 */
interface BaseFormItemConfig {
  name: string;
  label?: string;
  component?: ComponentType; // 可选，默认为 input
  span?: number;
  dict?: string;
  hidden?: boolean;
  props?: Record<string, any>;
  formItemProps?: Omit<GridFromItem, "path" | "span" | "label">;
  labelMessage?: string;
  slots?: Record<string, (val: never) => VNode[]>;
}

/**
 * 输入框配置
 */
interface InputFormItemConfig extends BaseFormItemConfig {
  component?: "input"; // 可选，默认为 input
  props?: import("naive-ui").InputProps;
  slots?: InstanceType<typeof import("naive-ui").NInput>["$slots"];
  dict?: never;
}

/**
 * 文本域配置
 */
interface TextareaFormItemConfig extends BaseFormItemConfig {
  component: "textarea";
  props?: import("naive-ui").InputProps;
  slots?: InstanceType<typeof import("naive-ui").NInput>["$slots"];
  dict?: never;
}

/**
 * 密码框配置
 */
interface PasswordFormItemConfig extends BaseFormItemConfig {
  component: "password";
  props?: import("naive-ui").InputProps;
  slots?: InstanceType<typeof import("naive-ui").NInput>["$slots"];
  dict?: never;
}

/**
 * 数字输入框配置
 */
interface NumberFormItemConfig extends BaseFormItemConfig {
  component: "number";
  props?: import("naive-ui").InputNumberProps;
  dict?: never;
}

/**
 * 选择器配置
 */
interface SelectFormItemConfig extends BaseFormItemConfig {
  component: "select";
  props?: import("naive-ui").SelectProps;
  slots?: InstanceType<typeof import("naive-ui").NSelect>["$slots"];
}

/**
 * 单选组配置
 */
interface RadioGroupFormItemConfig extends BaseFormItemConfig {
  component: "radio";
  props?: import("naive-ui").RadioGroupProps & {
    options: import("naive-ui").SelectOption[];
  };
}

/**
 * 多选组配置
 */
interface CheckboxGroupFormItemConfig extends BaseFormItemConfig {
  component: "checkbox";
  props?: import("naive-ui").CheckboxGroupProps & {
    options: import("naive-ui").SelectOption[];
  };
}

/**
 * 日期选择器配置
 */
interface DatePickerFormItemConfig extends BaseFormItemConfig {
  component: "date-picker";
  props?: import("naive-ui").DatePickerProps;
  slots?: InstanceType<typeof import("naive-ui").NDatePicker>["$slots"];
  dict?: never;
}

/**
 * 时间选择器配置
 */
interface TimePickerFormItemConfig extends BaseFormItemConfig {
  component: "time-picker";
  props?: import("naive-ui").TimePickerProps;
  dict?: never;
}

/**
 * 开关配置
 */
interface SwitchFormItemConfig extends BaseFormItemConfig {
  component: "switch";
  props?: import("naive-ui").SwitchProps;
  slots?: InstanceType<typeof import("naive-ui").NSwitch>["$slots"];
  dict?: never;
}

/**
 * 自定义组件配置
 */
interface CustomFormItemConfig extends BaseFormItemConfig {
  component: Component | (() => VNode);
  props?: Record<string, any>;
  slots?: Record<string, (val: any) => VNode[]>;
  dict?: never;
}

declare namespace FormPro {
  /**
   * 渲染组件的类型
   */
  type ComponentType =
    | "input"
    | "textarea"
    | "number"
    | "password"
    | "select"
    | "radio"
    | "checkbox"
    | "date-picker"
    | "time-picker"
    | "switch"
    | Component
    | (() => VNode);

  /**
   * 联合类型
   */
  type FormItemConfig =
    | InputFormItemConfig
    | TextareaFormItemConfig
    | PasswordFormItemConfig
    | NumberFormItemConfig
    | SelectFormItemConfig
    | RadioGroupFormItemConfig
    | CheckboxGroupFormItemConfig
    | DatePickerFormItemConfig
    | TimePickerFormItemConfig
    | SwitchFormItemConfig
    | CustomFormItemConfig;

  /**
   * FormPro 组件的 Props 类型
   */
  interface FormProProps<T = FormData> {
    formConfig?: FormItemConfig[];
    formProps?: Omit<import("naive-ui").FormProps, "model">;
    gridProps?: import("naive-ui").GridProps;
    operationSpan?: number;
    modelValue?: T;
  }

  /**
   * 表单组件实例方法
   */
  interface FormInstance {
    validate: () => Promise<void>;
    reset: () => void;
  }
}

declare namespace DataTablePro {
  interface Form {
    config?: FormPro.FormItemConfig[];
    props?: FormPro.FormProProps["formProps"];
    gridProps?: FormPro.FormProProps["gridProps"];
    resetText?: string;
    searchText?: string;
  }
}

declare namespace DialogForm {
  interface Form extends Omit<DataTablePro.Form, "resetText" | "searchText"> {}
  type DrawerProps = Omit<import("naive-ui").DrawerProps, "show">; // 抽屉属性
  type ModalProps = Omit<import("naive-ui").ModalProps, "show" | "segmented">; // 模态框属性
  interface Instance {
    open: (title: string, data: any) => void;
    close: () => void;
  }
}
