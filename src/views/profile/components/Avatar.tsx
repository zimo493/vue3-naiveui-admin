import { NAvatar, NEl, NFlex } from "naive-ui";
import { useCompRef } from "@/hooks";
import Icones from "@/components/Icones.vue";
import ImageCut from "@/components/ImageCut.vue";
import FileAPI from "@/api/file";
import UserAPI from "@/api/system/user";
import { useAuthStoreHook } from "@/store";

export default defineComponent({
  name: "ProfileAvatar",
  props: {
    userProfile: {
      type: Object as PropType<User.ProfileVO>,
      default: () => ({}),
    },
  },
  setup(props) {
    const { t } = useI18n();
    const authStore = useAuthStoreHook();
    /** 修改头像 */
    const isEdit = ref(false); // 是否显示修改头像的图标
    const imageCutRef = useCompRef(ImageCut);

    /** 用户信息 */
    const { userProfile } = toRefs(props);

    const changeAvatar = () => imageCutRef.value?.open();

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
            renderFallback={ErrorAvatar}
            v-slots={{ fallback: ErrorAvatar }}
          />
          {isEdit.value && (
            <NEl
              class="absolute top-1 left-1 bottom-1 right-1 bg-black bg-opacity-50 flex-center cursor-pointer border-rd-3px"
              onClick={changeAvatar}
            >
              <Icones icon="ant-design:edit-outlined" size={32} color="#fff" />
            </NEl>
          )}
        </NFlex>
      );
    };

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
        await UserAPI.updateProfile({ avatar });
        imageCutRef.value?.close();
        window.$message.success(t("profile.updateAvatarSuccess"));
      } finally {
        imageCutRef.value?.endLoading();
      }
    };

    return () => (
      <>
        <Avatar />
        {/* 头像裁剪 */}
        <ImageCut
          ref={imageCutRef}
          image={userProfile.value.avatar}
          onSubmit={(file: File) => handleUploadSetAvatar(file)}
        />
      </>
    );
  },
});
