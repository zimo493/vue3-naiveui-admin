<template>
  <div>
    <n-popover placement="bottom" trigger="click" arrow-point-to-center class="!p-0">
      <template #trigger>
        <n-tooltip placement="bottom" trigger="hover">
          <template #trigger>
            <n-badge :value="unreadList.length" :max="9" :offset="[-5, 5]">
              <CommonWrapper>
                <icon-park-outline-remind />
              </CommonWrapper>
            </n-badge>
          </template>
          <span>{{ t("notice.title") }}</span>
        </n-tooltip>
      </template>
      <n-spin :show="loading">
        <template v-if="unreadList.length">
          <n-scrollbar style="max-height: 400px">
            <n-list hoverable clickable w-400px>
              <n-list-item v-for="item in unreadList" @click="viewDetail(item.id)">
                <n-thing content-indented>
                  <template #header>
                    <n-ellipsis :line-clamp="1">{{ item.title }}</n-ellipsis>
                  </template>
                  <template #header-extra>
                    <DictTag :options="notice_type" :value="item.type" />
                  </template>
                  <template #footer>
                    <n-flex justify="space-between" align="center">
                      <n-text>{{ item.publisherName }}</n-text>
                      <n-text>{{ item.publishTime }}</n-text>
                    </n-flex>
                  </template>
                </n-thing>
              </n-list-item>
            </n-list>
          </n-scrollbar>
          <n-flex p-y-3 p-x-5 justify="space-between" align="center">
            <n-button type="primary" size="small" @click="router.push('/system/notice')">
              {{ t("notice.more") }}
            </n-button>
            <n-button
              type="info"
              size="small"
              quaternary
              :loading="allReadLoading"
              @click="allRead"
            >
              {{ t("notice.allRead") }}
            </n-button>
          </n-flex>
        </template>
        <template v-else>
          <div p-y-5 w-200px>
            <n-empty :description="t('notice.noMessage')" />
          </div>
        </template>
      </n-spin>
    </n-popover>

    <!-- 详情 -->
    <ModalForm ref="modalView" v-model="viewValue" use-type="view" :form-config="viewConfig">
      <template #title>
        <n-flex align="center">
          <DictTag v-if="viewValue.type" :options="notice_type" :value="viewValue.type" />
          <n-text>{{ viewValue.title }}</n-text>
        </n-flex>
      </template>
      <template #publishStatus>
        <component :is="getPublishStatusTag(viewValue.publishStatus)" />
      </template>
      <template #content>
        <div pt="[.4rem]" v-html="viewValue.content" />
      </template>
    </ModalForm>
  </div>
</template>

<script lang="tsx" setup>
import NoticeAPI from "@/api/system/notice";
import { useDict, useLoading } from "@/hooks";
import { endSpin, startSpin } from "@/utils";
import { NTag } from "naive-ui";

const router = useRouter();

type NoticeList = Notice.VO & { isRead: boolean };

defineOptions({ name: "Notices" });

const { t } = useI18n();
const { notice_type } = useDict("notice_type");
const { loading, startLoading, endLoading } = useLoading();

/** 消息列表 */
const noticeList = ref<NoticeList[]>([]);

/** 未读的消息 */
const unreadList = computed(() => noticeList.value.filter((item) => !item.isRead));

/** 获取未读的消息 */
const getUnread = () => {
  startLoading();
  NoticeAPI.getMyNoticePage({ pageNum: 1, pageSize: 10, isRead: 0 })
    .then(({ list }) => {
      noticeList.value = list.map((item) => ({ ...item, isRead: false }));
    })
    .finally(() => endLoading());
};

onMounted(getUnread);

// 查看详情
const modalViewRef = useTemplateRef("modalView");
const viewValue = ref<Notice.DetailVO>({});
const viewConfig = ref<FormPro.FormItemConfig[]>([
  { name: "title", label: t("tableHeader.title") + ": " },
  { name: "publishStatus", label: t("tableHeader.status") + ": ", span: 12 },
  {
    name: "publisherName",
    label: t("tableHeader.publishAuthor") + ": ",
    component: "text",
    span: 12,
  },
  { name: "publishTime", label: t("notice.publishTime") + ": ", component: "text", span: 12 },
  { name: "content", label: t("notice.content") + ": " },
]);

const viewDetail = async (id: string) => {
  startSpin();
  modalViewRef.value?.open(t("notice.info"), viewValue.value);
  try {
    viewValue.value = await NoticeAPI.getDetail(id);
    noticeList.value = noticeList.value.filter((item) => item.id !== id);
  } finally {
    endSpin();
  }
};

// 获取发布状态标签
const getPublishStatusTag = (status?: number) => {
  if (!status?.toString())
    return (
      <NTag bordered={false} type="default">
        -
      </NTag>
    );

  const statusMap = {
    0: { type: "warning", label: t("notice.status.unpublished") },
    1: { type: "success", label: t("notice.status.published") },
    "-1": { type: "error", label: t("notice.status.revoked") },
  };

  const config = statusMap[status as keyof typeof statusMap] || { type: "default", label: "-" };

  return (
    <NTag bordered={false} type={config.type}>
      {config.label}
    </NTag>
  );
};
/** 全部已读 */
const allReadLoading = ref(false);
const allRead = () => {
  allReadLoading.value = true;
  NoticeAPI.readAll()
    .then(() => {
      noticeList.value = noticeList.value.map((item) => ({ ...item, isRead: true }));
    })
    .finally(() => {
      allReadLoading.value = false;
    });
};
</script>
