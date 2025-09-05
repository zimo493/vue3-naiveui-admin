<script lang="tsx">
import { NFlex, NText } from "naive-ui";
import HelpInfo from "@/components/help-info.vue";

export default defineComponent({
  name: "FormTipLabel",
  props: {
    label: { type: String, default: "" },
    msg: { type: String, default: "" },
  },
  setup(props) {
    return () => (
      <NFlex justify="end" size={[4, 0]}>
        <HelpInfo message={props.msg} />
        <NText>{props.label}</NText>
      </NFlex>
    );
  },
});
</script>
