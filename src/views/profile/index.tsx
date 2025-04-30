import UserAPI from "@/api/system/user";

import { NGrid, NGi, NCard, NFlex, NAvatar, NH3, NTag, NEl } from "naive-ui";
import IconUser from "~icons/icon-park-outline/user";

export default defineComponent({
  name: "Profile",
  setup() {
    onMounted(async () => {
      await loadUserProfile();
    });

    /** 用户信息 */
    const userProfile = ref<User.ProfileVO>({});

    /** 加载用户信息 */
    const loadUserProfile = async () => {
      userProfile.value = await UserAPI.getProfile();
    };

    /** 头像 */
    const Avatar = () => (
      <NAvatar
        size={100}
        src={userProfile.value.avatar}
        renderFallback={() => (
          <NEl class="flex-center w-[100%] text-12px font-bold">
            {userProfile.value.nickname || <IconUser />}
          </NEl>
        )}
        v-slots={{
          fallback: () => (
            <NEl class="flex-center w-[100%] text-12px font-bold">
              <IconUser />
            </NEl>
          ),
        }}
      />
    );

    return () => (
      <NGrid xGap={10}>
        <NGi span={8}>
          <NCard>
            <NFlex vertical align="center" class="p-3">
              {Avatar()}
              <NH3 class="font-bold">{userProfile.value.nickname}</NH3>
              <NFlex>
                {userProfile.value.roleNames?.split(",").map((role) => (
                  <NTag key={role} bordered={false} size="large" type="primary">
                    {role}
                  </NTag>
                ))}
              </NFlex>
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
    );
  },
});
