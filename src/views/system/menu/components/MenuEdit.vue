<template>
  <n-drawer v-model:show="modal.visible" :width="502" :on-after-leave="cancel">
    <n-drawer-content :title="modal.title">
      <n-spin :show="loading">
        <n-form ref="ruleForm" :rules="rules" :model="modelValue" label-placement="top">
          <n-grid :x-gap="0" :y-gap="0">
            <n-form-item-grid-item :span="24" :label="t('menu.form.parentMenu')" path="parentId">
              <n-tree-select
                v-model:value="modelValue.parentId"
                filterable
                :placeholder="t('common.input.select') + t('menu.form.parentMenu')"
                :options="menuOptions"
                key-field="value"
                label-field="label"
              />
            </n-form-item-grid-item>

            <n-form-item-grid-item :span="24" :label="`${type}${t('menu.form.name')}`" path="name">
              <n-input
                v-model:value="modelValue.name"
                type="text"
                clearable
                :placeholder="`${t('common.input.input')}${type}${t('menu.form.name')}`"
              />
            </n-form-item-grid-item>

            <n-form-item-grid-item :span="24" :label="t('tableHeader.menuType')" path="type">
              <n-radio-group v-model:value="modelValue.type" @change="handleMenuTypeChange">
                <n-flex>
                  <n-radio :value="MenuTypeEnum.CATALOG" :label="t('menu.type.catalog')" />
                  <n-radio :value="MenuTypeEnum.MENU" :label="t('menu.type.menu')" />
                  <n-radio :value="MenuTypeEnum.BUTTON" :label="t('menu.type.button')" />
                  <n-radio :value="MenuTypeEnum.EXTLINK" :label="t('menu.type.extlink')" />
                </n-flex>
              </n-radio-group>
            </n-form-item-grid-item>

            <n-form-item-grid-item
              v-if="modelValue.type === MenuTypeEnum.EXTLINK"
              :span="24"
              :label="t('menu.form.externalLink')"
              path="path"
            >
              <n-input
                v-model:value="modelValue.routePath"
                type="text"
                clearable
                :placeholder="t('common.input.input') + t('menu.form.externalLink')"
              />
            </n-form-item-grid-item>

            <n-form-item-grid-item
              v-if="modelValue.type === MenuTypeEnum.MENU"
              :span="24"
              path="routeName"
            >
              <template #label>
                <FormTipLabel :label="t('tableHeader.routeName')" :msg="t('menu.tip.routeName')" />
              </template>
              <n-input
                v-model:value="modelValue.routeName"
                type="text"
                clearable
                :placeholder="t('common.input.input') + t('tableHeader.routeName')"
              />
            </n-form-item-grid-item>

            <n-form-item-grid-item
              v-if="
                modelValue.type === MenuTypeEnum.CATALOG || modelValue.type === MenuTypeEnum.MENU
              "
              :span="24"
              path="routePath"
            >
              <template #label>
                <FormTipLabel :label="t('tableHeader.routePath')" :msg="t('menu.tip.routePath')" />
              </template>
              <n-input
                v-if="modelValue.type === MenuTypeEnum.CATALOG"
                v-model:value="modelValue.routePath"
                placeholder="system"
              />
              <n-input v-else v-model:value="modelValue.routePath" placeholder="user" />
            </n-form-item-grid-item>

            <n-form-item-grid-item
              v-if="modelValue.type === MenuTypeEnum.MENU"
              prop="component"
              :span="24"
            >
              <template #label>
                <FormTipLabel
                  :label="t('tableHeader.componentPath')"
                  :msg="t('menu.tip.componentPath')"
                />
              </template>
              <n-input
                v-model:value="modelValue.component"
                type="text"
                clearable
                placeholder="system/user/index"
              >
                <template #prefix>src/views/</template>
                <template #suffix>.vue</template>
              </n-input>
            </n-form-item-grid-item>

            <n-form-item-grid-item v-if="modelValue.type === MenuTypeEnum.MENU" :span="24">
              <template #label>
                <FormTipLabel :label="t('menu.form.routeParam')" :msg="t('menu.tip.routeParam')" />
              </template>
              <n-dynamic-input
                v-model:value="modelValue.params"
                preset="pair"
                :key-placeholder="t('menu.form.params.key')"
                :value-placeholder="t('menu.form.params.value')"
              >
                <template #action="{ index, create, remove }">
                  <n-flex style="margin-left: 20px">
                    <n-button type="success" text @click="() => create(index)">
                      <template #icon>
                        <icon-park-outline-add-one />
                      </template>
                    </n-button>
                    <n-button type="error" text @click="() => remove(index)">
                      <template #icon>
                        <icon-park-outline-delete-themes />
                      </template>
                    </n-button>
                  </n-flex>
                </template>
              </n-dynamic-input>
            </n-form-item-grid-item>

            <n-form-item-grid-item
              v-if="modelValue.type !== MenuTypeEnum.BUTTON"
              :label="t('menu.form.icon')"
              prop="icon"
              :span="24"
            >
              <IconSelect v-model="modelValue.icon" />
            </n-form-item-grid-item>

            <n-form-item-grid-item :label="t('tableHeader.sort')" prop="sort" :span="24">
              <n-input-number v-model:value="modelValue.sort" w-full :min="0" />
            </n-form-item-grid-item>

            <n-form-item-grid-item
              v-if="modelValue.type === MenuTypeEnum.BUTTON"
              :label="t('tableHeader.permission')"
              prop="perm"
              :span="24"
            >
              <n-input v-model:value="modelValue.perm" placeholder="sys:user:add" />
            </n-form-item-grid-item>

            <n-form-item-grid-item
              v-if="modelValue.type === MenuTypeEnum.CATALOG"
              :label="t('menu.form.route')"
              :span="24"
            >
              <n-input
                v-model:value="modelValue.redirect"
                :placeholder="t('common.input.input') + t('menu.form.route')"
              />
            </n-form-item-grid-item>

            <n-form-item-grid-item
              v-if="modelValue.type !== MenuTypeEnum.BUTTON"
              prop="visible"
              :label="t('tableHeader.status')"
              :span="24"
            >
              <n-radio-group v-model:value="modelValue.visible">
                <n-radio v-for="item in statusOptions" :value="item.value" :label="item.label" />
              </n-radio-group>
            </n-form-item-grid-item>

            <n-form-item-grid-item
              v-if="
                modelValue.type === MenuTypeEnum.CATALOG || modelValue.type === MenuTypeEnum.MENU
              "
              prop="alwaysShow"
              :span="24"
            >
              <template #label>
                <FormTipLabel :label="t('menu.form.alwaysShow')" :msg="t('menu.tip.alwaysShow')" />
              </template>
              <n-radio-group v-model:value="modelValue.alwaysShow">
                <n-radio :value="1" :label="t('common.yes')" />
                <n-radio :value="0" :label="t('common.no')" />
              </n-radio-group>
            </n-form-item-grid-item>

            <n-form-item-grid-item
              v-if="modelValue.type === MenuTypeEnum.MENU"
              :label="t('menu.form.cache')"
              :span="24"
            >
              <n-radio-group v-model:value="modelValue.keepAlive">
                <n-radio :value="1" :label="t('common.yes')" />
                <n-radio :value="0" :label="t('common.no')" />
              </n-radio-group>
            </n-form-item-grid-item>
          </n-grid>
        </n-form>
      </n-spin>
      <template #footer>
        <n-flex>
          <n-button type="primary" :loading="spin" @click="handleSubmit">
            <template #icon>
              <Icones icon="ant-design:check-outlined" />
            </template>
            {{ t("button.submit") }}
          </n-button>
          <n-button strong secondary @click="cancel">
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
<script lang="tsx" setup>
import type { FormInst, FormRules } from "naive-ui";

