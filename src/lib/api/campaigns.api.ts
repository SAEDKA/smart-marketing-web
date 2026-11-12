import {
  Campaign,
  CampaignFilterParams,
  CampaignStatus,
  CreateCampaignRequest,
} from "@/types/domain";
import { apiRequest } from "./client";

export const campaignsApi = {
  getCampaigns: (params?: CampaignFilterParams) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("search", params.search);
    if (params?.status && params.status !== "ALL")
      searchParams.append("status", params.status);
    if (params?.objective && params.objective !== "ALL")
      searchParams.append("objective", params.objective);
    if (params?.platform && params.platform !== "ALL")
      searchParams.append("platform", params.platform);

    const query = searchParams.toString();
    const endpoint = query ? `/campaigns?${query}` : "/campaigns";
    return apiRequest<Campaign[]>("GET", endpoint);
  },

  getCampaignById: (id: string) =>
    apiRequest<Campaign>("GET", `/campaigns/${id}`),

  createCampaign: (payload: CreateCampaignRequest) =>
    apiRequest<Campaign>("POST", "/campaigns", payload),

  updateCampaign: (id: string, payload: Partial<CreateCampaignRequest>) =>
    apiRequest<Campaign>("PUT", `/campaigns/${id}`, payload),

  deleteCampaign: (id: string) =>
    apiRequest<Campaign>("DELETE", `/campaigns/${id}`),

  updateStatus: (id: string, status: CampaignStatus) =>
    apiRequest<Campaign>("PUT", `/campaigns/${id}`, { status }),
};
