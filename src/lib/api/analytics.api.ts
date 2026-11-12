import {
  AnalyticsDateRange,
  AnalyticsMetricSummary,
  AnalyticsTrendPoint,
  PlatformMetricBreakdown,
} from "@/types/domain";
import { apiRequest } from "./client";

export const analyticsApi = {
  getSummary: (range: AnalyticsDateRange = "30d") =>
    apiRequest<AnalyticsMetricSummary>(
      "GET",
      `/analytics/summary?range=${range}`
    ),

  getTrends: (range: AnalyticsDateRange = "30d") =>
    apiRequest<AnalyticsTrendPoint[]>(
      "GET",
      `/analytics/trends?range=${range}`
    ),

  getPlatformBreakdown: (range: AnalyticsDateRange = "30d") =>
    apiRequest<PlatformMetricBreakdown[]>(
      "GET",
      `/analytics/platforms?range=${range}`
    ),
};
