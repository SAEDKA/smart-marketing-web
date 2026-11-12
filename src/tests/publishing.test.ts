import { describe, it, expect, beforeEach } from "vitest";
import { socialApi } from "@/lib/api/social.api";
import { publishingApi } from "@/lib/api/publishing.api";
import { postsApi } from "@/lib/api/posts.api";

describe("Release R5 - Social Accounts & Automated Publishing Suite (WEB-03-01, WEB-03-02, WEB-03-03)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("Social Account Connections (WEB-03-01)", () => {
    it("fetches connected accounts and identifies Instagram and Facebook", async () => {
      const res = await socialApi.getAccounts();
      expect(Array.isArray(res.data)).toBe(true);
      expect(res.data.length).toBeGreaterThanOrEqual(2);

      const ig = res.data.find((a) => a.platform === "INSTAGRAM");
      const fb = res.data.find((a) => a.platform === "FACEBOOK");

      expect(ig).toBeDefined();
      expect(fb).toBeDefined();
      expect(ig?.status).toBe("CONNECTED");
      expect(fb?.status).toBe("TOKEN_EXPIRED");
    });

    it("connects account via OAuth initiating redirect without client secret exposure", async () => {
      const res = await socialApi.connectAccount("INSTAGRAM");
      expect(res.data.redirectUrl).toBeDefined();
      expect(res.data.redirectUrl).toContain("meta.com/oauth/dialog");
      expect(res.data.account.platform).toBe("INSTAGRAM");
      expect(res.data.account.status).toBe("CONNECTED");
    });

    it("reconnects expired Facebook account and restores healthy token", async () => {
      const accountsRes = await socialApi.getAccounts();
      const fb = accountsRes.data.find((a) => a.platform === "FACEBOOK")!;

      const reconnectRes = await socialApi.reconnectAccount(fb.id);
      expect(reconnectRes.data.status).toBe("CONNECTED");
      expect(reconnectRes.data.tokenExpiresAt).toBeDefined();
    });

    it("disconnects a social account safely", async () => {
      const accountsRes = await socialApi.getAccounts();
      const target = accountsRes.data[0];

      const res = await socialApi.disconnectAccount(target.id);
      expect(res.data.success).toBe(true);

      const updatedAccounts = await socialApi.getAccounts();
      const updated = updatedAccounts.data.find((a) => a.id === target.id);
      expect(updated?.status).toBe("DISCONNECTED");
    });
  });

  describe("Publishing Calendar & Scheduling (WEB-03-02)", () => {
    it("retrieves publication calendar items", async () => {
      const res = await publishingApi.getCalendarSchedule(2026, 11);
      expect(Array.isArray(res.data)).toBe(true);
      expect(res.data.length).toBeGreaterThan(0);
    });

    it("schedules an approved post for future publication", async () => {
      // Create and approve a post first
      const postRes = await postsApi.createPost({
        campaignId: "cmp_winter_drop_01",
        platform: "INSTAGRAM",
        title: "Test Calendar Post",
        caption: "Valid caption for calendar publication testing.",
        callToAction: "Order Now",
        hashtags: ["#calendar"],
        status: "APPROVED",
      });

      const futureDate = "2026-11-20T14:00:00.000Z";
      const scheduleRes = await publishingApi.schedulePost({
        postId: postRes.data.id,
        scheduledAt: futureDate,
      });

      expect(scheduleRes.data.status).toBe("SCHEDULED");
      expect(scheduleRes.data.scheduledAt).toBe(futureDate);
    });

    it("rejects scheduling if required parameters are missing", async () => {
      await expect(
        publishingApi.schedulePost({
          postId: "",
          scheduledAt: "2026-11-20T14:00:00.000Z",
        })
      ).rejects.toMatchObject({
        code: "VALIDATION_ERROR",
        status: 400,
      });
    });

    it("cancels a scheduled post and reverts status to APPROVED", async () => {
      // Find or create a scheduled post
      const scheduledPosts = await publishingApi.getCalendarSchedule();
      const target = scheduledPosts.data.find((p) => p.status === "SCHEDULED")!;

      const cancelRes = await publishingApi.cancelSchedule(target.id);
      expect(cancelRes.data.status).toBe("APPROVED");
      expect(cancelRes.data.scheduledAt).toBeUndefined();
    });
  });

  describe("Publishing Status & Error Handling (WEB-03-03)", () => {
    it("publishes immediately to connected social channel", async () => {
      const posts = await postsApi.getPosts();
      const draft = posts.data[0];

      const publishRes = await publishingApi.publishNow(draft.id);
      expect(publishRes.data.status).toBe("PUBLISHED");
      expect(publishRes.data.publishedAt).toBeDefined();
      expect(publishRes.data.externalPostUrl).toBeDefined();
    });

    it("handles publishing failure diagnostics and allows retry when valid", async () => {
      const posts = await publishingApi.getCalendarSchedule();
      const failedPost = posts.data.find((p) => p.status === "FAILED");
      expect(failedPost).toBeDefined();
      expect(failedPost?.publishingError).toBeDefined();

      // Ensure platform account is reconnected so retry succeeds
      await socialApi.connectAccount("FACEBOOK");

      const retryRes = await publishingApi.retryPublish(failedPost!.id);
      expect(retryRes.data.status).toBe("PUBLISHED");
      expect(retryRes.data.publishingError).toBeUndefined();
    });
  });
});
