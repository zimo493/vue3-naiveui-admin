import {
  NCard,
  NDescriptions,
  NDescriptionsItem,
  NFlex,
  NText,
  NTag,
  NButton,
  NInputOtp,
} from "naive-ui";

import UserAPI from "@/api/system/user";
import { useDict } from "@/hooks";
import { executeAsync, spin, local } from "@/utils";
import { useCountdown } from "../hooks/useCountdown";

import Icones from "@/components/icones.vue";
import ModalForm from "@/components/modal-form.vue";

export default defineComponent({
  name: "ProfileAccountInfo",
  props: {
    userProfile: {
      type: Object as PropType<User.ProfileVO>,
      default: () => ({}),
    },
  },
  emits: ["success"],
  setup(props, { emit }) {
    const { userProfile } = toRefs(props);

    const { t } = useI18n();
    const { gender } = useDict("gender");
    /** 倒计时钩子 */
    const { mobileCountdown, emailCountdown, startMobileCountdown, startEmailCountdown } =
      useCountdown();

    /** 性别计算属性 */
    const genderProps = computed(() => {
      const profile = userProfile.value;
      const genderItem = gender.value.find((item) => +item.value === profile.gender);

      return {
        icon:
          profile.gender === 1
            ? "ant-design:man-outlined"
            : profile.gender === 2
              ? "ant-design:woman-outlined"
              : "ant-design:question-outlined",
        tagType: genderItem?.tagType || "default",
      };
    });

    const genderIcon = computed(() => genderProps.value.icon);
    const genderTagType = computed(() => genderProps.value.tagType);

    /** 修改手机信息配置 */
    const mobileUpdateForm = ref<User.MobileUpdateForm>({}); // 修改手机表单
    const mobileUpdateFormRef = ref();

    /** 绑定手机 */
    const updateMobile = () => {
      mobileUpdateForm.value = {
        mobile: userProfile.value.mobile,
      };
      mobileUpdateFormRef.value?.open(t("profile.changePhone"), mobileUpdateForm.value);
    };

    /** 绑定手机获取验证码 */
    const sendMobileCode = async () =>
      executeAsync(
        () => UserAPI.sendMobileCode(mobileUpdateForm.value.mobile),
        () => {
          // 设置倒计时
          mobileCountdown.value = 60;
          // 保存到本地存储，记录过期时间
          local.set("mobileCodeExpireTime", Date.now() + 60 * 1000);
          // 开始倒计时
          startMobileCountdown();
        },
        t("profile.sendCodeSuccess")
      );

    /** 绑定手机提交 */
    const submitMobile = async (val: User.MobileUpdateForm) =>
      executeAsync(
        () => UserAPI.bindOrChangeMobile(val),
        () => {
          mobileUpdateFormRef.value?.close();
          emit("success");
        },
        t("profile.bindPhoneSuccess")
      );

    /** 绑定邮箱信息配置 */
    const emailUpdateForm = ref<User.EmailUpdateForm>({}); // 修改邮箱表单
    const emailUpdateFormRef = ref();
    /** 绑定邮箱 */
    const updateEmail = () => {
      emailUpdateForm.value = {
        email: userProfile.value.email,
      };
      emailUpdateFormRef.value?.open(t("profile.changeEmail"), emailUpdateForm.value);
    };
    /** 绑定邮箱获取验证码 */
    const sendEmailCode = async () =>
      executeAsync(
        () => UserAPI.sendEmailCode(emailUpdateForm.value.email),
        () => {
          // 设置倒计时
          emailCountdown.value = 60;
          // 保存到本地存储，记录过期时间
          local.set("emailCodeExpireTime", Date.now() + 60 * 1000);
          // 开始倒计时
          startEmailCountdown();
        },
        t("profile.sendCodeSuccess")
      );

    /** 绑定邮箱提交 */
    const submitEmail = async (val: User.EmailUpdateForm) =>
      executeAsync(
        () => UserAPI.bindOrChangeEmail(val),
        () => {
          emailUpdateFormRef.value?.close();
          emit("success");
        },
        t("profile.bindEmailSuccess")
      );

    return () => (
      <>
        <NCard title={t("profile.accountInfo")} segmented={{ content: true }}>
          <NDescriptions label-placement="left" label-style="width: 20%" column={1} bordered>
            <NDescriptionsItem label={t("tableHeader.username")}>
              <NFlex align="center">
                <NText>{userProfile.value.username}</NText>
                <NTag bordered={false} type={genderTagType.value}>
                  <Icones icon={genderIcon.value} />
                </NTag>
              </NFlex>
            </NDescriptionsItem>
            <NDescriptionsItem label={t("tableHeader.phone")}>
              <NFlex align="center">
                <NText>{userProfile.value.mobile}</NText>
                <NButton type="primary" quaternary size="small" onClick={updateMobile}>
                  {t("button.replace")}
                </NButton>
              </NFlex>
            </NDescriptionsItem>
            <NDescriptionsItem label={t("tableHeader.email")}>
              <NFlex align="center">
                <NText>{userProfile.value.email}</NText>
                <NButton type="primary" quaternary size="small" onClick={updateEmail}>
                  {t("button.replace")}
                </NButton>
              </NFlex>
            </NDescriptionsItem>
            <NDescriptionsItem label={t("tableHeader.deptName")}>
              {userProfile.value.deptName}
            </NDescriptionsItem>
            <NDescriptionsItem label={t("tableHeader.createTime")}>
              {userProfile.value.createTime}
            </NDescriptionsItem>
          </NDescriptions>
        </NCard>
        {/* 修改绑定手机表单 */}
        <ModalForm<User.EmailUpdateForm>
          width={500}
          loading={spin.value}
          ref={mobileUpdateFormRef}
          props={{ draggable: true }}
          form={{
            config: [
              { name: "mobile", label: t("tableHeader.phone") },
              { name: "code", label: t("login.captcha") },
            ],
            props: {
              rules: {
                mobile: [
                  { required: true, message: t("input") + t("tableHeader.phone"), trigger: "blur" },
                  { pattern: /^1[3-9]\d{9}$/, message: t("rules.phone"), trigger: "blur" },
                ],
                code: [
                  {
                    required: true,
                    message: t("input") + t("login.captcha"),
                    trigger: "blur",
                  },
                ],
              },
            },
          }}
          model-value={mobileUpdateForm.value}
          onSubmit={submitMobile}
          v-slots={{
            code: () => (
              <NFlex class="w-full">
                <NInputOtp
                  class="flex-1"
                  block={true}
                  v-model:value={mobileUpdateForm.value.code}
                />
                <NButton
                  type="info"
                  strong
                  disabled={!mobileUpdateForm.value.mobile || mobileCountdown.value > 0}
                  loading={spin.value}
                  onClick={sendMobileCode}
                >
                  {mobileCountdown.value > 0
                    ? t("profile.seconds", { val: mobileCountdown.value })
                    : t("profile.sendCode")}
                </NButton>
              </NFlex>
            ),
          }}
        />

        {/* 绑定邮箱表单 */}
        <ModalForm<User.EmailUpdateForm>
          width={500}
          loading={spin.value}
          ref={emailUpdateFormRef}
          props={{ draggable: true }}
          form={{
            config: [
              { name: "email", label: t("tableHeader.email") },
              { name: "code", label: t("login.captcha") },
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
                code: [
                  { required: true, message: t("input") + t("login.captcha"), trigger: "blur" },
                ],
              },
            },
          }}
          model-value={emailUpdateForm.value}
          onSubmit={submitEmail}
          v-slots={{
            code: () => (
              <NFlex class="w-full">
                <NInputOtp
                  class="flex-1"
                  block={true}
                  v-model:value={mobileUpdateForm.value.code}
                />
                <NButton
                  type="info"
                  strong
                  disabled={!emailUpdateForm.value.email || emailCountdown.value > 0}
                  loading={spin.value}
                  onClick={sendEmailCode}
                >
                  {emailCountdown.value > 0
                    ? t("profile.seconds", { val: emailCountdown.value })
                    : t("profile.sendCode")}
                </NButton>
              </NFlex>
            ),
          }}
        />
      </>
    );
  },
});
