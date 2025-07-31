<template>
  <div>
    <n-grid :x-gap="10" :y-gap="10">
      <n-gi v-for="item in aboutList" :key="item.icon" :span="4">
        <n-card
          hoverable
          h="[100%]"
          class="aboutItem"
          content-style="padding:20px"
          header-style="padding: 10px 16px"
        >
          <a :href="item.url" target="_blank">
            <n-thing>
              <template #avatar>
                <Icones :icon="item.icon" :size="32" />
              </template>
              <template #header>{{ item.header }}</template>
              <n-ellipsis :line-clamp="2">
                {{ item.description }}
              </n-ellipsis>
            </n-thing>
          </a>
        </n-card>
      </n-gi>
      <n-gi :span="8">
        <n-card
          :segmented="{ content: true }"
          content-style="padding:20px"
          header-style="padding: 10px 16px"
        >
          <template #header>
            <n-skeleton v-if="loading" :width="146" :sharp="false" size="medium" />
            <span v-else>{{ t("home.card.online") }}</span>
          </template>
          <template #header-extra>
            <n-skeleton v-if="loading" :width="20" :sharp="false" size="small" />
            <n-tag v-else :bordered="false" type="success">{{ t("home.card.realTime") }}</n-tag>
          </template>

          <n-flex v-if="loading" vertical>
            <div flex-y-center justify-between>
              <n-skeleton height="30px" width="20%" :sharp="false" />
              <n-skeleton height="40px" circle />
            </div>
            <div flex-y-center justify-between>
              <n-skeleton height="30px" width="33%" :sharp="false" />
              <n-skeleton height="30px" width="8%" :sharp="false" />
            </div>
          </n-flex>
          <n-flex v-else vertical>
            <n-flex text-16px vertical>
              <n-flex justify="space-between" align="center">
                <n-flex>
                  <n-number-animation show-separator :from="10" :to="onlineUserCount" />
                  <n-text :type="isConnected ? 'success' : 'error'">
                    <Icones :icon="isConnected ? link : unLink" :size="12" />
                    <span class="text-xs">
                      {{ isConnected ? t("home.card.connected") : t("home.card.disconnected") }}
                    </span>
                  </n-text>
                </n-flex>
                <Icones icon="icon-park:online-meeting" :size="42" />
              </n-flex>
              <n-flex justify="space-between" align="center" text-sm text-gray>
                <span>{{ t("home.card.updateTime") }}</span>
                <span>{{ formattedTime }}</span>
              </n-flex>
            </n-flex>
          </n-flex>
        </n-card>
      </n-gi>

      <n-gi :span="8">
        <n-card
          :segmented="{ content: true }"
          content-style="padding:20px"
          header-style="padding: 10px 16px"
        >
          <template #header>
            <n-skeleton v-if="loading" :width="146" :sharp="false" size="medium" />
            <span v-else>{{ t("home.chart.uv") }}</span>
          </template>
          <template #header-extra>
            <n-skeleton v-if="loading" :width="20" :sharp="false" size="small" />
            <n-tag v-else :bordered="false" type="primary">{{ t("home.card.day") }}</n-tag>
          </template>

          <n-flex v-if="loading" vertical>
            <div flex-y-center justify-between>
              <n-skeleton height="30px" width="20%" :sharp="false" />
              <n-skeleton height="40px" circle />
            </div>
            <div flex-y-center justify-between>
              <n-skeleton height="30px" width="33%" :sharp="false" />
              <n-skeleton height="30px" width="8%" :sharp="false" />
            </div>
          </n-flex>
          <n-flex v-else vertical>
            <n-flex text-16px vertical>
              <n-flex justify="space-between" align="center">
                <n-flex>
                  <n-number-animation
                    show-separator
                    :from="999"
                    :to="visitStatsData.todayUvCount"
                  />
                  <n-text :type="getType(visitStatsData.pvGrowthRate)">
                    <Icones
                      v-if="visitStatsData.uvGrowthRate !== 0"
                      :icon="visitStatsData.uvGrowthRate > 0 ? up : down"
                      :size="12"
                    />
                    <span class="text-xs">{{ formatGrowthRate(visitStatsData.uvGrowthRate) }}</span>
                  </n-text>
                </n-flex>
                <Icones icon="noto:detective" :size="42" />
              </n-flex>
              <n-flex justify="space-between" align="center" text-sm text-gray>
                <span>{{ t("home.card.totalVisits") }}</span>
                <n-number-animation show-separator :from="0" :to="visitStatsData.todayPvCount" />
              </n-flex>
            </n-flex>
          </n-flex>
        </n-card>
      </n-gi>
      <n-gi :span="8">
        <n-card
          :segmented="{ content: true }"
          content-style="padding:20px"
          header-style="padding: 10px 16px"
        >
          <template #header>
            <n-skeleton v-if="loading" :width="146" :sharp="false" size="medium" />
            <span v-else>{{ t("home.chart.pv") }}</span>
          </template>
          <template #header-extra>
            <n-skeleton v-if="loading" :width="20" :sharp="false" size="small" />
            <n-tag v-else :bordered="false" type="primary">{{ t("home.card.day") }}</n-tag>
          </template>

          <n-flex v-if="loading" vertical>
            <div flex-y-center justify-between>
              <n-skeleton height="30px" width="20%" :sharp="false" />
              <n-skeleton height="40px" circle />
            </div>
            <div flex-y-center justify-between>
              <n-skeleton height="30px" width="33%" :sharp="false" />
              <n-skeleton height="30px" width="8%" :sharp="false" />
            </div>
          </n-flex>
          <n-flex v-else vertical>
            <n-flex text-16px vertical>
              <n-flex justify="space-between" align="center">
                <n-flex>
                  <n-number-animation
                    show-separator
                    :from="999"
                    :to="visitStatsData.todayPvCount"
                  />
                  <n-text :type="getType(visitStatsData.pvGrowthRate)">
                    <Icones
                      v-if="visitStatsData.pvGrowthRate !== 0"
                      :icon="visitStatsData.pvGrowthRate > 0 ? up : down"
                      :size="12"
                    />
                    <span class="text-xs">{{ formatGrowthRate(visitStatsData.pvGrowthRate) }}</span>
                  </n-text>
                </n-flex>
                <Icones icon="emojione-v1:eyes" :size="42" />
              </n-flex>
              <n-flex justify="space-between" align="center" text-sm text-gray>
                <span>{{ t("home.card.totalView") }}</span>
                <n-number-animation show-separator :from="0" :to="visitStatsData.totalPvCount" />
              </n-flex>
            </n-flex>
          </n-flex>
        </n-card>
      </n-gi>

      <n-gi :span="18">
        <n-card
          :title="t('home.card.visitTrend')"
          :segmented="{ content: true }"
          content-style="padding:20px"
          header-style="padding: 10px 16px"
        >
          <template #header-extra>
            <n-date-picker
              v-model:value="dateRange"
              w-300px
              type="daterange"
              closeOnSelect
              :shortcuts="shortcuts"
              :is-date-disabled="(ts: number) => ts > Date.now()"
              @update:value="fetchVisitTrendData"
            />
          </template>
          <ECharts ref="chart" height="517px" />
        </n-card>
      </n-gi>
      <n-gi :span="6">
        <n-flex vertical :size="10">
          <n-card
            :title="t('common.messageType.announcement')"
            :segmented="{ content: true }"
            content-style="padding:20px"
            header-style="padding: 10px 16px"
          >
            <template #header-extra>
              <n-button type="primary" quaternary>{{ t("button.more") }}</n-button>
            </template>
            <n-list>
              <n-list-item v-for="item of list" :key="item.key">
                <template #prefix>
                  <n-tag :bordered="false" :type="item.type" size="small">
                    {{ item.title }}
                  </n-tag>
                </template>
                <n-flex>
                  <n-ellipsis :line-clamp="1">{{ item.content }}</n-ellipsis>
                </n-flex>
              </n-list-item>
            </n-list>
          </n-card>
        </n-flex>
      </n-gi>
    </n-grid>
  </div>
