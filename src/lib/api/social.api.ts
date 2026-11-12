import { SocialAccount, SocialPlatform } from "@/types/domain";
import { apiRequest } from "./client";

export const socialApi = {
  getAccounts: () =>
    apiRequest<SocialAccount[]>("GET", "/social/accounts"),

  connectAccount: (platform: SocialPlatform) =>
    apiRequest<{ redirectUrl: string; account: SocialAccount }>(
      "POST",
      "/social/connect",
      { platform }
    ),

  reconnectAccount: (accountId: string) =>
    apiRequest<SocialAccount>(
      "POST",
      `/social/accounts/${accountId}/reconnect`
    ),

  disconnectAccount: (accountId: string) =>
    apiRequest<{ success: boolean; accountId: string }>(
      "POST",
      `/social/accounts/${accountId}/disconnect`
    ),
};
