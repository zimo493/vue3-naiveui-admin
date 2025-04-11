<script lang="tsx">
import { NTag } from "naive-ui";

export default defineComponent({
  name: "CommonStatus",
  props: {
    value: { type: Number, required: true },
    round: { type: Boolean, default: false },
    bordered: { type: Boolean, default: false },
  },
  setup({ value, round, bordered }) {
    return () => (
      <NTag bordered={bordered} round={round} type={value === 1 ? "success" : "error"}>
        {value === 1 ? "正常" : "禁用"}
      </NTag>
    );
  },
});
</script>
