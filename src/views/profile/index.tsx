import { useProfile } from "./hooks/useProfile";

import {
  NSpin,
  NGrid,
  NGi,
  NCard,
  NFlex,
  NH3,
  NDivider,
  NAvatar,
  NTag,
  NEl,
  NText,
  NButton,
  NDescriptions,
  NDescriptionsItem,
  NInputGroup,
  NInput,
} from "naive-ui";
import Icones from "@/components/common/Icones.vue";
import ImageCut from "@/components/custom/ImageCut.vue";
import CommonWrapper from "@/components/common/CommonWrapper.vue";
import DialogForm from "@/components/custom/DialogForm.vue";

export default defineComponent({
  name: "Profile",
  setup() {
    const {
      spin,
      isEdit,
      loading,
      genderIcon,
      userProfile,
      imageCutRef,
      genderTagType,
      userProfileForm,
      userProfileFormRef,
      userProfileFormConfig,
      passwordChangeForm,
      passwordChangeFormRef,
      passwordChangeFormConfig,
      mobileUpdateForm,
      mobileUpdateFormRef,
      mobileUpdateFormConfig,
      emailUpdateForm,
      emailUpdateFormRef,
      emailUpdateFormConfig,
      mobileCountdown,
      emailCountdown,
      changeAvatar,
      handleUploadSetAvatar,
      updateUserProfile,
      submitUserProfile,
      updatePassword,
      submitPassword,
      updateMobile,
      sendMobileCode,
      submitMobile,
      updateEmail,
      sendEmailCode,
      submitEmail,
    } = useProfile();

    /** 错误时显示的头像 */
    const ErrorAvatar = () => (
      <NEl class="flex-center w-[100%] text-14px font-bold">
        {userProfile.value.nickname ?? <Icones icon={"icon-park-outline:user"} size={48} />}
      </NEl>
    );

    /** 头像组件 */
    const Avatar = () => {
      return (
        <NFlex
          class="relative inline-block"
          onMouseenter={() => (isEdit.value = true)}
          onMouseleave={() => (isEdit.value = false)}
        >
          <NAvatar
            size={100}
            src={userProfile.value.avatar}
            renderFallback={() => ErrorAvatar()}
            v-slots={{
              fallback: () => ErrorAvatar(),
            }}
          />
          {isEdit.value && (
            <NEl
              class="absolute top-1 left-1 bottom-1 right-1 bg-black bg-opacity-50 flex-center cursor-pointer border-rd-3px"
              onClick={() => changeAvatar()}
            >
              <Icones icon="ant-design:edit-outlined" size={32} color="#fff" />
            </NEl>
          )}
        </NFlex>
      );
    };

    /** 个人信息组件 */
    const UserInfo = () => (
      <>
        <NFlex class="mt-4 mb-3" align="center" justify="center" size={[4, 0]}>
          <NH3 class="font-bold m-0">{userProfile.value.nickname}</NH3>
          <CommonWrapper onClick={() => updateUserProfile()}>
            <Icones icon="ant-design:edit-outlined" />
          </CommonWrapper>
        </NFlex>
        {/* 角色信息 */}
        <NFlex>
          {userProfile.value.roleNames?.split(",").map((role) => (
            <NTag key={role} bordered={false} type="primary">
              {role}
            </NTag>
          ))}
        </NFlex>
      </>
    );

    /** 账号信息组件 */
    const AccountInfo = () => (
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
              <NButton type="primary" quaternary size="small" onClick={() => updateMobile()}>
                更换
              </NButton>
            </NFlex>
          </NDescriptionsItem>
          <NDescriptionsItem label="邮箱地址">
            <NFlex align="center">
              <NText>{userProfile.value.email}</NText>
              <NButton type="primary" quaternary size="small" onClick={() => updateEmail()}>
                更换
              </NButton>
            </NFlex>
          </NDescriptionsItem>
          <NDescriptionsItem label="部门">{userProfile.value.deptName}</NDescriptionsItem>
          <NDescriptionsItem label="创建时间">{userProfile.value.createTime}</NDescriptionsItem>
        </NDescriptions>
      </NCard>
    );

    /** 安全设置组件 */
    const SafeSetting = () => (
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
            onClick={() => updatePassword()}
          >
            修改密码
          </NButton>
        </NFlex>
      </NCard>
    );

    return () => (
      <NSpin show={loading.value}>
        <NGrid xGap={10}>
          <NGi span={8}>
            <NCard>
              <NFlex vertical align="center" class="p-3">
                {Avatar()}
                {UserInfo()}
              </NFlex>
              <NDivider />
              1111111
            </NCard>
          </NGi>
          <NGi span={16}>
            <NGrid yGap={10} cols={1}>
              <NGi>{AccountInfo()}</NGi>
              <NGi>{SafeSetting()}</NGi>
            </NGrid>
          </NGi>
        </NGrid>
        {/* 头像裁剪 */}
        <ImageCut
          ref={imageCutRef}
          image={userProfile.value.avatar}
          onSubmit={(file: File) => handleUploadSetAvatar(file)}
        />
        {/* 修改基本信息 */}
        <DialogForm
          width={500}
          draggable
          loading={spin.value}
          ref={userProfileFormRef}
          form-config={userProfileFormConfig.value}
          model-value={userProfileForm.value}
          onSubmit={(val: User.ProfileForm) => submitUserProfile(val)}
        />
        {/* 修改密码 */}
        <DialogForm
          width={500}
          draggable
          loading={spin.value}
          ref={passwordChangeFormRef}
          form-config={passwordChangeFormConfig.value}
          model-value={passwordChangeForm.value}
          onSubmit={(val: User.PasswordChangeForm) => submitPassword(val)}
        />
        {/* 修改绑定手机 */}
        <DialogForm
          width={500}
          draggable
          loading={spin.value}
          ref={mobileUpdateFormRef}
          form-config={mobileUpdateFormConfig.value}
          model-value={mobileUpdateForm.value}
          onSubmit={(val: User.MobileUpdateForm) => submitMobile(val)}
          v-slots={{
            code: () => (
              <NInputGroup>
                <NInput v-model:value={mobileUpdateForm.value.code} placeholder="请输入验证码" />
                <NButton
                  type="info"
                  strong
                  disabled={!mobileUpdateForm.value.mobile || mobileCountdown.value > 0}
                  loading={spin.value}
                  onClick={() => sendMobileCode()}
                >
                  {mobileCountdown.value > 0 ? `${mobileCountdown.value} 秒后重试` : "发送验证码"}
                </NButton>
              </NInputGroup>
            ),
          }}
        />
        {/* 绑定邮箱 */}
        <DialogForm
          width={500}
          draggable
          loading={spin.value}
          ref={emailUpdateFormRef}
          form-config={emailUpdateFormConfig.value}
          model-value={emailUpdateForm.value}
          onSubmit={(val: User.EmailUpdateForm) => submitEmail(val)}
          v-slots={{
            code: () => (
              <NInputGroup>
                <NInput v-model:value={emailUpdateForm.value.code} placeholder="请输入验证码" />
                <NButton
                  type="info"
                  strong
                  disabled={!emailUpdateForm.value.email || emailCountdown.value > 0}
                  loading={spin.value}
                  onClick={() => sendEmailCode()}
                >
                  {emailCountdown.value > 0 ? `${emailCountdown.value} 秒后重试` : "发送验证码"}
                </NButton>
              </NInputGroup>
            ),
          }}
        />
      </NSpin>
    );
  },
});
