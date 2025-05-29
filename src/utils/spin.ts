import { useLoading } from "@/hooks";

const { loading: spin, startLoading: startSpin, endLoading: endSpin } = useLoading();

/** 通用异步操作执行器 */
const executeAsync = async <T = null>(
  asyncFn: () => Promise<T>,
  onSuccess?: () => void,
  message = "操作成功"
) => {
  try {
    startSpin();
    await asyncFn();
    window.$message.success(message);
    onSuccess?.();
  } catch (err) {
    console.error(err);
  } finally {
    endSpin();
  }
};

export { spin, startSpin, endSpin, executeAsync };
