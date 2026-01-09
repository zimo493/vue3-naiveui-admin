<template>
  <n-drawer v-model:show="modalVisible" :width="500">
    <n-drawer-content :title="title">
      <template #header>
        <n-spin :show="loading">
          <n-flex vertical class="w-full" :size="[0, 20]">
            {{ title }}
            <n-flex align="center" :size="[20, 0]">
              <div flex-1>
                <n-input v-model:value="pattern" :placeholder="t('button.search')" clearable>
                  <template #prefix>
                    <Icones icon="icon-park-outline:search" />
                  </template>
                </n-input>
              </div>
              <n-flex>
                <n-checkbox v-model:checked="expandAll">
                  {{ t("button.expand") }}/{{ t("button.collapse") }}
                </n-checkbox>
                <n-checkbox v-model:checked="cascade">
                  {{ t("button.linkage") }}
                </n-checkbox>
              </n-flex>
            </n-flex>
          </n-flex>
        </n-spin>
      </template>

      <n-tree
        ref="treeInst"
        block-line
        checkable
        :show-irrelevant-nodes="false"
        :show-line="true"
        :selectable="true"
        :pattern="pattern"
        :data="menuPermOptions"
        :default-expand-all="expandAll"
        :checked-keys="selectedKeys"
        :cascade="cascade"
        key-field="value"
        label-field="label"
        @update:checked-keys="updateCheckedKeys"
      />
      <template #footer>
        <n-flex>
          <n-button type="primary" :loading="spin" @click="handleAssignPermSubmit">
            <template #icon>
              <Icones icon="ant-design:check-outlined" />
            </template>
            {{ t("button.submit") }}
          </n-button>
          <n-button strong secondary @click="handleClose">
            <template #icon>
              <Icones icon="ant-design:close-outlined" />
            </template>
            {{ t("button.cancel") }}
          </n-button>
        </n-flex>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts" setup>
import { spin, executeAsync } from "@/utils";

import MenuAPI from "@/api/system/menu";
import RoleAPI from "@/api/system/role";

defineOptions({ name: "DataScope" });

const { t } = useI18n();

const emit = defineEmits<{
  (e: "success"): void;
}>();

const modalVisible = ref<boolean>(false);
const title = ref<string>("");
const loading = ref<boolean>(false);

/** 搜索过滤 */
const pattern = ref<string>("");
/** 是否展开 */
const expandAll = ref<boolean>(true);
/** 父子联动 */
const cascade = ref<boolean>(true);

// 菜单权限下拉
const menuPermOptions = ref<OptionItem[]>([]);
const selectedKeys = ref<string[]>([]);

const roleId = ref<string>("");

defineExpose({
  open: async (row: Role.VO, t: string) => {
    roleId.value = row.id;
    title.value = t;
    modalVisible.value = true;
    loading.value = true;
    // 获取所有的菜单
    menuPermOptions.value = await MenuAPI.getOptions();

    RoleAPI.getRoleMenuIds(row.id)
      .then(async (data) => {
        await nextTick();
        updateCheckedKeys(data || []);
      })
      .finally(() => (loading.value = false));
  },
});

/** 选中改变 */
const updateCheckedKeys = (keys: string[]) => {
  selectedKeys.value = keys;
};

const handleAssignPermSubmit = () =>
  executeAsync(
    () => RoleAPI.updateRoleMenus(roleId.value, selectedKeys.value),
    () => {
      handleClose();
      emit("success");
    }
  );

/** 取消 */
const handleClose = () => (modalVisible.value = false);
</script>
