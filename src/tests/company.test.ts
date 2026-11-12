import { describe, it, expect } from "vitest";
import { companyApi } from "@/lib/api/company.api";

describe("R1 Company Onboarding & Brand Settings API (WEB-01-06, WEB-01-07)", () => {
  it("fetches the current company profile", async () => {
    const res = await companyApi.getProfile();
    expect(res.data.id).toBeDefined();
    expect(res.data.companyName).toBeDefined();
    expect(res.data.communicationTone).toBeDefined();
  });

  it("handles company onboarding save and synchronizes with brand settings", async () => {
    const updateRes = await companyApi.saveOnboarding({
      companyName: "Lumiere Artisan Roasters",
      industry: "Artisanal Specialty Coffee",
      description: "Organic micro-lot coffee beans roasted fresh in Istanbul.",
      communicationTone: "LUXURY",
      preferredLanguage: "en",
    });
    expect(updateRes.data.onboardingCompleted).toBe(true);

    const brandRes = await companyApi.getBrandSettings();
    expect(brandRes.data.brandName).toBe("Lumiere Artisan Roasters");
    expect(brandRes.data.communicationTone).toBe("LUXURY");
  });

  it("supports transient failure simulation without losing user input state", async () => {
    await expect(
      companyApi.saveOnboarding({
        companyName: "Test Name",
        simulateFailure: true,
      })
    ).rejects.toMatchObject({
      code: "SERVER_ERROR",
      status: 503,
    });
  });

  it("updates and retrieves brand settings (WEB-01-07)", async () => {
    const res = await companyApi.updateBrandSettings({
      keyValueProposition: "100% Traceable Arabica micro-lots",
      communicationTone: "FRIENDLY",
    });
    expect(res.data.keyValueProposition).toBe("100% Traceable Arabica micro-lots");
    expect(res.data.communicationTone).toBe("FRIENDLY");
  });
});
