import ErrorTip from "@/components/error-tip.vue";

export default defineComponent({
  name: "ErrorPage404",
  render: () => <ErrorTip type="404" />,
});
