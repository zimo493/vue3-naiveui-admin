import { NSpin, NGrid, NGi, NCard, NFlex } from "naive-ui";

import UserAPI from "@/api/system/user";
import { spin, executeAsync } from "@/utils";

import Avatar from "./components/avatar";
import UserInfo from "./components/user-info";
import AccountInfo from "./components/account-info";
import SafeSetting from "./components/safe-setting";

export default defineComponent({
  name: "PersonalCenter",
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
        <NGrid xGap={10} yGap={10} cols="1 m:24" responsive="screen">
          <NGi span="1 m:10 l:8">
            <NCard>
              <NFlex vertical align="center" class="p-3 pb-6">
                <Avatar user-profile={userProfile.value} />
                <UserInfo user-profile={userProfile.value} onSuccess={loadUserProfile} />
              </NFlex>
              <AccountInfo user-profile={userProfile.value} />
            </NCard>
          </NGi>
          <NGi span="1 m:14 l:16">
            <NFlex size={[0, 10]}>
              <SafeSetting
                phone={userProfile.value.mobile}
                email={userProfile.value.email}
                onSuccess={loadUserProfile}
              />
            </NFlex>
          </NGi>
        </NGrid>
      </NSpin>
    );
  },
});
