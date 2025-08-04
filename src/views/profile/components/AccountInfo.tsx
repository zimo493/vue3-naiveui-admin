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

import Icones from "@/components/common/Icones.vue";
import ModalForm from "@/components/custom/ModalForm.vue";

export default defineComponent({
  name: "ProfileAccountInfo",
  props: {
    userProfile: {
      type: Object as PropType<User.ProfileVO>,
      default: () => ({}),
    },
  },
  setup(props) {
    const { userProfile } = toRefs(props);
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
      mobileUpdateFormRef.value?.open("修改手机号", mobileUpdateForm.value);
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
        "验证码发送成功"
      );

    /** 绑定手机提交 */
    const submitMobile = async (val: User.MobileUpdateForm) =>
      executeAsync(
        () => UserAPI.bindOrChangeMobile(val),
        () => mobileUpdateFormRef.value?.close(),
        "手机绑定成功"
      );

    /** 绑定邮箱信息配置 */
    const emailUpdateForm = ref<User.EmailUpdateForm>({}); // 修改邮箱表单
    const emailUpdateFormRef = ref();
    /** 绑定邮箱 */
    const updateEmail = () => {
      emailUpdateForm.value = {
        email: userProfile.value.email,
      };
      emailUpdateFormRef.value?.open("修改邮箱", emailUpdateForm.value);
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
        "验证码发送成功"
      );

    /** 绑定邮箱提交 */
    const submitEmail = async (val: User.EmailUpdateForm) =>
      executeAsync(
        () => UserAPI.bindOrChangeEmail(val),
        () => emailUpdateFormRef.value?.close(),
        "邮箱绑定成功"
      );

    return () => (
      <>
        <NCard title="账号信息" segmented={{ content: true }}>
          <NDescriptions label-placement="left" label-style="width: 20%" column={1} bordered>
            <NDescriptionsItem label="用户名">
              <NFlex align="center">
                <NText>{userProfile.value.username}</NText>
                <NTag bordered={false} type={genderTagType.value}>
                  <Icones icon={genderIcon.value} />
                </NTag>
              </NFlex>
            </NDescriptionsItem>
            <NDescriptionsItem label="手机号码">
              <NFlex align="center">
                <NText>{userProfile.value.mobile}</NText>
                <NButton type="primary" quaternary size="small" onClick={updateMobile}>
                  更换
                </NButton>
              </NFlex>
            </NDescriptionsItem>
            <NDescriptionsItem label="邮箱地址">
              <NFlex align="center">
                <NText>{userProfile.value.email}</NText>
                <NButton type="primary" quaternary size="small" onClick={updateEmail}>
                  更换
                </NButton>
              </NFlex>
            </NDescriptionsItem>
            <NDescriptionsItem label="部门">{userProfile.value.deptName}</NDescriptionsItem>
            <NDescriptionsItem label="创建时间">{userProfile.value.createTime}</NDescriptionsItem>
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
              { name: "mobile", label: "手机号" },
              { name: "code", label: "验证码" },
            ],
            props: {
              rules: {
                mobile: [
                  { required: true, message: "请输入手机号", trigger: "blur" },
                  { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号", trigger: "blur" },
                ],
                code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
              },
              labelWidth: "auto",
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
                  {mobileCountdown.value > 0 ? `${mobileCountdown.value} 秒后重试` : "发送验证码"}
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
              { name: "email", label: "邮箱" },
              { name: "code", label: "验证码" },
            ],
            props: {
              rules: {
                email: [
                  { required: true, message: "请输入邮箱", trigger: "blur" },
                  {
                    pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                    message: "请输入正确的邮箱",
                    trigger: "blur",
                  },
                ],
                code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
              },
              labelWidth: "auto",
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
                  {emailCountdown.value > 0 ? `${emailCountdown.value} 秒后重试` : "发送验证码"}
                </NButton>
              </NFlex>
            ),
          }}
        />
      </>
    );
  },
});
