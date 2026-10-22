import ErrorTip from "@/components/error-tip.vue";

export default defineComponent({
  name: "ErrorPage403",
  render: () => <ErrorTip type="403" />,
});
