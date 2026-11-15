import { describe, it, expect, beforeEach } from "vitest";
import { aiApi } from "@/lib/api/ai.api";
import { postsApi } from "@/lib/api/posts.api";

describe("Release R4 - AI Studio & Post Review/Editor Suite (WEB-02-05, WEB-02-06, WEB-02-07)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("AI Content Generation (WEB-02-05)", () => {
    it("generates 3 structured AI variants for Instagram", async () => {
      const res = await aiApi.generateVariants({
        campaignId: "cmp_winter_drop_01",
        productId: "prd_yirgacheffe_01",
        platform: "INSTAGRAM",
        contentLanguage: "en",
        tone: "LUXURY",
      });

      expect(Array.isArray(res.data)).toBe(true);
      expect(res.data.length).toBe(3);
      expect(res.data[0]).toHaveProperty("id");
      expect(res.data[0]).toHaveProperty("title");
      expect(res.data[0]).toHaveProperty("caption");
      expect(res.data[0].hashtags.length).toBeGreaterThan(0);
      expect(res.data[0].callToAction.length).toBeGreaterThan(0);
      expect(res.data[0].recommendedPublishingTime).toBeDefined();
    });

    it("generates prompt-based variants when no product is selected", async () => {
      const res = await aiApi.generateVariants({
        campaignId: "cmp_winter_drop_01",
        productId: "",
        platform: "INSTAGRAM",
        contentLanguage: "en",
        tone: "FRIENDLY",
        customPrompt: "Weekend haircut offer at our barbershop",
      });

      expect(res.data.length).toBe(3);
      expect(res.data[0].title).toContain("Weekend haircut offer");
      expect(res.data[0].caption).toContain("Weekend haircut offer");
      // Must not silently reuse a catalog product
      expect(res.data[0].title).not.toContain("Yirgacheffe");
    });

    it("notes attached photos in the art direction when media is provided", async () => {
      const res = await aiApi.generateVariants({
        campaignId: "cmp_winter_drop_01",
        productId: "",
        platform: "INSTAGRAM",
        contentLanguage: "en",
        tone: "FRIENDLY",
        customPrompt: "Weekend haircut offer at our barbershop",
        mediaNames: ["shop-front.jpg", "chair.jpg"],
      });

      expect(res.data.length).toBe(3);
      expect(res.data[0].visualIdea).toContain("2 uploaded photos");
    });

    it("rejects when AI worker timeout is simulated", async () => {
      await expect(
        aiApi.generateVariants({
          campaignId: "cmp_winter_drop_01",
          productId: "prd_yirgacheffe_01",
          platform: "INSTAGRAM",
          contentLanguage: "en",
          tone: "LUXURY",
          simulateFailure: true,
        })
      ).rejects.toMatchObject({
        code: "SERVER_ERROR",
        status: 504,
      });
    });
  });

  describe("Posts Management & Filtering (WEB-02-06)", () => {
    it("retrieves list of posts", async () => {
      const res = await postsApi.getPosts();
      expect(Array.isArray(res.data)).toBe(true);
      expect(res.data.length).toBeGreaterThan(0);
      expect(res.data[0]).toHaveProperty("currentVersion");
    });

    it("filters posts by status", async () => {
      const res = await postsApi.getPosts({ status: "PENDING_REVIEW" });
      expect(res.data.length).toBeGreaterThan(0);
      expect(res.data.every((p) => p.status === "PENDING_REVIEW")).toBe(true);
    });

    it("filters posts by platform", async () => {
      const res = await postsApi.getPosts({ platform: "INSTAGRAM" });
      expect(res.data.length).toBeGreaterThan(0);
      expect(res.data.every((p) => p.platform === "INSTAGRAM")).toBe(true);
    });
  });

  describe("Post Creation, Revision & Version Control (WEB-02-06)", () => {
    it("creates a new post with initial version 1", async () => {
      const res = await postsApi.createPost({
        campaignId: "cmp_winter_drop_01",
        productId: "prd_yirgacheffe_01",
        platform: "INSTAGRAM",
        title: "Launch Day Magic",
        caption: "Experience the next generation of artisan roasted coffees today!",
        callToAction: "Order direct through bio link",
        hashtags: ["#SpecialtyCoffee", "#Artisan"],
        mediaUrl: "/images/products/coffee-beans.jpg",
      });

      expect(res.data.id).toBeDefined();
      expect(res.data.status).toBe("DRAFT");
      expect(res.data.versions.length).toBe(1);
      expect(res.data.versions[0].versionNumber).toBe(1);
      expect(res.data.currentVersion.title).toBe("Launch Day Magic");
    });

    it("creates a new revision version on update", async () => {
      const createRes = await postsApi.createPost({
        campaignId: "cmp_winter_drop_01",
        productId: "prd_yirgacheffe_01",
        platform: "FACEBOOK",
        title: "Original Title",
        caption: "Original caption text for revision tracking testing.",
        callToAction: "Learn More",
        hashtags: ["#orig"],
      });

      const updateRes = await postsApi.updatePost(createRes.data.id, {
        title: "Revised Title v2",
        caption: "Updated caption text for revision tracking testing.",
      });

      expect(updateRes.data.currentVersion.title).toBe("Revised Title v2");
      expect(updateRes.data.versions.length).toBe(2);
      expect(updateRes.data.versions[1].versionNumber).toBe(2);
    });

    it("reverts back to an earlier version", async () => {
      const createRes = await postsApi.createPost({
        campaignId: "cmp_winter_drop_01",
        productId: "prd_yirgacheffe_01",
        platform: "INSTAGRAM",
        title: "Title V1",
        caption: "Initial caption v1 with specific unique keywords",
        callToAction: "Click Here",
        hashtags: ["#v1"],
      });

      await postsApi.updatePost(createRes.data.id, {
        title: "Title V2",
        caption: "Modified caption v2",
      });

      const revertRes = await postsApi.revertVersion(createRes.data.id, 1);
      expect(revertRes.data.currentVersion.title).toBe("Title V1");
      expect(revertRes.data.currentVersion.caption).toBe(
        "Initial caption v1 with specific unique keywords"
      );
    });
  });

  describe("Human Approval & Rejection Workflow (WEB-02-07)", () => {
    it("approves a ready post", async () => {
      const createRes = await postsApi.createPost({
        campaignId: "cmp_winter_drop_01",
        productId: "prd_yirgacheffe_01",
        platform: "INSTAGRAM",
        title: "Approved Post Title",
        caption: "Valid length caption with more than 10 characters and clear CTA.",
        callToAction: "Shop Now",
        hashtags: ["#verified"],
        status: "PENDING_REVIEW",
      });

      const approveRes = await postsApi.approvePost(createRes.data.id);
      expect(approveRes.data.status).toBe("APPROVED");
    });

    it("rejects post with required reason feedback", async () => {
      const createRes = await postsApi.createPost({
        campaignId: "cmp_winter_drop_01",
        productId: "prd_yirgacheffe_01",
        platform: "FACEBOOK",
        title: "Needs Improvement",
        caption: "Some caption that is missing clear compliance standards.",
        callToAction: "Visit Site",
        hashtags: [],
      });

      const rejectRes = await postsApi.rejectPost(
        createRes.data.id,
        "Caption tone does not match our brand voice."
      );
      expect(rejectRes.data.status).toBe("REJECTED");
      expect(rejectRes.data.rejectionReason).toBe(
        "Caption tone does not match our brand voice."
      );
    });
  });
});
