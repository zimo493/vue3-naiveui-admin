import { local } from "@/utils";

export function useCountdown() {
  /** 从本地存储加载倒计时状态 */
  onMounted(() => loadCountdownState());

  /** 手机验证码倒计时 */
  const mobileCountdown = ref<number>(0);
  /** 邮箱验证码倒计时 */
  const emailCountdown = ref<number>(0);

  /** 加载倒计时状态 */
  const loadCountdownState = () => {
    const mobileExpireTime = local.get("mobileCodeExpireTime");
    const emailExpireTime = local.get("emailCodeExpireTime");

    if (mobileExpireTime) {
      const remainTime = Math.floor((mobileExpireTime - Date.now()) / 1000);

      if (remainTime > 0) {
        mobileCountdown.value = remainTime;
        startMobileCountdown();
      }
    }

    if (emailExpireTime) {
      const remainTime = Math.floor((emailExpireTime - Date.now()) / 1000);

      if (remainTime > 0) {
        emailCountdown.value = remainTime;
        startEmailCountdown();
      }
    }
  };

  /** 开始手机验证码倒计时 */
  const startMobileCountdown = () => {
    if (mobileCountdown.value <= 0) return;

    const timer = setInterval(() => {
      mobileCountdown.value--;
      if (mobileCountdown.value <= 0) {
        clearInterval(timer);
        local.remove("mobileCodeExpireTime");
      }
    }, 1000);
  };

  /** 开始邮箱验证码倒计时 */
  const startEmailCountdown = () => {
    if (emailCountdown.value <= 0) return;

    const timer = setInterval(() => {
      emailCountdown.value--;
      if (emailCountdown.value <= 0) {
        clearInterval(timer);
        local.remove("emailCodeExpireTime");
      }
    }, 1000);
  };

  return {
    mobileCountdown,
    emailCountdown,
    startMobileCountdown,
    startEmailCountdown,
  };
}
