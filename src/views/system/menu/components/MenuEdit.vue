<template>
  <n-drawer v-model:show="modal.visible" :width="502" :on-after-leave="cancel">
    <n-drawer-content :title="modal.title">
      <n-spin :show="loading">
        <n-form
          ref="ruleFormRef"
          :rules="rules"
          :model="modelValue"
          label-align="right"
          label-placement="left"
          :label-width="100"
        >
          <n-grid :x-gap="0" :y-gap="0">
            <n-form-item-grid-item :span="24" label="上级菜单" path="parentId">
              <n-tree-select
                v-model:value="modelValue.parentId"
                filterable
                placeholder="选择上级菜单"
                :options="menuOptions"
                key-field="value"
                label-field="label"
              />
            </n-form-item-grid-item>

            <n-form-item-grid-item :span="24" :label="`${type}名称`" path="name">
              <n-input
                v-model:value="modelValue.name"
                type="text"
                clearable
                :placeholder="`请输入${type}名称`"
              />
            </n-form-item-grid-item>

            <n-form-item-grid-item :span="24" label="菜单类型" path="type">
              <n-radio-group v-model:value="modelValue.type" @change="handleMenuTypeChange">
                <n-space>
                  <n-radio :value="MenuTypeEnum.CATALOG" label="目录" />
                  <n-radio :value="MenuTypeEnum.MENU" label="菜单" />
                  <n-radio :value="MenuTypeEnum.BUTTON" label="按钮" />
                  <n-radio :value="MenuTypeEnum.EXTLINK" label="外链" />
                </n-space>
              </n-radio-group>
            </n-form-item-grid-item>

            <n-form-item-grid-item
              v-if="modelValue.type == MenuTypeEnum.EXTLINK"
              :span="24"
              label="外链地址"
              path="path"
            >
              <n-input
                v-model:value="modelValue.routePath"
                type="text"
                clearable
                placeholder="请输入外链完整路径"
              />
            </n-form-item-grid-item>

            <n-form-item-grid-item
              v-if="modelValue.type == MenuTypeEnum.MENU"
              :span="24"
              path="routeName"
            >
              <template #label>
                <FormTipLabel
                  label="路由名称"
                  msg="如果需要开启缓存，需保证页面 defineOptions 中的 name 与此处一致，建议使用驼峰。例如: User"
                />
              </template>
              <n-input
                v-model:value="modelValue.routeName"
                type="text"
                clearable
                placeholder="请输入路由名称"
              />
            </n-form-item-grid-item>

            <n-form-item-grid-item
              v-if="modelValue.type == MenuTypeEnum.CATALOG || modelValue.type == MenuTypeEnum.MENU"
              :span="24"
              path="routePath"
            >
              <template #label>
                <FormTipLabel
                  label="路由路径"
                  msg="定义应用中不同页面对应的 URL 路径，目录需以 / 开头，菜单项不用。例如：系统管理目录/system, 系统管理下的用户管理菜单 user。"
                />
              </template>
              <n-input
                v-if="modelValue.type == MenuTypeEnum.CATALOG"
                v-model:value="modelValue.routePath"
                placeholder="system"
              />
              <n-input v-else v-model:value="modelValue.routePath" placeholder="user" />
            </n-form-item-grid-item>

            <n-form-item-grid-item
              v-if="modelValue.type == MenuTypeEnum.MENU"
              prop="component"
              :span="24"
            >
              <template #label>
                <FormTipLabel
                  label="组件路径"
                  msg="组件页面完整路径，相对于 src/views/, 如 system/user/index, 缺省后缀 .vue"
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

            <n-form-item-grid-item v-if="modelValue.type == MenuTypeEnum.MENU" :span="24">
              <template #label>
                <FormTipLabel
                  label="路由参数"
                  msg="组件页面使用 `useRoute().query.参数名` 获取路由参数值。"
                />
              </template>
              <n-dynamic-input
                v-model:value="modelValue.params"
                preset="pair"
                key-placeholder="参数名"
                value-placeholder="参数值"
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
              label="图标"
              prop="icon"
              :span="24"
            >
              <IconSelect v-model="modelValue.icon" />
            </n-form-item-grid-item>

            <n-form-item-grid-item label="排序" prop="sort" :span="24">
              <n-input-number v-model:value="modelValue.sort" w-full :min="0" />
            </n-form-item-grid-item>

            <n-form-item-grid-item
              v-if="modelValue.type == MenuTypeEnum.BUTTON"
              label="权限标识"
              prop="perm"
              :span="24"
            >
              <n-input v-model:value="modelValue.perm" placeholder="sys:user:add" />
            </n-form-item-grid-item>

            <n-form-item-grid-item
              v-if="modelValue.type == MenuTypeEnum.CATALOG"
              label="跳转路由"
              :span="24"
            >
              <n-input v-model:value="modelValue.redirect" placeholder="跳转路由" />
            </n-form-item-grid-item>

            <n-form-item-grid-item
              v-if="modelValue.type !== MenuTypeEnum.BUTTON"
              prop="visible"
              label="禁用状态"
              :span="24"
            >
              <n-radio-group v-model:value="modelValue.visible">
                <n-radio :value="1" label="正常" />
                <n-radio :value="0" label="禁用" />
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
                <FormTipLabel
                  label="始终显示"
                  msg="选择“是”，即使目录或菜单下只有一个子节点，也会显示父节点。选择“否”，如果目录或菜单下只有一个子节点，则只显示该子节点，隐藏父节点。如果是叶子节点，请选择“否”。"
                />
              </template>
              <n-radio-group v-model:value="modelValue.alwaysShow">
                <n-radio :value="1" label="是" />
                <n-radio :value="0" label="否" />
              </n-radio-group>
            </n-form-item-grid-item>

            <n-form-item-grid-item
              v-if="modelValue.type === MenuTypeEnum.MENU"
              label="页面缓存"
              :span="24"
            >
              <n-radio-group v-model:value="modelValue.keepAlive">
                <n-radio :value="1" label="开启" />
                <n-radio :value="0" label="关闭" />
              </n-radio-group>
            </n-form-item-grid-item>
          </n-grid>
        </n-form>
      </n-spin>
      <template #footer>
        <n-space>
          <n-button type="primary" @click="handleSubmit">
            <template #icon>
              <Icones icon="ant-design:check-outlined" />
            </template>
            提交
          </n-button>
          <n-button strong secondary @click="cancel">
            <template #icon>
              <Icones icon="ant-design:close-outlined" />
            </template>
            取消
          </n-button>
        </n-space>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
