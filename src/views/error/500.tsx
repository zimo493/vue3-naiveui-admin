import ErrorTip from "@/components/common/ErrorTip.vue";

export default defineComponent({
  name: "Error500",
  render: () => <ErrorTip type="500" />,
});
