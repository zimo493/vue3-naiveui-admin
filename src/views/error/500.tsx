import ErrorTip from "@/components/error-tip.vue";

export default defineComponent({
  name: "Error500",
  render: () => <ErrorTip type="500" />,
});
