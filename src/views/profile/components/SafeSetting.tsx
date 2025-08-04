import { NCard, NFlex, NText, NButton, type FormItemRule } from "naive-ui";

import UserAPI from "@/api/system/user";
import { executeAsync, spin } from "@/utils";

import Icones from "@/components/common/Icones.vue";
import ModalForm from "@/components/custom/ModalForm.vue";

export default defineComponent({
  name: "ProfileSafeSetting",
  setup() {
    /** 修改用户密码配置 */
    const passwordChangeForm = ref<User.PasswordChangeForm>({}); // 修改密码表单
    const passwordChangeFormRef = ref();

    /** 修改用户密码 */
    const updatePassword = () =>
      passwordChangeFormRef.value?.open("修改密码", passwordChangeForm.value);
    /** 修改用户密码提交 */
    const submitPassword = async (val: User.PasswordChangeForm) =>
      executeAsync(
        () => UserAPI.changePassword(val),
        () => passwordChangeFormRef.value?.close(),
        "密码修改成功"
      );

    return () => (
      <>
        <NCard title="安全设置" segmented={{ content: true }}>
          <NFlex align="center" justify="space-between" class="p-2">
            <NFlex vertical>
              <NText class="text-16px">账户密码</NText>
              <NText depth={3}>定期修改密码有助于保护账户安全</NText>
            </NFlex>
            <NButton
              quaternary
              type="primary"
              v-slots={{
                icon: () => <Icones icon="ant-design:edit-outlined" />,
              }}
              onClick={updatePassword}
            >
              修改密码
            </NButton>
          </NFlex>
        </NCard>
        {/* 修改密码表单 */}
        <ModalForm
          width={500}
          loading={spin.value}
          props={{ draggable: true }}
          ref={passwordChangeFormRef}
          form={{
            config: [
              { name: "oldPassword", label: "旧密码", component: "password" },
              { name: "newPassword", label: "新密码", component: "password" },
              { name: "confirmPassword", label: "确认密码", component: "password" },
            ],
            props: {
              rules: {
                oldPassword: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
                newPassword: [{ required: true, message: "请输入新密码", trigger: "blur" }],
                confirmPassword: [
                  { required: true, message: "请输入确认密码", trigger: "blur" },
                  {
                    validator: (_rule: FormItemRule, value: string) =>
                      new Promise((resolve, reject) =>
                        value !== passwordChangeForm.value.newPassword
                          ? reject(new Error("两次输入的密码不一致"))
                          : resolve()
                      ),
                    trigger: "blur",
                  },
                ],
              },
              labelWidth: 80,
            },
          }}
          model-value={passwordChangeForm.value}
          onSubmit={submitPassword}
        />
      </>
    );
  },
});
