import type { DefineComponent } from "vue";
import ErrorTip from "@/components/common/ErrorTip.vue";

const Error403: DefineComponent = defineComponent({
  name: "Error403",
  render: () => <ErrorTip type="403" />,
});

export default Error403;
