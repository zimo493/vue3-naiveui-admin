import { type FormItemRule } from "naive-ui";
import { type FormOption, FormItemType } from "@/components/custom/FormPro/types";

import { useAuthStoreHook } from "@/store";
import { useCompRef, useDict, useLoading } from "@/hooks";
import { spin, startSpin, endSpin } from "@/utils";

import FileAPI from "@/api/file";
import UserAPI from "@/api/system/user";

import ImageCut from "@/components/custom/ImageCut.vue";
import DialogForm from "@/components/custom/DialogForm.vue";

export const useProfile = () => {
  const authStore = useAuthStoreHook();
  const { gender } = useDict("gender");
  const { loading, startLoading, endLoading } = useLoading();

  onMounted(async () => {
    await loadUserProfile();
  });

  /** 用户信息 */
  const userProfile = ref<User.ProfileVO>({});

  /** 性别图标 */
  const genderIcon = computed(() => {
    if (userProfile.value.gender === 1) {
      return "ant-design:man-outlined";
    } else if (userProfile.value.gender === 2) {
      return "ant-design:woman-outlined";
    } else {
      return "ant-design:question-outlined";
    }
  });
  const genderTagType = computed(() => {
    const type = gender.value.find((item) => +item.value === userProfile.value.gender)?.tagType;

    return type ?? "default";
  });

  /** 加载用户信息 */
  const loadUserProfile = async () => {
    startLoading();
    try {
      userProfile.value = await UserAPI.getProfile();
    } finally {
      endLoading();
    }
  };

  /** 修改头像 */
  const isEdit = ref(false); // 是否显示修改头像的图标
  const imageCutRef = useCompRef(ImageCut);
  const changeAvatar = () => imageCutRef.value?.open();
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
  const submitUserProfile = async (val: User.ProfileForm) => {
    console.log(val, "提交");
    try {
      startSpin();
      await UserAPI.updateProfile(val);
      window.$message.success("账号资料修改成功");
      await loadUserProfile();
      userProfileFormRef.value?.close();
    } catch (err) {
      console.error(err);
    } finally {
      endSpin();
    }
  };
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
          validator: (rule: FormItemRule, value: string) =>
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
  const submitPassword = async (val: User.PasswordChangeForm) => {
    console.log(val, "提交");
    try {
      startSpin();
      await UserAPI.changePassword(val);
      window.$message.success("密码修改成功");
      passwordChangeFormRef.value?.close();
    } catch (err) {
      console.error(err);
    } finally {
      endSpin();
    }
  };

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
  const sendMobileCode = async () => {
    try {
      startSpin();
      await UserAPI.sendMobileCode(mobileUpdateForm.value.mobile);
      window.$message.success("验证码发送成功");
    } catch (err) {
      console.error(err);
    } finally {
      endSpin();
    }
  };

  /** 绑定手机提交 */
  const submitMobile = async (val: User.MobileUpdateForm) => {
    try {
      startSpin();
      await UserAPI.bindOrChangeMobile(val);
      window.$message.success("手机绑定成功");
      mobileUpdateFormRef.value?.close();
    } catch (err) {
      console.error(err);
    } finally {
      endSpin();
    }
  };

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
  const sendEmailCode = async () => {
    try {
      startSpin();
      await UserAPI.sendEmailCode(emailUpdateForm.value.email);
      window.$message.success("验证码发送成功");
    } catch (err) {
      console.error(err);
    } finally {
      endSpin();
    }
  };

  /** 绑定邮箱提交 */
  const submitEmail = async (val: User.EmailUpdateForm) => {
    try {
      startSpin();
      await UserAPI.bindOrChangeEmail(val);
      window.$message.success("邮箱绑定成功");
      emailUpdateFormRef.value?.close();
    } catch (err) {
      console.error(err);
    } finally {
      endSpin();
    }
  };

  return {
    spin,
    isEdit,
    loading,
    genderIcon,
    userProfile,
    genderTagType,
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
  };
};
