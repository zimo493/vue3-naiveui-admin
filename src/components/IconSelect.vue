<template>
  <n-input-group disabled>
    <n-button v-if="value" tertiary :disabled="props.disabled">
      <template #icon>
        <Icones :icon="value" :size="24" />
      </template>
    </n-button>
    <n-input
      v-model:value="value"
      clearable
      :readonly="props.disabled"
      :placeholder="t('components.iconSelect.placeholder')"
      :on-clear="clearIcon"
    />
    <n-button type="primary" strong :disabled="props.disabled" @click="showModal = true">
      <template #icon>
        <Icones icon="ant-design:select-outlined" />
      </template>
      {{ t("button.select") }}
    </n-button>
  </n-input-group>
  <n-modal
    v-model:show="showModal"
    preset="card"
    :title="t('components.iconSelect.title')"
    class="w-1010px"
  >
    <n-tabs
      :value="currentTab"
      type="line"
      animated
      placement="left"
      @update:value="handleChangeTab"
    >
      <n-tab-pane name="local" :tab="t('components.iconSelect.localhost')">
        <n-flex :size="4">
          <n-el
            v-for="(_icon, key) in LocalIconList"
            :key="key"
            class="hover:(text-[var(--primary-color)] ring-1) ring-[var(--primary-color)] p-1 rounded flex-center"
            :title="`local:${key}`"
            @click="handleSelectIcon(`local:${key}`)"
          >
            <Icones :icon="`local:${key}`" :size="24" />
          </n-el>
        </n-flex>
      </n-tab-pane>
      <n-tab-pane
        v-for="(list, index) in iconLists"
        :key="list.prefix"
        :name="index"
        :tab="list.title"
      >
        <n-flex vertical>
          <n-flex size="small">
            <n-tag
              v-for="(_v, k) in list.categories"
              :key="k"
              :checked="currentTag === k"
              checkable
              size="small"
              @update:checked="handleSelectIconTag(k)"
            >
              {{ k }}
            </n-tag>
          </n-flex>
          <n-spin :show="loading">
            <n-card :segmented="{ content: true }">
              <template #header>
                <n-input
                  v-model:value="searchValue"
                  type="text"
                  clearable
                  :placeholder="t('components.iconSelect.search')"
                >
                  <template #prefix><icon-park-outline-search /></template>
                </n-input>
              </template>

              <n-flex :size="4">
                <n-el
                  v-for="icon in visibleIcons"
                  :key="icon"
                  class="hover:(text-[var(--primary-color)] ring-1) ring-[var(--primary-color)] p-1 rounded flex-center"
                  :title="`${list.prefix}:${icon}`"
                  @click="handleSelectIcon(`${list.prefix}:${icon}`)"
                >
                  <Icones :icon="`${list.prefix}:${icon}`" :size="24" />
                </n-el>
                <n-empty v-if="visibleIcons.length === 0" class="w-full" />
              </n-flex>
              <template #action>
                <n-flex justify="center">
                  <n-pagination
                    v-model:page="currentPage"
                    :item-count="icons?.length"
                    :page-size="pageSize"
                    :page-slot="7"
                    show-quick-jumper
                  >
                    <template #prefix="{ itemCount }">
                      {{ t("pagination.total", { total: itemCount }) }}
                    </template>
                    <template #goto>{{ t("pagination.goto") }}</template>
                  </n-pagination>
                </n-flex>
              </template>
            </n-card>
          </n-spin>
        </n-flex>
      </n-tab-pane>
    </n-tabs>
  </n-modal>
</template>

<script setup lang="ts">
import { useLoading } from "@/hooks";
import { mapEntries } from "radash";

interface Props {
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

interface IconList {
  prefix: string;
  icons: string[];
  title: string;
  total: number;
  categories: Record<string, string[]>;
  uncategorized?: Record<string, string[]>;
}

const { t } = useI18n();

const { loading, startLoading, endLoading } = useLoading(false);

const value = defineModel("modelValue", { type: String });

// 包含的图标库系列名 'carbon', 'logos','material-symbols',
const nameList = ["icon-park-outline", "ant-design", "ep", "f7", "line-md"];

// 获取单个图标库数据
const fetchIconList = async (name: string): Promise<IconList> => {
  return await fetch(`https://api.iconify.design/collection?prefix=${name}`).then((res) =>
    res.json()
  );
};

// 获取所有本地图标
const generateLocalIconList = () => {
  const localSvgList = import.meta.glob("@/assets/svg-icons/*.svg", {
    query: "?raw",
    import: "default",
    eager: true,
  });

  const getSvgName = (path: string) => {
    const regex = /\/([^/]+)\.svg$/;
    const match = path.match(regex);

    if (match) {
      return match[1];
    }

    return path;
  };

  return mapEntries(localSvgList, (key, value) => [getSvgName(key), value]);
};

// 获取所有图标库数据
const fetchIconAllList = async (nameList: string[]) => {
  startLoading();
  const namePromises = nameList.map((name) => fetchIconList(name));
  const targets = await Promise.all(namePromises);

  endLoading();

  return targets.map((i) => {
    const categories = i.categories ?? i.uncategorized;

    i.icons = Object.entries(categories).reduce((prev, next) => {
      const [, value] = next;

      return prev.concat(value);
    }, [] as string[]);

    return i;
  });
};

const iconLists = shallowRef<IconList[]>([]);
const LocalIconList = shallowRef({});

onMounted(async () => {
  iconLists.value = await fetchIconAllList(nameList);
  LocalIconList.value = generateLocalIconList();
});

// 当前tab
const currentTab = shallowRef(0);
// 当前tag
const currentTag = shallowRef("");

// 切换tab
const handleChangeTab = (index: number) => {
  currentTab.value = index;
  currentPage.value = 1;
  currentTag.value = "";
};
// 搜索图标输入框值
const searchValue = ref("");

// 当前页数
const currentPage = shallowRef(1);
const pageSize = ref(286);

// 选择分类tag
const handleSelectIconTag = (icon: string) => {
  currentTag.value = currentTag.value === icon ? "" : icon;
  currentPage.value = 1;
};

// 包含当前分类或所有图标列表
const icons = computed(() => {
  const hasTag = !!currentTag.value;

  if (hasTag) return iconLists.value[currentTab.value]?.categories[currentTag.value];
  else return iconLists.value[currentTab.value].icons;
});

// 符合搜索条件的图标列表
const visibleIcons = computed(() => {
  return icons.value
    ?.filter((i) => i.includes(searchValue.value))
    ?.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value);
});

const showModal = ref(false);

// 选择图标
const handleSelectIcon = (icon: string) => {
  value.value = icon;
  showModal.value = false;
};

// 清除图标
const clearIcon = () => {
  value.value = "";
  // showModal.value = false
};
</script>
