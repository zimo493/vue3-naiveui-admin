import type { ButtonProps } from "naive-ui";
import type { VNode } from "vue";
import { NFlex, NText, NEl, NButton } from "naive-ui";
import Icones from "@/components/icones.vue";

interface DescLabelProps {
  icon: string;
  label: string;
}

/**
 * 描述列表项的 label 插槽
 */
export const DescLabel = (props: DescLabelProps) => (
  <NFlex align="center" size={[6, 0]}>
    <Icones icon={props.icon} />
    <NText>{props.label}</NText>
  </NFlex>
);

interface ActionButtonProps {
  label: string;
  icon: string;
  type?: ButtonProps["type"];
  onClick?: () => void;
}

/**
 * 操作按钮
 */
export const ActionButton = (props: ActionButtonProps) => (
  <NButton
    strong
    tertiary
    type={props.type ?? "primary"}
    v-slots={{ icon: () => <Icones icon={props.icon} /> }}
    onClick={props.onClick}
  >
    {props.label}
  </NButton>
);

interface SecurityItemProps {
  icon: string;
  color: string;
  title: string;
  desc?: string;
  action?: () => VNode;
}

/**
 * 安全项
 */
export const SecurityItem = (props: SecurityItemProps) => (
  <NFlex align="center" justify="space-between" class="p-2">
    <NFlex align="center">
      <NEl
        class="flex-center w-50px h-50px rounded-4px"
        style={{ background: `color-mix(in srgb, ${props.color} 12%, transparent)` }}
      >
        <Icones icon={props.icon} size={22} color={props.color} />
      </NEl>
      <NFlex vertical size={[0, 4]}>
        <NText class="text-16px">{props.title}</NText>
        {props.desc && <NText depth={3}>{props.desc}</NText>}
      </NFlex>
    </NFlex>
    {props.action?.()}
  </NFlex>
);