import { useLoading } from "@/hooks";
import { MenuTypeEnum } from "@/enums";
import { spin, executeAsync, statusOptions } from "@/utils";

import MenuAPI from "@/api/system/menu";

const { t } = useI18n();
const { loading, startLoading, endLoading } = useLoading();

// const props = defineProps({
//   menuOptions: {
//     required: true,
//     type: Array as PropType<Menu.VO[]>,
//   },
// });

defineOptions({ name: "MenuEdit" });

const emit = defineEmits<{
  (e: "success"): void;
}>();

defineExpose({
  open: (value?: Menu.VO | string) => {
    if (!value) {
      modelValue.value = { ...initialMenuFormData.value };
    } else if (typeof value === "string") {
      modelValue.value.parentId = value;
    } else {
      startLoading();
      MenuAPI.getFormData(value.id)
        .then((data) => {
          initialMenuFormData.value = { ...data };
          modelValue.value = data;
        })
        .finally(() => endLoading());
    }
    modal.value = {
      visible: true,
      title: value
        ? typeof value === "string"
          ? t("menu.form.addSub")
          : t("menu.form.edit")
        : t("menu.form.add"),
    };
    getMenuOptions();
  },
});

// 菜单下拉选项
// const options = computed(() => {
//   const menu: TreeSelectOption = {
//     key: "0",
//     label: "顶级菜单",
//     children: transformTree(props.menuOptions),
//   };