</template>

<script lang="tsx" setup>
import LogAPI from "@/api/system/log";
import { parseTime } from "@/utils";
import { EChartsOption, graphic } from "echarts";
import { useLoading, useOnlineCount } from "@/hooks";

const up = "ant-design:arrow-up-outlined";
const down = "ant-design:arrow-down-outlined";
const link = "ant-design:link-outlined";
const unLink = "ant-design:disconnect-outlined";

interface List {
  key: number;
  type: import("naive-ui").TagProps["type"];
  title: string;
  content: string;
}

const { t } = useI18n();

const { loading, startLoading, endLoading } = useLoading();

const startDate = new Date();

onMounted(() => {
  // 设置最近七天日期
  dateRange.value = [startDate.setDate(new Date().getDate() - 6), Date.now()];
  // 初始化 Echarts Options
  chartRef.value?.initOptions(defaultOptions.value);
  // 获取访问趋势数据
  fetchVisitTrendData();
  // 获取访客统计数据
  fetchVisitStatsData();
});

const aboutList = computed(() => [
  {
    icon: "logos:vitejs",
    header: "Vite",
    description: t("home.about.vite"),
    url: "https://cn.vitejs.dev/",
  },
  {
    icon: "logos:vue",
    header: "Vue",
    description: t("home.about.vue"),
    url: "https://cn.vuejs.org/",
  },
  {
    icon: "logos:pinia",
    header: "Pinia",
    description: t("home.about.pinia"),
    url: "https://pinia.vuejs.org/zh/",
  },
  {
    icon: "logos:typescript-icon",
    header: "TypeScript",
    description: t("home.about.ts"),
    url: "https://typescriptlang.org/",
  },
  {
    icon: "logos:naiveui",
    header: "Naive UI",
    description: t("home.about.naive"),
    url: "https://www.naiveui.com/zh-CN/os-theme/",
  },
  {
    icon: "logos:unocss",
    header: "UnoCSS",
    description: t("home.about.unocss"),
    url: "https://unocss.dev/",
  },
]);

