<script setup lang="ts">
const { t } = useI18n();
const { type = "403" } = defineProps({
  /** 异常类型 403 404 500 */
  type: { type: String as PropType<"403" | "404" | "500"> },
});
const map = computed(() => ({
  403: {
    title: t("errorPage.403.title"),
    desc: t("errorPage.403.desc"),
  },
  404: {
    title: t("errorPage.404.title"),
    desc: t("errorPage.404.desc"),
  },
  500: {
    title: t("errorPage.500.title"),
    desc: t("errorPage.500.desc"),
  },
}));
const router = useRouter();
</script>

<template>
  <div class="flex-col-center h-full">
    <n-result :status="type" :title="map[type].title" :description="map[type].desc">
      <template #footer>
        <n-button type="primary" @click="router.push('/')">
          {{ t("button.backHomepage") }}
        </n-button>
      </template>
    </n-result>
  </div>
</template>
