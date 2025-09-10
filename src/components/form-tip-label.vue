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
    return () => (
      <NEl class={`flex justify-end gap-x-1 ${reverse ? "flex-row-reverse" : "flex-row"}`}>
        <HelpInfo message={msg} />
        {label && <NText>{label}</NText>}
      </NEl>
    );
  },
});
</script>
