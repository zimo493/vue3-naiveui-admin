<script setup lang="ts">
import type { RouteRecordRaw } from "vue-router";

import { useRouteStore } from "@/store";
import { useBoolean } from "@/hooks";
import { defaultIcon } from "@/modules/assets";

const routeStore = useRouteStore();

const { t } = useI18n();

// 搜索值
const searchValue = ref("");

// 选中索引
const selectedIndex = ref<number>(0);

const {
  bool: showModal,
  setTrue: openModal,
  setFalse: closeModal,
  toggle: toggleModal,
} = useBoolean(false);

// 鼠标和键盘操作切换锁，防止鼠标和键盘操作冲突
const {
  bool: keyboardFlag,
  setTrue: setKeyboardTrue,
  setFalse: setKeyboardFalse,
} = useBoolean(false);

const { ctrl_k, arrowup, arrowdown, enter /* keys you want to monitor */ } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.ctrlKey && e.key === "k" && e.type === "keydown") e.preventDefault();
  },
});

// 监听全局热键
watchEffect(() => {
  if (ctrl_k.value) toggleModal();
});

const excludedRoutes = ref(["/500", "/login", "/403", "/404", "/500"]);

// 搜索历史相关
const SEARCH_HISTORY_KEY = "search_history";
const MAX_HISTORY_LENGTH = 10;

// 从localStorage获取搜索历史
const searchHistory = ref<string[]>([]);

// 初始化搜索历史
const initSearchHistory = () => {
  const history = localStorage.getItem(SEARCH_HISTORY_KEY);

  if (history) {
    searchHistory.value = JSON.parse(history);
  }
};

// 添加搜索历史
const addSearchHistory = (keyword: string) => {
  if (!keyword.trim()) return;

  // 移除已存在的相同关键词（避免重复）
  const index = searchHistory.value.indexOf(keyword);

  if (index > -1) {
    searchHistory.value.splice(index, 1);
  }

  // 添加到历史记录开头
  searchHistory.value.unshift(keyword);

  // 限制历史记录长度
  if (searchHistory.value.length > MAX_HISTORY_LENGTH) {
    searchHistory.value = searchHistory.value.slice(0, MAX_HISTORY_LENGTH);
  }

  // 保存到localStorage
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(searchHistory.value));
};

// 删除单个搜索历史
const removeSearchHistory = (index: number) => {
  searchHistory.value.splice(index, 1);
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(searchHistory.value));
};

// 清空搜索历史
const clearSearchHistory = () => {
  searchHistory.value = [];
  localStorage.removeItem(SEARCH_HISTORY_KEY);
};

// 使用搜索历史项
const useHistoryItem = (keyword: string) => {
  searchValue.value = keyword;
  handleInputChange();
};

// 初始化搜索历史
onMounted(() => {
  initSearchHistory();
});

// 计算符合条件的菜单选项
const options = computed<RouteRecordRaw[]>(() => {
  if (!searchValue.value) return [];

  const keyword = searchValue.value.toLowerCase();
  const result: RouteRecordRaw[] = [];

  // 递归搜索路由
  const searchRoutes = (routes: RouteRecordRaw[], parentPath: string = "") => {
    routes.forEach((route) => {
      // 跳过excludedRoutes中的路由和包含":"的动态路由
      if (excludedRoutes.value.includes(route.path) || route.path.includes(":")) {
        return;
      }

      // 检查路由标题和路径是否包含搜索关键词
      const titleMatch = route.meta?.title?.toLowerCase().includes(keyword);
      const pathMatch = route.path.toLowerCase().includes(keyword);

      // 如果匹配，添加到结果中，并保存完整路径信息
      if (titleMatch || pathMatch) {
        // 创建路由副本，避免修改原始路由对象
        const routeCopy = { ...route, path: parentPath + route.path };

        result.push(routeCopy);
      }

      // 递归搜索子路由
      if (route.children && route.children.length > 0) {
        // 计算子路由的父路径
        const childParentPath = route.path.endsWith("/")
          ? parentPath + route.path
          : parentPath + route.path + "/";

        searchRoutes(route.children, childParentPath);
      }
    });
  };

  searchRoutes(routeStore.routes);

  return result;
});

