import type { DefineComponent } from "vue";
import ErrorTip from "@/components/common/ErrorTip.vue";

const Error500: DefineComponent = defineComponent({
  name: "Error404",
  render: () => <ErrorTip type="500" />,
});

export default Error500;