<script lang="tsx">
export default { name: "MenuEdit" };
</script>
<script lang="tsx" setup>
import type { FormInst, FormRules } from "naive-ui";
import { MenuTypeEnum } from "@/enums";

import MenuAPI from "@/api/system/menu";
import { useLoading } from "@/hooks";

import FormTipLabel from "@/components/custom/FormTipLabel";

const { loading, startLoading, endLoading } = useLoading();

// const props = defineProps({
//   menuOptions: {
//     required: true,
//     type: Array as PropType<Menu.VO[]>,
//   },
// });

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
      title: value ? (typeof value === "string" ? "新增下级" : "编辑菜单") : "新增菜单",
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

const ruleFormRef = ref<FormInst | null>(null);

const modal = ref<DrawerModal>({
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
  parentId: [{ required: true, message: "请选择父级菜单", trigger: "blur" }],
  name: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
  type: [{ required: true, type: "number", message: "请选择菜单类型", trigger: "blur" }],
  routeName: [{ required: true, message: "请输入路由名称", trigger: "blur" }],
  routePath: [{ required: true, message: "请输入路由路径", trigger: "blur" }],
  component: [{ required: true, message: "请输入组件路径", trigger: "blur" }],
  visible: [{ required: true, message: "请选择显示状态", trigger: "change" }],
});

// 顶级菜单下拉选项
const menuOptions = ref<OptionType[]>([]);

const getMenuOptions = () => {
  MenuAPI.getOptions(true).then((data) => {
    menuOptions.value = [{ value: "0", label: "顶级菜单", children: data }];
  });
};

// 获取类型
const type = computed(() => {
  if (!modelValue.value.type) return "未知";

  return {
    [MenuTypeEnum.CATALOG]: "目录",
    [MenuTypeEnum.MENU]: "菜单",
    [MenuTypeEnum.BUTTON]: "按钮",
    [MenuTypeEnum.EXTLINK]: "外链",
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
  console.log(modelValue.value, "表单提交");

  await ruleFormRef.value?.validate();
  const menuId = modelValue.value.id;

  if (menuId) {
    //修改时父级菜单不能为当前菜单
    if (modelValue.value.parentId == menuId) {
      window.$message.error("父级菜单不能为当前菜单");

      return;
    }
    MenuAPI.update(menuId, modelValue.value).then(() => {
      window.$message.success("修改成功");
      emit("success");
      cancel();
    });
  } else {
    MenuAPI.create(modelValue.value).then(() => {
      window.$message.success("新增成功");
      emit("success");
      cancel();
    });
  }
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
  ruleFormRef.value?.restoreValidation();

  modal.value = { title: "", visible: false };
};
</script>
