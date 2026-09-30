<template>
  <div class="page-container">
    <n-card :bordered="false" class="page-content mb-4">
      <h3 class="mb-2 text-16px font-600">{{ t("routeNavigate.editTitle") }}</h3>
      <p class="text-13px text-[var(--n-text-color-3)]">{{ t("routeNavigate.editDesc") }}</p>
    </n-card>

    <n-card :bordered="false" class="page-content" :title="t('routeNavigate.formTitle')">
      <n-form :model="formData" label-width="80">
        <n-form-item :label="t('routeNavigate.colName')" path="name">
          <n-input
            v-model:value="formData.name"
            :placeholder="t('routeNavigate.namePlaceholder')"
          />
        </n-form-item>
        <n-form-item :label="t('routeNavigate.colDept')" path="dept">
          <n-input
            v-model:value="formData.dept"
            :placeholder="t('routeNavigate.deptPlaceholder')"
          />
        </n-form-item>
        <n-form-item :label="t('routeNavigate.colPost')" path="post">
          <n-input
            v-model:value="formData.post"
            :placeholder="t('routeNavigate.postPlaceholder')"
          />
        </n-form-item>
        <n-form-item>
          <n-button type="primary" @click="handleSubmit">
            {{ t("routeNavigate.save") }}
          </n-button>
          <n-button class="ml-3" @click="handleCancel">
            {{ t("routeNavigate.cancel") }}
          </n-button>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { getMember, updateMember } from "./data";
import type { MemberItem } from "./data";

defineOptions({
  name: "RouteExampleEdit",
});

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const formData = reactive<MemberItem>({ id: 0, name: "", dept: "", post: "" });

onMounted(() => {
  const member = getMember(Number(route.params.id));

  if (!member) {
    window.$message.warning(t("routeNavigate.notFound"));
    router.back();

    return;
  }
  Object.assign(formData, member);
});

/**
 * 保存编辑并返回列表
 */
function handleSubmit(): void {
  updateMember({ ...formData });
  window.$message.success(t("routeNavigate.saved"));
  router.back();
}

/**
 * 取消编辑并返回列表
 */
function handleCancel(): void {
  router.back();
}
</script>
