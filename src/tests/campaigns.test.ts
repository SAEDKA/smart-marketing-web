import { describe, it, expect } from "vitest";
import { campaignsApi } from "@/lib/api/campaigns.api";

describe("R3 Campaign Management API (WEB-02-03, WEB-02-04)", () => {
  it("fetches the list of campaigns for the company workspace (BE-04-01)", async () => {
    const res = await campaignsApi.getCampaigns();
    expect(res.data.length).toBeGreaterThan(0);
    expect(res.data[0].companyId).toBe("cmp_lumiere_01");
    expect(res.meta.mode).toBe("mock");
  });

  it("filters campaigns by search keyword, objective, and platform (BE-04-07)", async () => {
    // Search
    const searchRes = await campaignsApi.getCampaigns({ search: "Solstice" });
    expect(searchRes.data.length).toBe(1);
    expect(searchRes.data[0].name).toContain("Solstice");

    // Objective
    const objRes = await campaignsApi.getCampaigns({ objective: "INCREASE_SALES" });
    expect(objRes.data.every((c) => c.objective === "INCREASE_SALES")).toBe(true);

    // Platform
    const platRes = await campaignsApi.getCampaigns({ platform: "FACEBOOK" });
    expect(platRes.data.every((c) => c.platforms.includes("FACEBOOK"))).toBe(true);
  });

  it("retrieves campaign by ID (BE-04-03)", async () => {
    const res = await campaignsApi.getCampaignById("cmp_winter_drop_01");
    expect(res.data.id).toBe("cmp_winter_drop_01");
    expect(res.data.objective).toBe("INCREASE_ENGAGEMENT");
  });

  it("throws 404 for non-existent campaign ID", async () => {
    await expect(
      campaignsApi.getCampaignById("non_existent_campaign")
    ).rejects.toMatchObject({
      code: "NOT_FOUND",
      status: 404,
    });
  });

  it("validates campaign creation fields: requires name, productIds, and platforms (BE-04-01)", async () => {
    // Rejects empty name
    await expect(
      campaignsApi.createCampaign({
        name: "",
        objective: "INCREASE_SALES",
        productIds: ["prd_yirgacheffe_01"],
        platforms: ["INSTAGRAM"],
        targetAudience: "Coffee lovers",
        startDate: "2026-11-20",
        endDate: "2026-12-01",
        contentLanguage: "en",
        communicationTone: "LUXURY",
      })
    ).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
      status: 400,
    });

    // Rejects empty products
    await expect(
      campaignsApi.createCampaign({
        name: "Test Campaign",
        objective: "INCREASE_SALES",
        productIds: [],
        platforms: ["INSTAGRAM"],
        targetAudience: "Coffee lovers",
        startDate: "2026-11-20",
        endDate: "2026-12-01",
        contentLanguage: "en",
        communicationTone: "LUXURY",
      })
    ).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
      status: 400,
    });

    // Rejects empty platforms
    await expect(
      campaignsApi.createCampaign({
        name: "Test Campaign",
        objective: "INCREASE_SALES",
        productIds: ["prd_yirgacheffe_01"],
        platforms: [],
        targetAudience: "Coffee lovers",
        startDate: "2026-11-20",
        endDate: "2026-12-01",
        contentLanguage: "en",
        communicationTone: "LUXURY",
      })
    ).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
      status: 400,
    });
  });

  it("validates campaign flight dates: rejects endDate earlier than startDate (BE-04-01)", async () => {
    await expect(
      campaignsApi.createCampaign({
        name: "Invalid Date Campaign",
        objective: "INCREASE_SALES",
        productIds: ["prd_yirgacheffe_01"],
        platforms: ["INSTAGRAM"],
        targetAudience: "Coffee lovers",
        startDate: "2026-12-10",
        endDate: "2026-12-01", // End date before start date!
        contentLanguage: "en",
        communicationTone: "LUXURY",
      })
    ).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
      status: 400,
    });
  });

  it("creates, pauses, resumes, and deletes a campaign (WEB-02-03, WEB-02-04)", async () => {
    // Create draft
    const created = await campaignsApi.createCampaign({
      name: "Holiday Chemex Tasting Campaign",
      objective: "INCREASE_ENGAGEMENT",
      productIds: ["prd_yirgacheffe_01"],
      platforms: ["INSTAGRAM", "FACEBOOK"],
      targetAudience: "Specialty coffee lovers seeking brewing guides.",
      startDate: "2026-12-01",
      endDate: "2026-12-24",
      contentLanguage: "en",
      communicationTone: "LUXURY",
      status: "DRAFT",
    });
    expect(created.data.id).toBeDefined();
    expect(created.data.status).toBe("DRAFT");

    // Pause status update
    const paused = await campaignsApi.updateStatus(created.data.id, "PAUSED");
    expect(paused.data.status).toBe("PAUSED");

    // Resume to ACTIVE
    const resumed = await campaignsApi.updateStatus(created.data.id, "ACTIVE");
    expect(resumed.data.status).toBe("ACTIVE");

    // Delete
    const deleted = await campaignsApi.deleteCampaign(created.data.id);
    expect(deleted.data.id).toBe(created.data.id);
  });

  it("enforces status-based editing restrictions on COMPLETED campaigns (BE-04-06)", async () => {
    // Attempting to alter flight dates or products on a completed campaign must be blocked
    await expect(
      campaignsApi.updateCampaign("cmp_autumn_harvest_04", {
        startDate: "2026-11-01",
      })
    ).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
      status: 400,
    });
  });
});
