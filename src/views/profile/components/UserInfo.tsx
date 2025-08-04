import { NFlex, NH3, NTag } from "naive-ui";

import UserAPI from "@/api/system/user";
import { executeAsync, spin } from "@/utils";

import Icones from "@/components/common/Icones.vue";
import ModalForm from "@/components/custom/ModalForm.vue";
import CommonWrapper from "@/components/common/CommonWrapper.vue";

export default defineComponent({
  name: "ProfileUserInfo",
  props: {
    userProfile: {
      type: Object as PropType<User.ProfileVO>,
      default: () => ({}),
    },
  },
  emits: ["success"],

  setup(props, { emit }) {
    const { userProfile } = toRefs(props);

    /** 修改用户信息配置 */
    const userProfileForm = ref<User.ProfileForm>({}); // 用户信息表单
    const userProfileFormRef = ref();

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
          emit("success");
        }
      );

    return () => (
      <>
        <NFlex class="mt-4 mb-3" align="center" justify="center" size={[4, 0]}>
          <NH3 class="font-bold m-0">{userProfile.value.nickname}</NH3>
          <CommonWrapper onClick={updateUserProfile}>
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

        <ModalForm<User.ProfileForm>
          width={500}
          loading={spin.value}
          ref={userProfileFormRef}
          props={{ draggable: true }}
          form={{
            props: {
              rules: {
                nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
                gender: [
                  { required: true, type: "number", message: "请选择性别", trigger: "change" },
                ],
              },
            },
            config: [
              { name: "nickname", label: "昵称" },
              { name: "gender", label: "性别", component: "select", dict: "gender" },
            ],
          }}
          modelValue={userProfileForm.value}
          onSubmit={submitUserProfile}
        />
      </>
    );
  },
});
