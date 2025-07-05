type Component = import("vue").Component;
type VNode = import("vue").VNode;

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
  label: string;
  component?: ComponentType; // 可选，默认为 input
  span?: number | ResponsiveSpan;
  dict?: string;
  hidden?: boolean;
  props?: Record<string, any>;
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
}

/**
 * 文本域配置
 */
interface TextareaFormItemConfig extends BaseFormItemConfig {
  component: "textarea";
  props?: import("naive-ui").InputProps;
  slots?: InstanceType<typeof import("naive-ui").NInput>["$slots"];
}

/**
 * 密码框配置
 */
interface PasswordFormItemConfig extends BaseFormItemConfig {
  component: "password";
  props?: import("naive-ui").InputProps;
  slots?: InstanceType<typeof import("naive-ui").NInput>["$slots"];
}

/**
 * 数字输入框配置
 */
interface NumberFormItemConfig extends BaseFormItemConfig {
  component: "number";
  props?: import("naive-ui").InputNumberProps;
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
  component: "radio-group";
  props?: import("naive-ui").RadioGroupProps & {
    options: import("naive-ui").SelectOption[];
  };
}

/**
 * 多选组配置
 */
interface CheckboxGroupFormItemConfig extends BaseFormItemConfig {
  component: "checkbox-group";
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
}

/**
 * 时间选择器配置
 */
interface TimePickerFormItemConfig extends BaseFormItemConfig {
  component: "time-picker";
  props?: import("naive-ui").TimePickerProps;
}

/**
 * 开关配置
 */
interface SwitchFormItemConfig extends BaseFormItemConfig {
  component: "switch";
  props?: import("naive-ui").SwitchProps;
  slots?: InstanceType<typeof import("naive-ui").NSwitch>["$slots"];
}

/**
 * 自定义组件配置
 */
interface CustomFormItemConfig extends BaseFormItemConfig {
  component: VNode | (() => VNode);
  props?: Record<string, any>;
  slots?: Record<string, (val: any) => VNode[]>;
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
    | "radio-group"
    | "checkbox-group"
    | "date-picker"
    | "time-picker"
    | "switch"
    | Component
    | VNode
    | (() => VNode | VNode[]);

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
  interface Search {
    formConfig: FormPro.FormItemConfig[];
    formProps?: FormPro.FormProProps["formProps"];
    gridProps?: FormPro.FormProProps["gridProps"];
    resetText?: string;
    searchText?: string;
  }
}