const router = useRouter();

// 关闭回调
const handleClose = () => {
  searchValue.value = "";
  selectedIndex.value = 0;
  closeModal();
};

// 输入框改变，索引重置
const handleInputChange = () => {
  selectedIndex.value = 0;
};

// 选择菜单选项
function handleSelect(value: RouteRecordRaw) {
  // 添加到搜索历史（在关闭模态框前添加）
  if (searchValue.value.trim()) {
    addSearchHistory(searchValue.value);
  }
  handleClose();
  router.push({ path: value.path, query: value.meta?.params }).then(() => (searchValue.value = ""));
}

watchEffect(() => {
  // 没有打开弹窗或没有搜索结果时，不操作
  if (!showModal.value || !options.value.length) return;

  // 设置键盘操作锁，设置后不会被动触发mouseover
  setKeyboardTrue();
  if (arrowup.value) handleArrowup();

  if (arrowdown.value) handleArrowdown();

  if (enter.value) handleEnter();
});

const scrollbarRef = useTemplateRef("scrollbar");

// 上箭头操作
function handleArrowup() {
  if (selectedIndex.value === 0) selectedIndex.value = options.value.length - 1;
  else selectedIndex.value--;

  handleScroll(selectedIndex.value);
}

// 下箭头操作
function handleArrowdown() {
  if (selectedIndex.value === options.value.length - 1) selectedIndex.value = 0;
  else selectedIndex.value++;

  handleScroll(selectedIndex.value);
}

function handleScroll(currentIndex: number) {
  // 保持6个选项在可视区域内,6个后开始滚动
  const keepIndex = 5;
  // 单个元素的高度，包括了元素的gap和容器的padding
  const elHeight = 70;
  const distance =
    currentIndex * elHeight > keepIndex * elHeight
      ? currentIndex * elHeight - keepIndex * elHeight
      : 0;

  scrollbarRef.value?.scrollTo({
    top: distance,
  });
}
// 回车键操作
function handleEnter() {
  const target = options.value[selectedIndex.value];

  if (target) handleSelect(target);
}

// 鼠标移入操作
function handleMouseEnter(index: number) {
  if (keyboardFlag.value) return;

  selectedIndex.value = index;
}

// 搜索高亮样式
const highlightStyle = {
  padding: "0 2px",
  borderRadius: "2px",
};
</script>

