import { NCard, NFlex, NText, NButton, type FormItemRule } from "naive-ui";

import UserAPI from "@/api/system/user";
import { executeAsync, spin } from "@/utils";

import Icones from "@/components/icones.vue";
import ModalForm from "@/components/modal-form.vue";

export default defineComponent({
  name: "ProfileSafeSetting",
  setup() {
    const { t } = useI18n();

    /** 修改用户密码配置 */
    const passwordChangeForm = ref<User.PasswordChangeForm>({}); // 修改密码表单
    const passwordChangeFormRef = ref();

    /** 修改用户密码 */
    const updatePassword = () =>
      passwordChangeFormRef.value?.open(
        t("profile.changePassword.title"),
        passwordChangeForm.value
      );
    /** 修改用户密码提交 */
    const submitPassword = async (val: User.PasswordChangeForm) =>
      executeAsync(
        () => UserAPI.changePassword(val),
        () => passwordChangeFormRef.value?.close(),
        t("profile.changePassword.success")
      );

    return () => (
      <>
        <NCard title={t("profile.securitySetting")} segmented={{ content: true }}>
          <NFlex align="center" justify="space-between" class="p-2">
            <NFlex vertical>
              <NText class="text-16px">{t("profile.accountPassword")}</NText>
              <NText depth={3}>{t("profile.changePasswordTip")}</NText>
            </NFlex>
            <NButton
              quaternary
              type="primary"
              v-slots={{ icon: () => <Icones icon="ant-design:edit-outlined" /> }}
              onClick={updatePassword}
            >
              {t("profile.changePassword.title")}
            </NButton>
          </NFlex>
        </NCard>
        {/* 修改密码表单 */}
        <ModalForm<User.PasswordChangeForm>
          width={500}
          loading={spin.value}
          props={{ draggable: true }}
          ref={passwordChangeFormRef}
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
                        value !== passwordChangeForm.value.newPassword
                          ? reject(new Error(t("register.passwordNotMatch")))
                          : resolve()
                      ),
                    trigger: "blur",
                  },
                ],
              },
            },
          }}
          model-value={passwordChangeForm.value}
          onSubmit={submitPassword}
        />
      </>
    );
  },
});
