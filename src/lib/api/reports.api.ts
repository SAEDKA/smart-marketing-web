import { SwotReport } from "@/types/domain";
import { apiRequest } from "./client";

export const reportsApi = {
  getSwotReport: (simulateInsufficientData = false) => {
    const endpoint = simulateInsufficientData
      ? "/reports/swot?insufficient=true"
      : "/reports/swot";
    return apiRequest<SwotReport>("GET", endpoint);
  },

  regenerateSwotReport: () =>
    apiRequest<SwotReport>("POST", "/reports/swot/regenerate"),
};
