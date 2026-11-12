import { describe, it, expect, beforeEach } from "vitest";
import { analyticsApi } from "@/lib/api/analytics.api";
import { reportsApi } from "@/lib/api/reports.api";

describe("Release R6 - Analytics & SWOT Intelligence Suite (WEB-03-04, WEB-03-05)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("Marketing Performance Analytics (WEB-03-04)", () => {
    it("fetches metrics summary and upholds Reach vs. Impressions distinction", async () => {
      const res = await analyticsApi.getSummary("30d");
      expect(res.data).toBeDefined();

      // Reach measures unique accounts; Impressions measures total gross views
      expect(res.data.impressions).toBeGreaterThan(res.data.reach);
      expect(res.data.reach).toBeGreaterThan(0);
      expect(res.data.impressions).toBeGreaterThan(0);

      // Verify essential marketing telemetry metrics
      expect(res.data.engagementRate).toBeGreaterThan(0);
      expect(res.data.likes).toBeGreaterThan(0);
      expect(res.data.comments).toBeGreaterThan(0);
      expect(res.data.shares).toBeGreaterThan(0);
      expect(res.data.saves).toBeGreaterThan(0);
      expect(res.data.linkClicks).toBeGreaterThan(0);
      expect(res.data.clickThroughRate).toBeGreaterThan(0);
      expect(res.data.lastSynchronizedAt).toBeDefined();
    });

    it("adjusts metric volumes according to selected date range filter", async () => {
      const summary7d = await analyticsApi.getSummary("7d");
      const summary30d = await analyticsApi.getSummary("30d");
      const summary90d = await analyticsApi.getSummary("90d");

      expect(summary7d.data.reach).toBeLessThan(summary30d.data.reach);
      expect(summary30d.data.reach).toBeLessThan(summary90d.data.reach);
    });

    it("fetches performance trends over time", async () => {
      const res = await analyticsApi.getTrends("14d");
      expect(Array.isArray(res.data)).toBe(true);
      expect(res.data.length).toBeGreaterThan(0);
      expect(res.data[0]).toHaveProperty("reach");
      expect(res.data[0]).toHaveProperty("impressions");
      expect(res.data[0]).toHaveProperty("engagement");
    });

    it("fetches platform comparison breakdown between Instagram and Facebook", async () => {
      const res = await analyticsApi.getPlatformBreakdown("30d");
      expect(Array.isArray(res.data)).toBe(true);
      expect(res.data.length).toBe(2);

      const platforms = res.data.map((p) => p.platform);
      expect(platforms).toContain("INSTAGRAM");
      expect(platforms).toContain("FACEBOOK");
    });
  });

  describe("SWOT Intelligence & Strategic Directives (WEB-03-05)", () => {
    it("returns fully evidence-backed SWOT report with 4 quadrants", async () => {
      const res = await reportsApi.getSwotReport();
      expect(res.data.hasSufficientData).toBe(true);
      expect(res.data.items.length).toBeGreaterThanOrEqual(4);

      const categories = res.data.items.map((i) => i.category);
      expect(categories).toContain("STRENGTH");
      expect(categories).toContain("WEAKNESS");
      expect(categories).toContain("OPPORTUNITY");
      expect(categories).toContain("THREAT");

      // Verify that all SWOT items have numerical data evidence
      for (const item of res.data.items) {
        expect(item.numericalEvidence).toBeDefined();
        expect(item.numericalEvidence.length).toBeGreaterThan(5);
        expect(item.impactScore).toBeDefined();
      }
    });

    it("provides prioritized marketing directives with expected impact", async () => {
      const res = await reportsApi.getSwotReport();
      expect(res.data.recommendations.length).toBeGreaterThan(0);

      const firstRec = res.data.recommendations[0];
      expect(firstRec.priority).toBe("HIGH");
      expect(firstRec.title).toBeDefined();
      expect(firstRec.actionItem).toBeDefined();
      expect(firstRec.rationale).toBeDefined();
      expect(firstRec.expectedImpact).toBeDefined();
    });

    it("handles cold-start / insufficient data state honestly", async () => {
      const res = await reportsApi.getSwotReport(true);
      expect(res.data.hasSufficientData).toBe(false);
      expect(res.data.items.length).toBe(0);
      expect(res.data.recommendations.length).toBe(0);
      expect(res.data.publishedPostsCount).toBeLessThan(3);
    });

    it("allows regenerating the intelligence matrix", async () => {
      const res = await reportsApi.regenerateSwotReport();
      expect(res.data).toBeDefined();
      expect(res.data.generatedAt).toBeDefined();
    });
  });
});
