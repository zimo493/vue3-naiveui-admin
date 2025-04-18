import ErrorTip from "@/components/common/ErrorTip.vue";

export default defineComponent({
  name: "Error404",
  render: () => <ErrorTip type="404" />,
});
