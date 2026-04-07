import { spin } from "@/utils";
import ModalForm from "@/components/modal-form.vue";

interface UnbindFormProps {
  formRef: Ref;
  form: Ref<User.UnbindParams>;
  onSubmit: (val: User.UnbindParams) => Promise<null>;
}

export const UnbindForm = (props: UnbindFormProps) => {
  const { t } = useI18n();

  return (
    <ModalForm<User.UnbindParams>
      width={500}
      ref={props.formRef}
      loading={spin.value}
      props={{ draggable: true }}
      form={{
        config: [{ name: "password", label: t("profile.accountPassword") }],
        props: {
          rules: {
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
    />
  );
};
