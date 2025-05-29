import { local } from "@/utils";

/**
 * 启动倒计时函数
 * @param countdownRef 响应式倒计时引用
 * @param storageKey 本地存储的键名
 */
const startCountdown = (countdownRef: Ref<number>, storageKey: keyof Local): void => {
  if (countdownRef.value <= 0) return;

  const timer = setInterval(() => {
    countdownRef.value--;

    if (countdownRef.value <= 0) {
      clearInterval(timer);
      local.remove(storageKey);
    }
  }, 1000);
};

/**
 * 初始化倒计时
 * @param expireTime 过期时间戳
 * @param countdownRef 倒计时响应式引用
 * @param startFn 启动倒计时的函数
 */
const initCountdown = (
  expireTime: number | undefined | null,
  countdownRef: Ref<number>,
  startFn: () => void
): void => {
  if (expireTime) {
    const remainTime = Math.floor((expireTime - Date.now()) / 1000);

    if (remainTime > 0) {
      countdownRef.value = remainTime;
      startFn();
    }
  }
};

export const useCountdown = () => {
  /** 从本地存储加载倒计时状态 */
  onMounted(() => loadCountdownState());

  /** 手机验证码倒计时 */
  const mobileCountdown = ref<number>(0);
  /** 邮箱验证码倒计时 */
  const emailCountdown = ref<number>(0);

  /** 加载倒计时状态 */
  const loadCountdownState = () => {
    initCountdown(local.get("mobileCodeExpireTime"), mobileCountdown, startMobileCountdown);
    initCountdown(local.get("emailCodeExpireTime"), emailCountdown, startEmailCountdown);
  };

  /** 开始手机验证码倒计时 */
  const startMobileCountdown = () => startCountdown(mobileCountdown, "mobileCodeExpireTime");
  /** 开始邮箱验证码倒计时 */
  const startEmailCountdown = () => startCountdown(emailCountdown, "emailCodeExpireTime");

  return {
    mobileCountdown,
    emailCountdown,
    startMobileCountdown,
    startEmailCountdown,
  };
};
