type Component = import("vue").Component;
type VNode = import("vue").VNode;
type GridFromItem = import("naive-ui").GridItemProps & import("naive-ui").FormItemProps;

/**
 * Component types that can be used in the form
 * 表单中可使用的组件类型
 */
type CompType =
  | "input" // Input field
  | "textarea" // Text area
  | "number" // Number input
  | "password" // Password input
  | "select" // Select dropdown
  | "radio" // Radio group
  | "radio-button" // Radio button group
  | "checkbox" // Checkbox group
  | "date" // Date picker
  | "time" // Time picker
  | "color-picker" // Color picker
  | "slider" // Slider
  | "switch" // Switch
  | "tree-select" // Tree selector
  | "text" // Text display
  | Component // Custom Vue component
  | (() => VNode); // Function returning VNode

/**
 * Responsive span configuration for different screen sizes
 * 不同屏幕尺寸下的响应式跨度配置
 */
interface ResponsiveSpan {
  /** Screen width < 768px (e.g., mobile phones) */
  mobile?: number;
  /** Screen width 768px - 1024px (e.g., tablets) */
  tablet?: number;
  /** Screen width >= 1024px (e.g., desktops) */
  desktop?: number;
}

/**
 * Base form item configuration
 * 基础表单项配置
 */
interface BaseFormItemConfig {
  /** Field name (required) - 字段名（必填） */
  name: string;
  /** Label text - 标签文本 */
  label?: string;
  /** Component type (default: "input") - 组件类型（默认："input"） */
  component?: CompType;
  /** Grid span (1-24) - 栅格跨度（1-24） */
  span?: number;
  /** Dictionary code for select options - 字典编码（用于选择项） */
  dict?: string;
  /** Whether to hide the field - 是否隐藏字段 */
  hidden?: boolean;
  /** Component props - 组件属性 */
  props?: Record<string, any>;
  /** Form item props - 表单项属性 */
  formItemProps?: Omit<GridFromItem, "path" | "span" | "label">;
  /** Label message (tooltip) - 标签提示信息 */
  labelMessage?: string;
  /** Whether to reverse the label message icon position - 是否反转标签提示信息图标位置 */
  labelReverse?: boolean;
  /** Block message below the component - 组件下方的块状提示信息 */
  blockMessage?: string | Component | (() => VNode);
  /** Component slots - 组件插槽 */
  slots?: Record<string, (val: never) => VNode[]>;
}

/**
 * Input field configuration
 * 输入框配置
 */
interface InputFormItemConfig extends BaseFormItemConfig {
  /** Component type - 组件类型 */
  component?: "input";
  /** Component props - 组件属性 */
  props?: import("naive-ui").InputProps;
  /** Component slots - 组件插槽 */
  slots?: InstanceType<typeof import("naive-ui").NInput>["$slots"];
  /** Dictionary code - 字典编码 */
  dict?: never;
}

/**
 * Textarea configuration
 * 文本域配置
 */
interface TextareaFormItemConfig extends BaseFormItemConfig {
  /** Component type - 组件类型 */
  component: "textarea";
  /** Component props - 组件属性 */
  props?: import("naive-ui").InputProps;
  /** Component slots - 组件插槽 */
  slots?: InstanceType<typeof import("naive-ui").NInput>["$slots"];
  /** Dictionary code - 字典编码 */
  dict?: never;
}

/**
 * Password input configuration
 * 密码框配置
 */
interface PasswordFormItemConfig extends BaseFormItemConfig {
  /** Component type - 组件类型 */
  component: "password";
  /** Component props - 组件属性 */
  props?: import("naive-ui").InputProps;
  /** Component slots - 组件插槽 */
  slots?: InstanceType<typeof import("naive-ui").NInput>["$slots"];
  /** Dictionary code - 字典编码 */
  dict?: never;
}

/**
 * Number input configuration
 * 数字输入框配置
 */
interface NumberFormItemConfig extends BaseFormItemConfig {
  /** Component type - 组件类型 */
  component: "number";
  /** Component props - 组件属性 */
  props?: import("naive-ui").InputNumberProps;
  /** Dictionary code - 字典编码 */
  dict?: never;
}

/**
 * Select dropdown configuration
 * 选择器配置
 */
