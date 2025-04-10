import type { DropdownOption } from "naive-ui";
import { NAvatar, NEllipsis, NText, NDropdown, NEl } from "naive-ui";
import { renderIcon } from "@/utils/icon";
import { useAppStoreHook, useAuthStoreHook } from "@/store";
import IconGithub from "~icons/icon-park-outline/github";
import IconUser from "~icons/icon-park-outline/user";
import IconLogout from "~icons/icon-park-outline/logout";
import { InquiryBox } from "@/utils";

export default defineComponent({
  name: "UserDropdown",
  setup() {
    const authStore = useAuthStoreHook();
    const AppStore = useAppStoreHook();
    // const router = useRouter();

    const { userInfo } = authStore;

    // 获取简短的用户昵称
    const nickName = userInfo?.nickname?.slice(-2);

    const renderUserHeader = () => (
      <NEl class="flex items-center px-12px py-8px">
        <NAvatar
          style={{ backgroundColor: AppStore.theme.common?.primaryColor }}
          src={userInfo.avatar}
          size="large"
          renderFallback={() => <NEl class="wh-full flex-center">{nickName}</NEl>}
          v-slots={{
            fallback: () => (
              <NEl class="flex-center w-[100%] text-12px font-bold">
                <IconUser />
              </NEl>
            ),
          }}
        />
        <NEl class="flex flex-col ml-8px">
          <NText depth={2}>{userInfo.nickname}</NText>
          <NEllipsis style="max-width: 140px">
            <NText depth={3} class="text-12px">
              毫无疑问，你是办公室最亮的星！
            </NText>
          </NEllipsis>
        </NEl>
      </NEl>
    );

    const options: DropdownOption[] = [
      { key: "userInfo", type: "render", render: renderUserHeader },
      { type: "divider", key: "d1" },
      {
        label: "个人中心",
        key: "userCenter",
        icon: () => <IconUser />,
      },
      { type: "divider", key: "d2" },
      {
        label: "Gitee",
        key: "gitee",
        icon: renderIcon("simple-icons:gitee"),
      },
      { label: "Github", key: "github", icon: () => <IconGithub /> },
      { type: "divider", key: "d3" },
      {
        label: "退出登录",
        key: "loginOut",
        icon: () => <IconLogout />,
      },
    ];

    // 选择事件
    const handleSelect = (key: string | number) => {
      switch (key) {
        case "loginOut":
          InquiryBox("确定要退出系统吗？").then(() => authStore.logout());
          break;
        case "userCenter":
          window.$message.warning("该功能暂未开发，敬请期待！");
          break;
        case "github":
          window.open("https://github.com/zimo493/vue3-naiveui-admin");
          break;
        case "gitee":
          window.open("https://gitee.com/zimo493/vue3-naiveui-admin");
          break;
      }
    };

    return () => (
      <NDropdown trigger="click" options={options} onSelect={handleSelect}>
        <NAvatar
          class="cursor-pointer"
          src={authStore.userInfo.avatar}
          style={{ backgroundColor: AppStore.theme.common?.primaryColor }}
          renderFallback={() => (
            <NEl class="flex-center w-[100%] text-12px font-bold">{nickName}</NEl>
          )}
          v-slots={{
            fallback: () => (
              <NEl class="wh-full flex-center">
                <IconUser />
              </NEl>
            ),
          }}
        />
      </NDropdown>
    );
  },
});
