import { NFlex, NText, NEl } from "naive-ui";
import Icones from "@/components/icones.vue";

interface SecurityItemProps {
  icon: string;
  color: string;
  title: string;
  desc?: string;
  action?: () => VNode;
}

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
