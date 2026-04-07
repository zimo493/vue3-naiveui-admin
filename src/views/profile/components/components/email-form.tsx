import { NFlex, NButton, NInputOtp } from "naive-ui";
import { spin } from "@/utils";
import ModalForm from "@/components/modal-form.vue";

interface EmailFormProps {
  formRef: Ref;
  form: Ref<User.EmailUpdateForm>;
  countdown: Ref<number>;
  onSendCode: () => Promise<null>;
  onSubmit: (val: User.EmailUpdateForm) => Promise<null>;
}

export const EmailForm = (props: EmailFormProps) => {
  const { t } = useI18n();

  return (
    <ModalForm<User.EmailUpdateForm>
      width={500}
      loading={spin.value}
      ref={props.formRef}
      props={{ draggable: true }}
      form={{
        config: [
          { name: "email", label: t("tableHeader.email") },
          { name: "code", label: t("login.captcha") },
          { name: "password", label: t("profile.accountPassword") },
        ],
        props: {
          rules: {
            email: [
              { required: true, message: t("input") + t("tableHeader.email"), trigger: "blur" },
              {
                pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                message: t("rules.email"),
                trigger: "blur",
              },
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
              disabled={!props.form.value.email || props.countdown.value > 0}
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