interface SelectFormItemConfig extends BaseFormItemConfig {
  /** Component type - 组件类型 */
  component: "select";
  /** Component props - 组件属性 */
  props?: import("naive-ui").SelectProps;
  /** Component slots - 组件插槽 */
  slots?: InstanceType<typeof import("naive-ui").NSelect>["$slots"];
}

/**
 * Tree selector configuration
 * 树形选择配置
 */
interface TreeSelectFormItemConfig extends BaseFormItemConfig {
  /** Component type - 组件类型 */
  component: "tree-select";
  /** Component props - 组件属性 */
  props?: import("naive-ui").TreeSelectProps;
  /** Component slots - 组件插槽 */
  slots?: InstanceType<typeof import("naive-ui").NTreeSelect>["$slots"];
  /** Dictionary code - 字典编码 */
  dict?: never;
}

/**
 * Radio group configuration
 * 单选组配置
 */
interface RadioGroupFormItemConfig extends BaseFormItemConfig {
  /** Component type - 组件类型 */
  component: "radio";
  /** Component props - 组件属性 */
  props?: import("naive-ui").RadioGroupProps & {
    options: import("naive-ui").SelectOption[];
  };
}

/**
 * Radio button group configuration
 * 单选按钮组配置
 */
interface RadioButtonGroupFormItemConfig extends BaseFormItemConfig {
  /** Component type - 组件类型 */
  component: "radio-button";
  /** Component props - 组件属性 */
  props?: import("naive-ui").RadioGroupProps & {
    options: import("naive-ui").SelectOption[];
  };
}

/**
 * Checkbox group configuration
 * 多选组配置
 */
interface CheckboxGroupFormItemConfig extends BaseFormItemConfig {
  /** Component type - 组件类型 */
  component: "checkbox";
  /** Component props - 组件属性 */
  props?: import("naive-ui").CheckboxGroupProps & {
    options: import("naive-ui").SelectOption[];
  };
  /** Component slots - 组件插槽 */
  slots?: InstanceType<typeof import("naive-ui").NCheckboxGroup>["$slots"];
}

/**
 * Date picker configuration
 * 日期选择器配置
 */
interface DatePickerFormItemConfig extends BaseFormItemConfig {
  /** Component type - 组件类型 */
  component: "date";
  /** Component props - 组件属性 */
  props?: import("naive-ui").DatePickerProps;
  /** Component slots - 组件插槽 */
  slots?: InstanceType<typeof import("naive-ui").NDatePicker>["$slots"];
  /** Dictionary code - 字典编码 */
  dict?: never;
}

/**
 * Time picker configuration
 * 时间选择器配置
 */
interface TimePickerFormItemConfig extends BaseFormItemConfig {
  /** Component type - 组件类型 */
  component: "time";
  /** Component props - 组件属性 */
  props?: import("naive-ui").TimePickerProps;
  /** Component slots - 组件插槽 */
  slots?: InstanceType<typeof import("naive-ui").NTimePicker>["$slots"];
  /** Dictionary code - 字典编码 */
  dict?: never;
}

/**
 * Color picker configuration
 * 颜色选择器配置
 */
interface ColorPickerFormItemConfig extends BaseFormItemConfig {
  /** Component type - 组件类型 */
  component: "color-picker";
  /** Component props - 组件属性 */
  props?: import("naive-ui").ColorPickerProps;
  /** Component slots - 组件插槽 */
  slots?: InstanceType<typeof import("naive-ui").NColorPicker>["$slots"];
  /** Dictionary code - 字典编码 */
  dict?: never;
}

/**
 * Slider configuration
 * 滑块选择器配置
 */
interface SliderFormItemConfig extends BaseFormItemConfig {
  /** Component type - 组件类型 */
  component: "slider";
  /** Component props - 组件属性 */
  props?: import("naive-ui").SliderProps;
  /** Component slots - 组件插槽 */
  slots?: InstanceType<typeof import("naive-ui").NSlider>["$slots"];
  /** Dictionary code - 字典编码 */
  dict?: never;
}

/**
 * Switch configuration
 * 开关配置
 */
