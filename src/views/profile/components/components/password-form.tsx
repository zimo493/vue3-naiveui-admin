import type { FormItemRule } from "naive-ui";
import { spin } from "@/utils";
import ModalForm from "@/components/modal-form.vue";

interface PasswordFormProps {
  formRef: Ref;
  form: Ref<User.PasswordChangeForm>;
  onSubmit: (val: User.PasswordChangeForm) => Promise<null>;
}

export const PasswordForm = (props: PasswordFormProps) => {
  const { t } = useI18n();

  return (
    <ModalForm<User.PasswordChangeForm>
      width={500}
      loading={spin.value}
      props={{ draggable: true }}
      ref={props.formRef}
      form={{
        config: [
          {
            name: "oldPassword",
            label: t("profile.changePassword.oldPassword"),
            component: "password",
          },
          {
            name: "newPassword",
            label: t("profile.changePassword.newPassword"),
            component: "password",
          },
          {
            name: "confirmPassword",
            label: t("profile.changePassword.confirmPassword"),
            component: "password",
          },
        ],
        props: {
          rules: {
            oldPassword: [
              {
                required: true,
                message: t("input") + t("profile.changePassword.oldPassword"),
                trigger: "blur",
              },
            ],
            newPassword: [
              {
                required: true,
                message: t("input") + t("profile.changePassword.newPassword"),
                trigger: "blur",
              },
            ],
            confirmPassword: [
              {
                required: true,
                message: t("input") + t("profile.changePassword.confirmPassword"),
                trigger: "blur",
              },
              {
                validator: (_rule: FormItemRule, value: string) =>
                  new Promise((resolve, reject) =>
                    value !== props.form.value.newPassword
                      ? reject(new Error(t("register.passwordNotMatch")))
                      : resolve()
                  ),
                trigger: "blur",
              },
            ],
          },
        },
      }}
      model-value={props.form.value}
      onSubmit={props.onSubmit}
    />
  );
};
