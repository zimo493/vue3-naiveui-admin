import { type FormItemRule } from "naive-ui";
import { type FormOption, FormItemType } from "@/components/custom/FormPro/types";

import { useAuthStoreHook } from "@/store";
import { spin, local, executeAsync } from "@/utils";

import { useCountdown } from "./useCountdown";
import { useCompRef, useDict } from "@/hooks";

import FileAPI from "@/api/file";
import UserAPI from "@/api/system/user";

import ImageCut from "@/components/custom/ImageCut.vue";
import DialogForm from "@/components/custom/DialogForm.vue";

export const useProfile = () => {
  const authStore = useAuthStoreHook();
  const { gender } = useDict("gender");

  /** 加载用户信息 */
  const loadUserProfile = () =>
    executeAsync(
      () => UserAPI.getProfile(),
      (data) => {
        userProfile.value = data;
      },
      null
    );

  /** 倒计时钩子 */
  const { mobileCountdown, emailCountdown, startMobileCountdown, startEmailCountdown } =
    useCountdown();

  /** 加载用户信息 */
  onMounted(loadUserProfile);

  /** 用户信息 */
  const userProfile = ref<User.ProfileVO>({});

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

  /** 修改头像 */
  const isEdit = ref(false); // 是否显示修改头像的图标
  const imageCutRef = useCompRef(ImageCut);

  /**
   * 上传并设置头像
   * @param file 文件
   */
  const handleUploadSetAvatar = async (file: File) => {
    // 调用文件上传API
    try {
      imageCutRef.value?.startLoading();
      const { url: avatar } = await FileAPI.uploadFile(file);

      // 更新用户头像
      authStore.userInfo.avatar = avatar;
      userProfile.value.avatar = avatar;
      // 更新用户信息
      await UserAPI.updateProfile({
        avatar,
      });
      imageCutRef.value?.close();
      window.$message.success("头像更新成功！");
    } catch (error) {
      console.error("头像上传失败：" + error);
      window.$message.error("头像上传失败！");
    } finally {
      imageCutRef.value?.endLoading();
    }
  };

  /** 修改用户信息配置 */
  const userProfileForm = ref<User.ProfileForm>({}); // 用户信息表单
  const userProfileFormRef = useCompRef(DialogForm);
  const userProfileFormConfig = ref<FormOption<User.ProfileForm>>({
    fields: [
      { field: "nickname", label: "昵称", type: FormItemType.Input },
      { field: "gender", label: "性别", type: FormItemType.Select, dict: "gender" },
    ],
    rules: {
      nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
      gender: [{ required: true, type: "number", message: "请选择性别", trigger: "change" }],
    },
    labelWidth: 80,
  });
  /** 修改基本信息 */
  const updateUserProfile = () => {
    userProfileForm.value = {
      id: userProfile.value.id,
      gender: userProfile.value.gender,
      nickname: userProfile.value.nickname,
    };
    userProfileFormRef.value?.open("账号信息修改", userProfileForm.value);
  };

  /** 修改基本信息提交 */
  const submitUserProfile = async (val: User.ProfileForm) =>
    executeAsync(
      () => UserAPI.updateProfile(val),
      async () => {
        userProfileFormRef.value?.close();
        await loadUserProfile();
      }
    );

  /** 修改用户密码配置 */
  const passwordChangeForm = ref<User.PasswordChangeForm>({}); // 修改密码表单
  const passwordChangeFormRef = useCompRef(DialogForm);
  const passwordChangeFormConfig = ref<FormOption<User.PasswordChangeForm>>({
    fields: [
      { field: "oldPassword", label: "旧密码", type: FormItemType.Password },
      { field: "newPassword", label: "新密码", type: FormItemType.Password },
      { field: "confirmPassword", label: "确认密码", type: FormItemType.Password },
    ],
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
  });

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

  /** 修改手机信息配置 */
  const mobileUpdateForm = ref<User.MobileUpdateForm>({}); // 修改手机表单
  const mobileUpdateFormRef = useCompRef(DialogForm);
  const mobileUpdateFormConfig = ref<FormOption<User.MobileUpdateForm>>({
    fields: [
      { field: "mobile", label: "手机号", type: FormItemType.Input },
      { field: "code", label: "验证码", slotName: "code" },
    ],
    rules: {
      mobile: [
        { required: true, message: "请输入手机号", trigger: "blur" },
        { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号", trigger: "blur" },
      ],
      code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
    },
    labelWidth: 80,
  });
  /** 绑定手机 */
  const updateMobile = () => {
    mobileUpdateForm.value = {
      mobile: userProfile.value.mobile,
    };
    mobileUpdateFormRef.value?.open("绑定手机", mobileUpdateForm.value);
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
  const emailUpdateFormRef = useCompRef(DialogForm);
  const emailUpdateFormConfig = ref<FormOption<User.EmailUpdateForm>>({
    fields: [
      { field: "email", label: "邮箱", type: FormItemType.Input },
      { field: "code", label: "验证码", slotName: "code" },
    ],
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
    labelWidth: 80,
  });
  /** 绑定邮箱 */
  const updateEmail = () => {
    emailUpdateForm.value = {
      email: userProfile.value.email,
    };
    emailUpdateFormRef.value?.open("绑定邮箱", emailUpdateForm.value);
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

  return {
    spin,
    isEdit,
    userProfile,
    genderIcon: computed(() => genderProps.value.icon),
    genderTagType: computed(() => genderProps.value.tagType),
    imageCutRef,
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
    changeAvatar: () => imageCutRef.value?.open(),
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
  };
};
