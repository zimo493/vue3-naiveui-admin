import { useAuthStoreHook } from "@/store";
import { useCompRef, useLoading } from "@/hooks";

import FileAPI from "@/api/file";
import UserAPI from "@/api/system/user";

import { NSpin, NGrid, NGi, NCard, NFlex, NAvatar, NH3, NTag, NEl, NDivider } from "naive-ui";
import Icones from "@/components/common/Icones.vue";
import ImageCut from "@/components/custom/ImageCut.vue";

export default defineComponent({
  name: "Profile",
  setup() {
    const { loading, startLoading, endLoading } = useLoading();

    const authStore = useAuthStoreHook();

    onMounted(async () => {
      await loadUserProfile();
    });

    /** 用户信息 */
    const userProfile = ref<User.ProfileVO>({});

    /** 加载用户信息 */
    const loadUserProfile = async () => {
      startLoading();
      try {
        userProfile.value = await UserAPI.getProfile();
      } finally {
        endLoading();
      }
    };

    /** 错误时显示的头像 */
    const ErrorAvatar = () => (
      <NEl class="flex-center w-[100%] text-14px font-bold">
        {userProfile.value.nickname ?? <Icones icon={"icon-park-outline:user"} size={48} />}
      </NEl>
    );

    /** 头像组件 */
    const Avatar = () => {
      const isHover = ref(false); // 是否显示修改头像的图标

      return (
        <NFlex
          class="relative inline-block"
          onMouseenter={() => (isHover.value = true)}
          onMouseleave={() => (isHover.value = false)}
        >
          <NAvatar
            size={100}
            src={userProfile.value.avatar}
            renderFallback={() => ErrorAvatar()}
            v-slots={{
              fallback: () => ErrorAvatar(),
            }}
          />
          {isHover.value && (
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

    /** 修改头像 */
    const imageCutRef = useCompRef(ImageCut);
    const changeAvatar = () => imageCutRef.value?.open();
    /**
     * 上传并设置头像
     * @param file 文件
     */
    const handleSubmit = async (file: File) => {
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

    /** 角色信息组件 */
    const RoleInfo = () =>
      userProfile.value.roleNames?.split(",").map((role) => (
        <NTag key={role} bordered={false} type="primary">
          {role}
        </NTag>
      ));

    /** 账号信息组件 */
    // const AccountInfo = () => {};

    /** 安全设置组件 */
    // const SafeSetting = () => {};

    return () => (
      <NSpin show={loading.value}>
        <NGrid xGap={10}>
          <NGi span={8}>
            <NCard>
              <NFlex vertical align="center" class="p-3">
                {Avatar()}
                <NH3 class="font-bold">{userProfile.value.nickname}</NH3>
                <NFlex>{RoleInfo()}</NFlex>
              </NFlex>
              <NDivider />
            </NCard>
          </NGi>
          <NGi span={16}>
            <NGrid yGap={10} cols={1}>
              <NGi>
                <NCard>1111111</NCard>
              </NGi>
              <NGi>
                <NCard>222222</NCard>
              </NGi>
            </NGrid>
          </NGi>
        </NGrid>
        <ImageCut
          ref={imageCutRef}
          image={userProfile.value.avatar}
          onSubmit={(val: File) => handleSubmit(val)}
        />
      </NSpin>
    );
  },
});
