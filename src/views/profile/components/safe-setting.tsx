import { NCard, NFlex, NDivider } from "naive-ui";
import UserAPI from "@/api/system/user";
import { executeAsync, local, maskEmail, maskPhone } from "@/utils";
import { useCountdown } from "../hooks/useCountdown";

import { SecurityItem } from "./components/security-item";
import { ActionButton } from "./components/action-button";
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

    const { mobileCountdown, emailCountdown, startMobileCountdown, startEmailCountdown } =
      useCountdown();

    // #region 修改密码
    const passwordChangeForm = ref<User.PasswordChangeForm>({});
    const passwordChangeFormRef = ref();
    const updatePassword = () =>
      passwordChangeFormRef.value?.open(
        t("profile.changePassword.title"),
        passwordChangeForm.value
      );
    const submitPassword = async (val: User.PasswordChangeForm) =>
      executeAsync(
        () => UserAPI.changePassword(val),
        () => passwordChangeFormRef.value?.close(),
        t("profile.changePassword.success")
      );

    // #region 绑定/修改手机
    const mobileUpdateForm = ref<User.MobileUpdateForm>({});
    const mobileUpdateFormRef = ref();
    const updateMobile = () =>
      mobileUpdateFormRef.value?.open(t("profile.changePhone"), mobileUpdateForm.value);
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
    const emailUpdateForm = ref<User.EmailUpdateForm>({});
    const emailUpdateFormRef = ref();
    const updateEmail = () =>
      emailUpdateFormRef.value?.open(t("profile.changeEmail"), emailUpdateForm.value);
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
    const unbindFormRef = ref();
    const unbindForm = ref<User.UnbindParams>({});
    const unbindType = ref<1 | 2>(1);
    const unbindMobile = () => {
      unbindType.value = 1;
      unbindFormRef.value?.open(t("profile.unbindPhone"), unbindForm.value);
    };
    const unbindEmail = () => {
      unbindType.value = 2;
      unbindFormRef.value?.open(t("profile.unbindEmail"), unbindForm.value);
    };
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

        <PasswordForm
          formRef={passwordChangeFormRef}
          form={passwordChangeForm}
          onSubmit={submitPassword}
        />
        <MobileForm
          formRef={mobileUpdateFormRef}
          form={mobileUpdateForm}
          countdown={mobileCountdown}
          onSendCode={sendMobileCode}
          onSubmit={submitMobile}
        />
        <EmailForm
          formRef={emailUpdateFormRef}
          form={emailUpdateForm}
          countdown={emailCountdown}
          onSendCode={sendEmailCode}
          onSubmit={submitEmail}
        />
        <UnbindForm formRef={unbindFormRef} form={unbindForm} onSubmit={submitUnbind} />
      </>
    );
  },
});
