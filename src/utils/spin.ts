import { useLoading } from "@/hooks";

const { loading: spin, startLoading: startSpin, endLoading: endSpin } = useLoading();

export { spin, startSpin, endSpin };
