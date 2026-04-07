import type { ButtonProps } from "naive-ui";
import { NButton } from "naive-ui";
import Icones from "@/components/icones.vue";

interface ActionButtonProps {
  label: string;
  icon: string;
  type?: ButtonProps["type"];
  onClick?: () => void;
}

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
