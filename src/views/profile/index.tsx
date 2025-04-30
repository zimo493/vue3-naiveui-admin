import UserAPI from "@/api/system/user";
import { useLoading } from "@/hooks";

import { NSpin, NGrid, NGi, NCard, NFlex, NAvatar, NH3, NTag, NEl } from "naive-ui";
import Icones from "@/components/common/Icones.vue";

export default defineComponent({
  name: "Profile",
  setup() {
    const { loading, startLoading, endLoading } = useLoading();

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
    const Avatar = () => (
      <NAvatar
        size={100}
        src={userProfile.value.avatar}
        renderFallback={() => ErrorAvatar()}
        v-slots={{
          fallback: () => ErrorAvatar(),
        }}
      />
    );

    /** 角色信息组件 */
    const RoleInfo = () =>
      userProfile.value.roleNames?.split(",").map((role) => (
        <NTag key={role} bordered={false} type="primary">
          {role}
        </NTag>
      ));

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
            </NCard>
          </NGi>
          <NGi span={16}>
            <NGrid yGap={10} cols={1}>
              <NGi>
                <NCard>111111</NCard>
              </NGi>
              <NGi>
                <NCard>222222</NCard>
              </NGi>
            </NGrid>
          </NGi>
        </NGrid>
      </NSpin>
    );
  },
});