<template>
  <n-tag cursor-pointer :bordered="false" round size="large" @click="openModal">
    <n-flex :wrap="false" size="small" align="center">
      <icon-park-outline-search />
      {{ t("common.btn.search") }}
      <n-el
        tag="div"
        style="
          padding: 4px 8px 4px 6px;
          background-color: var(--body-color);
          border-radius: 4px calc(var(--n-height) / 2) calc(var(--n-height) / 2) 4px;
        "
        font-mono
      >
        Ctrl K
      </n-el>
    </n-flex>
  </n-tag>
  <n-modal
    v-model:show="showModal"
    class="w-560px fixed top-60px inset-x-0"
    size="small"
    preset="card"
    :segmented="{
      content: true,
      footer: true,
    }"
    :closable="false"
    @after-leave="handleClose"
  >
    <template #header>
      <n-input
        v-model:value="searchValue"
        :placeholder="t('system.search.placeholder')"
        clearable
        size="large"
        @input="handleInputChange"
      >
        <template #prefix>
          <Icones icon="ant-design:search-outlined" :size="24" />
        </template>
      </n-input>
      <!-- 搜索历史区域 -->
      <n-flex v-if="searchHistory.length && !searchValue" :size="[0, 4]" vertical mt-6px>
        <n-flex justify="space-between" align="center">
          <n-text :depth="2" size="small">{{ t("system.search.history") }}</n-text>
          <n-button text type="primary" size="tiny" @click="clearSearchHistory">
            {{ t("common.btn.clear") }}
          </n-button>
        </n-flex>
        <n-flex>
          <n-tag
            v-for="(item, idx) in searchHistory"
            :key="idx"
            :bordered="false"
            size="small"
            closable
            style="cursor: pointer"
            @close="removeSearchHistory(idx)"
            @click="useHistoryItem(item)"
          >
            {{ item }}
          </n-tag>
        </n-flex>
      </n-flex>
    </template>
    <n-scrollbar ref="scrollbar" class="h-450px">
      <ul v-if="options.length" class="flex flex-col gap-10px p-8px p-r-3">
        <n-el
          v-for="(option, index) in options"
          :key="option.path"
          tag="li"
          role="option"
          class="border-rd-4px overflow-hidden cursor-pointer shadow h-62px"
          :class="{
            'text-[var(--base-color)] bg-[var(--primary-color-hover)]': index === selectedIndex,
          }"
          @click="handleSelect(option)"
          @mouseenter="handleMouseEnter(index)"
          @mousemove="setKeyboardFalse"
        >
          <div class="grid grid-rows-2 grid-cols-[40px_1fr_30px] h-full p-2">
            <Icones
              :size="26"
              :icon="option.meta?.icon || defaultIcon"
              class="row-span-2 place-self-center"
            />
            <n-highlight
              :text="option.meta?.title"
              :patterns="[searchValue]"
              :highlightStyle="highlightStyle"
            />
            <icon-park-outline-right class="row-span-2 place-self-center" />
            <n-highlight
              :text="option.path"
              :patterns="[searchValue]"
              :highlightStyle="highlightStyle"
            />
          </div>
        </n-el>
      </ul>

      <n-empty v-else size="large" class="h-450px flex-center" />
    </n-scrollbar>

    <template #footer>
      <n-flex>
        <div class="flex-y-center gap-1">
          <svg width="1em" height="1em" aria-label="Enter key" role="img">
            <g
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.2"
            >
              <path d="M12 3.53088v3c0 1-1 2-2 2H4M7 11.53088l-3-3 3-3" />
            </g>
          </svg>
          <span>{{ t("common.btn.select") }}</span>
        </div>
        <div class="flex-y-center gap-1">
          <svg width="1em" height="1em" aria-label="Arrow down" role="img">
            <g
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.2"
            >
              <path d="M7.5 3.5v8M10.5 8.5l-3 3-3-3" />
            </g>
          </svg>
          <svg width="1em" height="1em" aria-label="Arrow up" role="img">
            <g
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.2"
            >
              <path d="M7.5 11.5v-8M10.5 6.5l-3-3-3 3" />
            </g>
          </svg>
          <span>{{ t("common.btn.switch") }}</span>
        </div>
        <div class="flex-y-center gap-1">
          <svg width="1em" height="1em" aria-label="Escape key" role="img">
            <g
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.2"
            >
              <path
                d="M13.6167 8.936c-.1065.3583-.6883.962-1.4875.962-.7993 0-1.653-.9165-1.653-2.1258v-.5678c0-1.2548.7896-2.1016 1.653-2.1016.8634 0 1.3601.4778 1.4875 1.0724M9 6c-.1352-.4735-.7506-.9219-1.46-.8972-.7092.0246-1.344.57-1.344 1.2166s.4198.8812 1.3445.9805C8.465 7.3992 8.968 7.9337 9 8.5c.032.5663-.454 1.398-1.4595 1.398C6.6593 9.898 6 9 5.963 8.4851m-1.4748.5368c-.2635.5941-.8099.876-1.5443.876s-1.7073-.6248-1.7073-2.204v-.4603c0-1.0416.721-2.131 1.7073-2.131.9864 0 1.6425 1.031 1.5443 2.2492h-2.956"
              />
            </g>
          </svg>
          <span>{{ t("common.btn.cancel") }}</span>
        </div>
      </n-flex>
    </template>
  </n-modal>
</template>
