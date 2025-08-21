import ErrorTip from "@/components/ErrorTip.vue";

export default defineComponent({
  name: "Error404",
  render: () => <ErrorTip type="404" />,
});
