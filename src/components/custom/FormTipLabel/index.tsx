import { NFlex, NText } from "naive-ui";
import HelpInfo from "@/components/common/HelpInfo.vue";

export default defineComponent({
  name: "FormTipLabel",
  props: {
    label: { type: String, default: "" },
    msg: { type: String, default: "" },
  },
  setup(props) {
    return () => (
      <NFlex justify="end" size={[3, 0]}>
        <NText>{props.label}</NText>
        <HelpInfo message={props.msg} />
      </NFlex>
    );
  },
});
