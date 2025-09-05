import ErrorTip from "@/components/error-tip.vue";

export default defineComponent({
  name: "Error404",
  render: () => <ErrorTip type="404" />,
});
