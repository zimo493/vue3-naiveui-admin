import { useLoading } from "@/hooks";
import { $t } from "./i18n";

const { loading: spin, startLoading: startSpin, endLoading: endSpin } = useLoading();

/**
 * 通用异步执行函数
 * @param apiCall API调用函数
 * @param onSuccess 成功回调
 * @param message 成功消息
 */
const executeAsync = async <T>(
  apiCall: () => Promise<T>,
  onSuccess?: (data: T) => void | Promise<void>,
  message: string | null = $t("message.operateSuccess")
) => {
  try {
    startSpin();
    const data = await apiCall();

    if (message) {
      window.$message.success(message);
    }
    if (onSuccess) {
      await onSuccess(data);
    }

    return data;
  } catch (error) {
    console.error(error);

    return null;
  } finally {
    endSpin();
  }
};

export { spin, startSpin, endSpin, executeAsync };
