<script lang="tsx">
import { NEl, NText } from "naive-ui";
import HelpInfo from "@/components/help-info.vue";

export default defineComponent({
  name: "FormTipLabel",
  props: {
    label: { type: String, default: "" },
    msg: { type: String, default: "" },
    reverse: { type: Boolean, default: false },
  },
  setup({ reverse, msg, label }) {
    const style = {
      display: "flex",
      justifyContent: "flex-end",
      gap: "0 4px",
      flexDirection: reverse ? "row-reverse" : "row",
    };

    return () => (
      <NEl style={style}>
        <HelpInfo message={msg} />
        {label && <NText>{label}</NText>}
      </NEl>
    );
  },
});
</script>
