import ErrorTip from "@/components/error-tip.vue";

export default defineComponent({
  name: "ErrorPage500",
  render: () => <ErrorTip type="500" />,
});
