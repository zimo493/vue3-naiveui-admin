import { NCard, NFlex, NDivider } from "naive-ui";
import UserAPI from "@/api/system/user";
import { executeAsync, local, maskEmail, maskPhone } from "@/utils";
import { useCountdown } from "../hooks/useCountdown";

import { SecurityItem, ActionButton } from "./components/profile-widgets";
import { PasswordForm } from "./components/password-form";
import { MobileForm } from "./components/mobile-form";
import { EmailForm } from "./components/email-form";
import { UnbindForm } from "./components/unbind-form";

export default defineComponent({
  name: "ProfileSafeSetting",
  props: {
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
  },
  emits: ["success"],
  setup(props, { emit }) {
    const { phone, email } = toRefs(props);
    const { t } = useI18n();

    /** 验证码倒计时 */
    const { mobileCountdown, emailCountdown, startMobileCountdown, startEmailCountdown } =
      useCountdown();

    // #region 修改密码
    /** 修改密码表单数据 */
    const passwordChangeForm = ref<User.PasswordChangeForm>({});
    /** 修改密码表单引用 */
    const passwordChangeFormRef = ref();
    /** 打开修改密码弹窗 */
    const updatePassword = () =>
      passwordChangeFormRef.value?.open(
        t("profile.changePassword.title"),
        passwordChangeForm.value
      );
    /** 提交修改密码 */
    const submitPassword = async (val: User.PasswordChangeForm) =>
      executeAsync(
        () => UserAPI.changePassword(val),
        () => passwordChangeFormRef.value?.close(),
        t("profile.changePassword.success")
      );

    // #region 绑定/修改手机
    /** 修改手机表单数据 */
    const mobileUpdateForm = ref<User.MobileUpdateForm>({});
    /** 修改手机表单引用 */
    const mobileUpdateFormRef = ref();

    /** 打开修改手机弹窗 */
    const updateMobile = () =>
      mobileUpdateFormRef.value?.open(t("profile.changePhone"), mobileUpdateForm.value);

    /** 发送手机验证码 */
    const sendMobileCode = async () =>
      executeAsync(
        () => UserAPI.sendMobileCode(mobileUpdateForm.value.mobile),
        () => {
          mobileCountdown.value = 60;
          local.set("mobileCodeExpireTime", Date.now() + 60 * 1000);
          startMobileCountdown();
        },
        t("profile.sendCodeSuccess")
      );
    /** 提交修改手机 */
    const submitMobile = async (val: User.MobileUpdateForm) =>
      executeAsync(
        () => UserAPI.bindOrChangeMobile(val),
        () => {
          mobileUpdateFormRef.value?.close();
          emit("success");
        },
        t("profile.bindPhoneSuccess")
      );

    // #region 绑定/修改邮箱
    /** 修改邮箱表单数据 */
    const emailUpdateForm = ref<User.EmailUpdateForm>({});
    /** 修改邮箱表单引用 */
    const emailUpdateFormRef = ref();

    /** 打开修改邮箱弹窗 */
    const updateEmail = () =>
      emailUpdateFormRef.value?.open(t("profile.changeEmail"), emailUpdateForm.value);

    /** 发送邮箱验证码 */
    const sendEmailCode = async () =>
      executeAsync(
        () => UserAPI.sendEmailCode(emailUpdateForm.value.email),
        () => {
          emailCountdown.value = 60;
          local.set("emailCodeExpireTime", Date.now() + 60 * 1000);
          startEmailCountdown();
        },
        t("profile.sendCodeSuccess")
      );

    /** 提交修改邮箱 */
    const submitEmail = async (val: User.EmailUpdateForm) =>
      executeAsync(
        () => UserAPI.bindOrChangeEmail(val),
        () => {
          emailUpdateFormRef.value?.close();
          emit("success");
        },
        t("profile.bindEmailSuccess")
      );

    // #region 解绑
    /** 解绑表单引用 */
    const unbindFormRef = ref();
    /** 解绑表单数据 */
    const unbindForm = ref<User.UnbindParams>({});
    /**
     * 解绑类型
     * 1: 手机号
     * 2: 邮箱
     */
    const unbindType = ref<1 | 2>(1);

    /** 打开解绑手机弹窗 */
    const unbindMobile = () => {
      unbindType.value = 1;
      unbindFormRef.value?.open(t("profile.unbindPhone"), unbindForm.value);
    };
    const unbindEmail = () => {
      unbindType.value = 2;
      unbindFormRef.value?.open(t("profile.unbindEmail"), unbindForm.value);
    };

    /** 提交解绑 */
    const submitUnbind = async (val: User.UnbindParams) =>
      executeAsync(
        () => (unbindType.value === 1 ? UserAPI.unbindMobile(val) : UserAPI.unbindEmail(val)),
        () => {
          unbindFormRef.value?.close();
          emit("success");
        },
        t("profile.unbindSuccess", {
          type: unbindType.value === 1 ? t("tableHeader.phone") : t("tableHeader.email"),
        })
      );

    return () => (
      <>
        <NCard title={t("profile.securitySetting")} segmented={{ content: true }}>
          {/* 修改密码项 */}
          <SecurityItem
            icon="icon-park-outline:lock"
            color="var(--primary-color)"
            title={t("profile.accountPassword")}
            desc={t("profile.changePasswordTip")}
            action={() => (
              <ActionButton
                label={t("profile.changePassword.title")}
                icon="ant-design:edit-outlined"
                onClick={updatePassword}
              />
            )}
          />

          <NDivider />

          {/* 修改手机项 */}
          <SecurityItem
            icon="icon-park-outline:phone-call"
            color="var(--success-color)"
            title={t("tableHeader.phone")}
            desc={maskPhone(phone.value) || t("profile.notBind")}
            action={() => (
              <NFlex size={[10, 0]}>
                <ActionButton
                  label={phone.value ? t("button.replace") : t("button.bind")}
                  icon="ant-design:edit-outlined"
                  onClick={updateMobile}
                />
                {phone.value && (
                  <ActionButton
                    label={t("button.unbind")}
                    icon="ant-design:delete-outlined"
                    type="error"
                    onClick={unbindMobile}
                  />
                )}
              </NFlex>
            )}
          />

          <NDivider />

          {/* 修改邮箱项 */}
          <SecurityItem
            icon="icon-park-outline:mail-edit"
            color="var(--warning-color)"
            title={t("tableHeader.email")}
            desc={maskEmail(email.value) || t("profile.notBind")}
            action={() => (
              <NFlex size={[10, 0]}>
                <ActionButton
                  label={email.value ? t("button.replace") : t("button.bind")}
                  icon="ant-design:edit-outlined"
                  onClick={updateEmail}
                />
                {email.value && (
                  <ActionButton
                    label={t("button.unbind")}
                    icon="ant-design:delete-outlined"
                    type="error"
                    onClick={unbindEmail}
                  />
                )}
              </NFlex>
            )}
          />
        </NCard>

        {/* 修改密码弹窗 */}
        <PasswordForm
          formRef={passwordChangeFormRef}
          form={passwordChangeForm}
          onSubmit={submitPassword}
        />
        {/* 修改手机弹窗 */}
        <MobileForm
          formRef={mobileUpdateFormRef}
          form={mobileUpdateForm}
          countdown={mobileCountdown}
          onSendCode={sendMobileCode}
          onSubmit={submitMobile}
        />
        {/* 修改邮箱弹窗 */}
        <EmailForm
          formRef={emailUpdateFormRef}
          form={emailUpdateForm}
          countdown={emailCountdown}
          onSendCode={sendEmailCode}
          onSubmit={submitEmail}
        />
        {/* 解绑弹窗 */}
        <UnbindForm formRef={unbindFormRef} form={unbindForm} onSubmit={submitUnbind} />
      </>
    );
  },
});