const list = computed<List[]>(() => [
  { key: 0, type: "info", title: t("common.messageType.info"), content: t("home.list.0") },
  { key: 1, type: "primary", title: t("common.messageType.notice"), content: t("home.list.1") },
  {
    key: 2,
    type: "success",
    title: t("common.messageType.announcement"),
    content: t("home.list.2"),
  },
  { key: 3, type: "warning", title: t("common.messageType.activity"), content: t("home.list.3") },
  { key: 4, type: "default", title: t("common.messageType.info"), content: t("home.list.4") },
  { key: 5, type: "success", title: t("common.messageType.notice"), content: t("home.list.5") },
  { key: 6, type: "error", title: t("common.messageType.activity"), content: t("home.list.6") },
  { key: 7, type: "primary", title: t("common.messageType.message"), content: t("home.list.7") },
  { key: 8, type: "info", title: t("common.messageType.notice"), content: t("home.list.8") },
  {
    key: 9,
    type: "success",
    title: t("common.messageType.announcement"),
    content: t("home.list.9"),
  },
  { key: 10, type: "warning", title: t("common.messageType.notice"), content: t("home.list.10") },
]);

const dateRange = ref<[number, number]>();
const defaultOptions = computed((): EChartsOption => {
  return {
    legend: {
      data: [t("home.chart.pv"), t("home.chart.uv")],
      textStyle: { color: "#666" },
    },
    grid: {
      left: "20",
      right: "50",
      bottom: "10",
      top: "60",
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        lineStyle: { color: "#999" },
      },
      backgroundColor: "rgba(255,255,255,1)",
      padding: [5, 10],
      extraCssText: "box-shadow: 0 0 5px rgba(0,0,0,0.3)",
    },
    xAxis: {
      type: "category",
      // data: data.dates,
      boundaryGap: false,
      splitLine: { show: false },
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: {
        padding: [10, 30, 10, 0],
        fontSize: 12,
      },
    },
    yAxis: {
      type: "value",
      splitLine: {
        show: false,
        lineStyle: {
          color: "rgba(151,151,151,0.5)",
          type: "dashed",
        },
      },
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: {
        margin: 10,
        fontSize: 12,
      },
    },
    series: [
      {
        name: t("home.chart.pv"),
        type: "line",
        smooth: true,
        showSymbol: false,
        symbol: "circle",
        symbolSize: 6,
        // data: data.pvList,
        label: {
          show: true,
          position: "top",
        },
        lineStyle: {
          color: "#00b3f4",
          shadowColor: "rgba(0, 0, 0, .1)",
          shadowBlur: 0,
          shadowOffsetY: 2,
          shadowOffsetX: 2,
        },
        itemStyle: {
          color: "#00b3f4",
          borderColor: "#fff",
          borderWidth: 3,
          shadowColor: "rgba(0, 0, 0, .3)",
          shadowBlur: 0,
          shadowOffsetY: 1,
          shadowOffsetX: 1,
        },
        areaStyle: {
          color: new graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: "rgba(0,179,244,0.3)",
              },
              {
                offset: 1,
                color: "rgba(0,179,244,0)",
              },
            ],
            false
          ),
          shadowColor: "rgba(0,179,244, 0.9)",
          shadowBlur: 20,
        },
        markLine: {
          silent: true,
          data: [{ type: "average" }],
          precision: 0,
          label: {
            position: "end",
            formatter: "{c}",
            fontSize: 12,
            color: "rgba(0,179,244,1)",
          },
          lineStyle: {
            color: "rgba(0,179,244,.6)",
          },
        },
      },
      {
        name: t("home.chart.uv"),
        type: "line",
        smooth: true,
        showSymbol: false,
        symbol: "circle",
        symbolSize: 6,
        // data: data.ipList,
        label: {
          show: true,
          position: "top",
        },
        lineStyle: {
          color: "#00ca95",
          shadowColor: "rgba(0, 0, 0, .1)",
          shadowBlur: 0,
          shadowOffsetY: 2,
          shadowOffsetX: 2,
        },
        itemStyle: {
          color: "#00ca95",
          borderColor: "#fff",
          borderWidth: 3,
          shadowColor: "rgba(0, 0, 0, .3)",
          shadowBlur: 0,
          shadowOffsetY: 2,
          shadowOffsetX: 2,
        },
        areaStyle: {
          color: new graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: "rgba(0,202,149,0.3)",
              },
              {
                offset: 1,
                color: "rgba(0,202,149,0)",
              },
            ],
            false
          ),
          shadowColor: "rgba(0,202,149, 0.9)",
          shadowBlur: 20,
        },
        markLine: {
          silent: true,
          data: [{ type: "average" }],
          precision: 0,
          label: {
            position: "end",
            formatter: "{c}",
            fontSize: 12,
            color: "rgba(0,202,149,1)",
          },
          lineStyle: {
            color: "rgba(0,202,149,.6)",
          },
        },
      },
    ],
  };
});

