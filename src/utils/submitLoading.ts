import { useLoading } from "@/hooks";

const {
  loading: submitLoading,
  startLoading: startSubmitLoading,
  endLoading: endSubmitLoading,
} = useLoading();

export { submitLoading, startSubmitLoading, endSubmitLoading };
