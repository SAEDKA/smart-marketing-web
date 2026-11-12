import { BrandSettings, CompanyProfile } from "@/types/domain";
import { apiRequest } from "./client";

export const companyApi = {
  getProfile: () => apiRequest<CompanyProfile>("GET", "/company/profile"),

  saveOnboarding: (
    payload: Partial<CompanyProfile> & { simulateFailure?: boolean }
  ) => apiRequest<CompanyProfile>("PUT", "/company/onboarding", payload),

  getBrandSettings: () => apiRequest<BrandSettings>("GET", "/company/brand"),

  updateBrandSettings: (payload: Partial<BrandSettings>) =>
    apiRequest<BrandSettings>("PUT", "/company/brand", payload),
};
