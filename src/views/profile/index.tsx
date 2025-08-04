import { NSpin, NGrid, NGi, NCard, NFlex, NDivider } from "naive-ui";

import UserAPI from "@/api/system/user";
import { spin, executeAsync } from "@/utils";

import Avatar from "./components/Avatar";
import UserInfo from "./components/UserInfo";
import AccountInfo from "./components/AccountInfo";
import SafeSetting from "./components/SafeSetting";

export default defineComponent({
  name: "Profile",
  setup() {
    const userProfile = ref<User.ProfileVO>({});
    /** 加载用户信息 */
    const loadUserProfile = () =>
      executeAsync(
        () => UserAPI.getProfile(),
        (data) => {
          userProfile.value = data;
        },
        null
      );

    onMounted(() => loadUserProfile());

    return () => (
      <NSpin show={spin.value}>
        <NGrid xGap={10}>
          <NGi span={8}>
            <NCard>
              <NFlex vertical align="center" class="p-3">
                <Avatar user-profile={userProfile.value} />
                <UserInfo user-profile={userProfile.value} onSuccess={loadUserProfile} />
              </NFlex>
              <NDivider />
              1111111
            </NCard>
          </NGi>
          <NGi span={16}>
            <NFlex size={[0, 10]}>
              <AccountInfo user-profile={userProfile.value} onSuccess={loadUserProfile} />
              <SafeSetting />
            </NFlex>
          </NGi>
        </NGrid>
      </NSpin>
    );
  },
});