// 在线用户数量组件相关
const { onlineUserCount, lastUpdateTime, isConnected } = useOnlineCount();

// 记录上一次的用户数量用于计算趋势
const previousCount = ref(0);

// 监听用户数量变化，计算趋势
watch(onlineUserCount, (_newCount, oldCount) => {
  if (oldCount > 0) {
    previousCount.value = oldCount;
  }
});

// 时间范围快捷选择
const createTimeRange = (days: number) => () => [Date.now() - days * 864e5, Date.now()] as const;
const shortcuts = {
  [t("home.time.week")]: createTimeRange(7),
  [t("home.time.month")]: createTimeRange(30),
  [t("home.time.year")]: createTimeRange(90),
  [t("home.time.threeYear")]: createTimeRange(365),
};

// 格式化时间戳
const formattedTime = computed(() => (lastUpdateTime ? parseTime(lastUpdateTime.value) : ""));

/**
 * 获取访问趋势数据，并更新图表配置
 */
const fetchVisitTrendData = () => {
  const [startDate, endDate] = dateRange.value!;

  LogAPI.getVisitTrend({
    startDate: parseTime(startDate, "YYYY-MM-DD"),
    endDate: parseTime(endDate, "YYYY-MM-DD"),
  }).then((data) => updateCharts(data));
};

const chartRef = useTemplateRef("chart");
const updateCharts = (data: Log.VisitTrendVO) => {
  chartRef.value?.updateCharts({
    xAxis: { data: data.dates },
    series: [{ data: data.pvList }, { data: data.ipList }],
  });
};

/**
 * 获取访客统计数据
 */
// 访客统计数据
const visitStatsData = ref<Log.VisitStatsVO>({
  todayUvCount: 0,
  uvGrowthRate: 0,
  totalUvCount: 0,
  todayPvCount: 0,
  pvGrowthRate: 0,
  totalPvCount: 0,
});
const fetchVisitStatsData = () => {
  startLoading();
  LogAPI.getVisitStats()
    .then((data) => (visitStatsData.value = data))
    .finally(() => endLoading());
};

/**
 * 格式化增长率，保留两位小数 ，并且去掉末尾的0  取绝对值
 *
 * @param growthRate
 * @returns
 */
function formatGrowthRate(growthRate: number) {
  if (growthRate === 0) {
    return "";
  }

  const formattedRate = Math.abs(growthRate * 100)
    .toFixed(2)
    .replace(/\.?0+$/, "");

  return formattedRate + "%";
}

/**
 * 根据增长率计算对应的 CSS 类名
 *
 * @param growthRate - 增长率数值
 */
const getType = (growthRate?: number) => {
  if (!growthRate) {
    return "info";
  }
  if (growthRate > 0) {
    return "error";
  } else if (growthRate < 0) {
    return "success";
  } else {
    return "info";
  }
};
</script>