//   return [menu];
// });

// 递归遍历菜单
// const transformTree = (node: Menu.VO[]): TreeSelectOption[] => {
//   if (!node) return [];

//   return node.map((item: Menu.VO) => ({
//     key: item.id,
//     label: item.name ?? "",
//     children: item.children && item.children.length > 0 ? transformTree(item.children) : undefined,
//   }));
// };

const ruleFormRef = useTemplateRef<FormInst>("ruleForm");

const modal = ref<FormModal>({
  title: "",
  visible: false,
});

// 默认值
const initialMenuFormData = ref<Menu.Form>({
  id: undefined,
  parentId: "0",
  visible: 1,
  sort: 1,
  type: MenuTypeEnum.MENU, // 默认菜单
  alwaysShow: 0,
  keepAlive: 1,
  params: [],
});
// 菜单表单数据
const modelValue = ref<Menu.Form>({ ...initialMenuFormData.value });
// 表单验证规则
const rules = ref<FormRules>({
  parentId: [
    {
      required: true,
      message: t("common.input.select") + t("menu.form.parentMenu"),
      trigger: "blur",
    },
  ],
  name: [
    {
      required: true,
      message: t("common.input.input") + t("tableHeader.menuName"),
      trigger: "blur",
    },
  ],
  type: [
    {
      required: true,
      type: "number",
      message: t("common.input.select") + t("tableHeader.menuType"),
      trigger: "blur",
    },
  ],
  routeName: [
    {
      required: true,
      message: t("common.input.input") + t("tableHeader.routeName"),
      trigger: "blur",
    },
  ],
  routePath: [
    {
      required: true,
      message: t("common.input.input") + t("tableHeader.routePath"),
      trigger: "blur",
    },
  ],
  component: [
    {
      required: true,
      message: t("common.input.input") + t("tableHeader.componentPath"),
      trigger: "blur",
    },
  ],
  visible: [
    {
      required: true,
      message: t("common.input.select") + t("tableHeader.status"),
      trigger: "change",
    },
  ],
});

// 顶级菜单下拉选项
const menuOptions = ref<OptionType[]>([]);

const getMenuOptions = () => {
  MenuAPI.getOptions(true).then((data) => {
    menuOptions.value = [{ value: "0", label: t("menu.form.topMenu"), children: data }];
  });
};

// 获取类型
const type = computed(() => {
  if (!modelValue.value.type) return "--";

  return {
    [MenuTypeEnum.CATALOG]: t("menu.type.catalog"),
    [MenuTypeEnum.MENU]: t("menu.type.menu"),
    [MenuTypeEnum.BUTTON]: t("menu.type.button"),
    [MenuTypeEnum.EXTLINK]: t("menu.type.extlink"),
  }[modelValue.value.type];
});

// 菜单类型切换
function handleMenuTypeChange() {
  // 如果菜单类型改变
  if (modelValue.value.type !== initialMenuFormData.value.type) {
    if (modelValue.value.type === MenuTypeEnum.MENU) {
      // 目录切换到菜单时，清空组件路径
      if (initialMenuFormData.value.type === MenuTypeEnum.CATALOG) {
        modelValue.value.component = "";
      } else {
        // 其他情况，保留原有的组件路径
        modelValue.value.routePath = initialMenuFormData.value.routePath;
        modelValue.value.component = initialMenuFormData.value.component;
      }
    }
  }
}

// 提交
const handleSubmit = async () => {
  await ruleFormRef.value?.validate();
  const menuId = modelValue.value.id;

  // 修改时父级菜单不能为当前菜单
  if (modelValue.value.parentId === menuId) {
    return window.$message.error(t("menu.form.parentMenuTip"));
  }

  executeAsync(
    () => (menuId ? MenuAPI.update(menuId, modelValue.value) : MenuAPI.create(modelValue.value)),
    () => {
      emit("success");
      cancel();
    }
  );
};

// 取消
const cancel = () => {
  initialMenuFormData.value = {
    id: undefined,
    parentId: "0",
    visible: 1,
    sort: 1,
    type: MenuTypeEnum.MENU, // 默认菜单
    alwaysShow: 0,
    keepAlive: 1,
    params: [],
  };
  modelValue.value = { ...initialMenuFormData.value };
  ruleFormRef.value?.restoreValidation();

  modal.value = { title: "", visible: false };
};
</script>
