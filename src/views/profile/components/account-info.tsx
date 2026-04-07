import { NDescriptions, NDescriptionsItem, NFlex, NText, NTag } from "naive-ui";

import { useDict } from "@/hooks";

import Icones from "@/components/icones.vue";
import { maskEmail, maskPhone } from "@/utils";

export default defineComponent({
  name: "ProfileAccountInfo",
  props: {
    userProfile: {
      type: Object as PropType<User.ProfileVO>,
      default: () => ({}),
    },
  },
  setup(props) {
    const { userProfile } = toRefs(props);

    const { t } = useI18n();
    const { gender } = useDict("gender");

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

    const genderIcon = computed(() => genderProps.value.icon);
    const genderTagType = computed(() => genderProps.value.tagType);

    return () => (
      <>
        <NDescriptions label-placement="left" label-style="width: 25%" column={1} bordered>
          <NDescriptionsItem
            v-slots={{
              label: () => (
                <NFlex align="center" size={[6, 0]}>
                  <Icones icon="icon-park-outline:user" />
                  <NText>{t("tableHeader.username")}</NText>
                </NFlex>
              ),
            }}
          >
            <NFlex align="center">
              <NText>{userProfile.value.username}</NText>
              <NTag bordered={false} type={genderTagType.value}>
                <Icones icon={genderIcon.value} />
              </NTag>
            </NFlex>
          </NDescriptionsItem>
          <NDescriptionsItem
            v-slots={{
              label: () => (
                <NFlex align="center" size={[6, 0]}>
                  <Icones icon="icon-park-outline:phone-call" />
                  <NText>{t("tableHeader.phone")}</NText>
                </NFlex>
              ),
            }}
          >
            <NText>{maskPhone(userProfile.value.mobile) || "-"}</NText>
          </NDescriptionsItem>
          <NDescriptionsItem
            v-slots={{
              label: () => (
                <NFlex align="center" size={[6, 0]}>
                  <Icones icon="icon-park-outline:mail" />
                  <NText>{t("tableHeader.email")}</NText>
                </NFlex>
              ),
            }}
          >
            <NText>{maskEmail(userProfile.value.email) || "-"}</NText>
          </NDescriptionsItem>
          <NDescriptionsItem
            v-slots={{
              label: () => (
                <NFlex align="center" size={[6, 0]}>
                  <Icones icon="icon-park-outline:city" />
                  <NText>{t("tableHeader.deptName")}</NText>
                </NFlex>
              ),
            }}
          >
            <NText>{userProfile.value.deptName}</NText>
          </NDescriptionsItem>
          <NDescriptionsItem
            v-slots={{
              label: () => (
                <NFlex align="center" size={[6, 0]}>
                  <Icones icon="icon-park-outline:time" />
                  <NText>{t("tableHeader.createTime")}</NText>
                </NFlex>
              ),
            }}
          >
            <NText>{userProfile.value.createTime}</NText>
          </NDescriptionsItem>
        </NDescriptions>
      </>
    );
  },
});
