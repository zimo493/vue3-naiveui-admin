<script lang="tsx">
import { NTag } from "naive-ui";

export default defineComponent({
  name: "CommonStatus",
  props: {
    value: { type: Number, required: true },
    round: { type: Boolean, default: false },
    bordered: { type: Boolean, default: false },
  },
  setup(props) {
    const { value, round, bordered } = toRefs(props);

    const { t } = useI18n();

    return () => (
      <NTag
        bordered={bordered.value}
        round={round.value}
        type={value.value === 1 ? "success" : "error"}
      >
        {value.value === 1 ? t("statusTag.normal") : t("statusTag.disable")}
      </NTag>
    );
  },
});
</script>
