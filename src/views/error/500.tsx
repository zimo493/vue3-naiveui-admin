import ErrorTip from "@/components/ErrorTip.vue";

export default defineComponent({
  name: "Error500",
  render: () => <ErrorTip type="500" />,
});
