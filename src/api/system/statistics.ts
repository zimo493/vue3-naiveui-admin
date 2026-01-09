import { get } from "@/utils";

const STATISTICS_BASE_URL = "/api/v1/statistics";

export default {
  getVisitTrend: (params: Log.VisitTrendQuery) =>
    get<Log.VisitTrendVO>(`${STATISTICS_BASE_URL}/visits/trend`, params),
  getVisitOverview: () => get<Log.VisitStatsVO>(`${STATISTICS_BASE_URL}/visits/overview`),
};
