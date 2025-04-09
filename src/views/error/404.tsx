import type { DefineComponent } from "vue";
import ErrorTip from "@/components/common/ErrorTip.vue";

const Error404: DefineComponent = defineComponent({
  name: "Error404",
  render: () => <ErrorTip type="404" />,
});

export default Error404;
