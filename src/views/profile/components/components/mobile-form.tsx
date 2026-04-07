import { NFlex, NButton, NInputOtp } from "naive-ui";
import { spin } from "@/utils";
import ModalForm from "@/components/modal-form.vue";

interface MobileFormProps {
  formRef: Ref;
  form: Ref<User.MobileUpdateForm>;
  countdown: Ref<number>;
  onSendCode: () => Promise<null>;
  onSubmit: (val: User.MobileUpdateForm) => Promise<null>;
}

export const MobileForm = (props: MobileFormProps) => {
  const { t } = useI18n();

  return (
    <ModalForm<User.MobileUpdateForm>
      width={500}
      loading={spin.value}
      ref={props.formRef}
      props={{ draggable: true }}
      form={{
        config: [
          { name: "mobile", label: t("tableHeader.phone") },
          { name: "code", label: t("login.captcha") },
          { name: "password", label: t("profile.accountPassword") },
        ],
        props: {
          rules: {
            mobile: [
              { required: true, message: t("input") + t("tableHeader.phone"), trigger: "blur" },
              { pattern: /^1[3-9]\d{9}$/, message: t("rules.phone"), trigger: "blur" },
            ],
            code: [{ required: true, message: t("input") + t("login.captcha"), trigger: "blur" }],
            password: [
              {
                required: true,
                message: t("input") + t("profile.accountPassword"),
                trigger: "blur",
              },
            ],
          },
        },
      }}
      model-value={props.form.value}
      onSubmit={props.onSubmit}
      v-slots={{
        code: () => (
          <NFlex class="w-full">
            <NInputOtp class="flex-1" block={true} v-model:value={props.form.value.code} />
            <NButton
              type="info"
              strong
              disabled={!props.form.value.mobile || props.countdown.value > 0}
              loading={spin.value}
              onClick={props.onSendCode}
            >
              {props.countdown.value > 0
                ? t("profile.seconds", { val: props.countdown.value })
                : t("profile.sendCode")}
            </NButton>
          </NFlex>
        ),
      }}
    />
  );
};