interface SwitchFormItemConfig extends BaseFormItemConfig {
  /** Component type - 组件类型 */
  component: "switch";
  /** Component props - 组件属性 */
  props?: import("naive-ui").SwitchProps;
  /** Component slots - 组件插槽 */
  slots?: InstanceType<typeof import("naive-ui").NSwitch>["$slots"];
  /** Dictionary code - 字典编码 */
  dict?: never;
}

/**
 * Text display configuration
 * 文本配置
 */
interface TextFormItemConfig extends BaseFormItemConfig {
  /** Component type - 组件类型 */
  component: "text";
  /** Component props - 组件属性 */
  props?: import("naive-ui").TextProps;
  /** Component slots - 组件插槽 */
  slots?: InstanceType<typeof import("naive-ui").NText>["$slots"];
  /** Dictionary code - 字典编码 */
  dict?: never;
}

/**
 * Custom component configuration
 * 自定义组件配置
 */
interface CustomFormItemConfig extends BaseFormItemConfig {
  /** Component type - 组件类型 */
  component: Component | (() => VNode);
  /** Component props - 组件属性 */
  props?: Record<string, any>;
  /** Component slots - 组件插槽 */
  slots?: Record<string, (val: any) => VNode[]>;
  /** Dictionary code - 字典编码 */
  dict?: never;
}

declare namespace FormPro {
  /**
   * Component types that can be used in the form
   * 表单中可使用的组件类型
   */
  type ComponentType = CompType;

  /**
   * Union type of all form item configurations
   * 所有表单项配置的联合类型
   */
  type FormItemConfig =
    | InputFormItemConfig
    | TextareaFormItemConfig
    | PasswordFormItemConfig
    | NumberFormItemConfig
    | SelectFormItemConfig
    | RadioGroupFormItemConfig
    | RadioButtonGroupFormItemConfig
    | CheckboxGroupFormItemConfig
    | DatePickerFormItemConfig
    | TimePickerFormItemConfig
    | ColorPickerFormItemConfig
    | SliderFormItemConfig
    | SwitchFormItemConfig
    | CustomFormItemConfig
    | TreeSelectFormItemConfig
    | TextFormItemConfig;

  /**
   * Props type for FormPro component
   * FormPro 组件的 Props 类型
   */
  interface FormProProps<T = Recordable> {
    /** Form configuration - 表单配置 */
    formConfig?: FormItemConfig[];
    /** Form props (excluding model) - 表单属性（不包括 model）*/
    formProps?: Omit<import("naive-ui").FormProps, "model">;
    /** Grid props - 栅格属性 */
    gridProps?: import("naive-ui").GridProps;
    /** Operation area span - 操作区域跨度 */
    operationSpan?: number;
    /** Form model value - 表单模型值 */
    modelValue?: T;
  }

  /**
   * Form component instance methods
   * 表单组件实例方法
   */
  interface FormInstance {
    /** Validate the form - 验证表单 */
    validate: () => Promise<void>;
    /** Reset the form - 重置表单 */
    reset: () => void;
  }
}

declare namespace DataTablePro {
  /**
   * DataTablePro form configuration
   * DataTablePro 表单配置
   */
  interface Form {
    /** Form item configurations - 表单项配置 */
    config?: FormPro.FormItemConfig[];
    /** Form props - 表单属性 */
    props?: FormPro.FormProProps["formProps"];
    /** Grid props - 栅格属性 */
    gridProps?: FormPro.FormProProps["gridProps"];
    /** Positive button text - 确定按钮文本 */
    positiveText?: string;
    /** Negative button text - 取消按钮文本 */
    negativeText?: string;
  }
}

declare namespace DialogForm {
  /** Form configuration type - 表单配置类型 */
  type Form = DataTablePro.Form;

  /** Drawer component props (excluding show) - 抽屉组件属性（不包括 show）*/
  type DrawerProps = Omit<import("naive-ui").DrawerProps, "show">;

  /** Modal component props (excluding show, segmented, preset) - 模态框组件属性（不包括 show, segmented, preset）*/
  type ModalProps = Omit<import("naive-ui").ModalProps, "show" | "segmented" | "preset">;

  /**
   * Dialog form instance methods
   * 对话框表单实例方法
   */
  interface Instance<T> {
    /** Open the dialog - 打开对话框 */
    open: (title: string, data: T) => void;
    /** Close the dialog - 关闭对话框 */
    close: () => void;
  }
}
