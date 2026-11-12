import { describe, it, expect, beforeEach } from "vitest";
import { adminApi } from "@/lib/api/admin.api";
import { notificationsApi, accountApi } from "@/lib/api/notifications.api";

describe("Release R7 - Administration, Notifications & Account Settings Suite (WEB-03-06, WEB-03-07)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("System Administration Dashboard (WEB-03-06)", () => {
    it("fetches platform health and infrastructure metrics", async () => {
      const res = await adminApi.getHealth();
      expect(res.data).toBeDefined();
      expect(res.data.totalTenants).toBeGreaterThan(0);
      expect(res.data.activeTenants).toBeGreaterThan(0);
      expect(res.data.aiTokensConsumed).toBeGreaterThan(0);
      expect(res.data.metaApiStatus).toBe("OPERATIONAL");
      expect(res.data.dbLatencyMs).toBeGreaterThan(0);
    });

    it("retrieves list of registered tenants with plan and operational status", async () => {
      const res = await adminApi.getTenants();
      expect(Array.isArray(res.data)).toBe(true);
      expect(res.data.length).toBeGreaterThanOrEqual(4);

      const first = res.data[0];
      expect(first.companyName).toBeDefined();
      expect(first.ownerEmail).toBeDefined();
      expect(first.plan).toBeDefined();
      expect(first.status).toBeDefined();
    });

    it("suspends and reactivates a tenant workspace safely", async () => {
      const tenantsRes = await adminApi.getTenants();
      const target = tenantsRes.data.find((t) => t.status === "ACTIVE")!;

      // Suspend
      const suspendRes = await adminApi.suspendTenant(target.id);
      expect(suspendRes.data.status).toBe("SUSPENDED");

      // Reactivate
      const reactivateRes = await adminApi.reactivateTenant(target.id);
      expect(reactivateRes.data.status).toBe("ACTIVE");
    });

    it("purges publishing queue and flushes AI inference cache", async () => {
      const purgeRes = await adminApi.purgePublishingQueue();
      expect(purgeRes.data.purgedCount).toBeGreaterThanOrEqual(0);

      const flushRes = await adminApi.flushAiCache();
      expect(flushRes.data.evictedEntries).toBeGreaterThan(0);
    });

    it("fetches website traffic analytics and visitor usage breakdown", async () => {
      const trafficRes = await adminApi.getTrafficAnalytics();
      expect(trafficRes.data.totalVisitors30d).toBeGreaterThan(0);
      expect(trafficRes.data.dailyTraffic.length).toBeGreaterThan(0);
      expect(trafficRes.data.featureUsage.length).toBeGreaterThan(0);
    });

    it("manages customer complaints, admin replies, and system broadcasts", async () => {
      const listRes = await adminApi.getComplaints();
      expect(listRes.data.length).toBeGreaterThan(0);

      const created = await adminApi.submitComplaint({
        companyName: "Lumiere Artisan Roasters",
        ownerName: "Sarah Jenkins",
        ownerEmail: "sarah@lumierecoffee.com",
        category: "TECHNICAL",
        subject: "Schedule sync check",
        message: "Please verify our scheduled post queue.",
      });
      expect(created.data.status).toBe("OPEN");

      const replied = await adminApi.replyToComplaint(created.data.id, {
        status: "RESOLVED",
        adminReply: "Verified and resolved by system admin.",
      });
      expect(replied.data.status).toBe("RESOLVED");
      expect(replied.data.adminReply).toBe(
        "Verified and resolved by system admin."
      );

      const broadcastRes = await adminApi.broadcastAnnouncement({
        title: "Platform Update",
        message: "New Instagram Reels telemetry enabled.",
      });
      expect(broadcastRes.data.deliveredTenants).toBeGreaterThan(0);
    });
  });

  describe("Notifications Center (WEB-03-07)", () => {
    it("fetches notifications across distinct categories", async () => {
      const res = await notificationsApi.getNotifications();
      expect(Array.isArray(res.data)).toBe(true);
      expect(res.data.length).toBeGreaterThan(0);

      const categories = res.data.map((n) => n.category);
      expect(categories).toContain("PUBLISHING");
      expect(categories).toContain("SECURITY");
    });

    it("marks an individual notification as read", async () => {
      const notifications = await notificationsApi.getNotifications();
      const unread = notifications.data.find((n) => !n.isRead)!;

      const readRes = await notificationsApi.markAsRead(unread.id);
      expect(readRes.data.isRead).toBe(true);
    });

    it("marks all notifications as read", async () => {
      const res = await notificationsApi.markAllAsRead();
      expect(res.data.updatedCount).toBeGreaterThanOrEqual(0);

      const updated = await notificationsApi.getNotifications();
      expect(updated.data.every((n) => n.isRead)).toBe(true);
    });

    it("deletes a notification", async () => {
      const list = await notificationsApi.getNotifications();
      const target = list.data[0];

      const deleteRes = await notificationsApi.deleteNotification(target.id);
      expect(deleteRes.data.success).toBe(true);

      const updatedList = await notificationsApi.getNotifications();
      expect(updatedList.data.some((n) => n.id === target.id)).toBe(false);
    });
  });

  describe("Account Settings Management (WEB-03-07)", () => {
    it("fetches profile details", async () => {
      const res = await accountApi.getProfile();
      expect(res.data.fullName).toBeDefined();
      expect(res.data.email).toBeDefined();
      expect(res.data.role).toBeDefined();
    });

    it("updates full name profile successfully", async () => {
      const res = await accountApi.updateProfile({
        fullName: "Sarah Jenkins-Roaster",
      });
      expect(res.data.fullName).toBe("Sarah Jenkins-Roaster");
    });

    it("validates full name minimum length", async () => {
      await expect(
        accountApi.updateProfile({ fullName: "A" })
      ).rejects.toMatchObject({
        code: "VALIDATION_ERROR",
        status: 400,
      });
    });

    it("changes password with valid credentials", async () => {
      const res = await accountApi.changePassword({
        currentPassword: "CurrentPassword123!",
        newPassword: "NewSecurePassword456!",
      });
      expect(res.data.success).toBe(true);
    });

    it("rejects password changes with weak passwords", async () => {
      await expect(
        accountApi.changePassword({
          currentPassword: "ValidCurrentPassword123!",
          newPassword: "short",
        })
      ).rejects.toMatchObject({
        code: "VALIDATION_ERROR",
        status: 400,
      });
    });
  });
});
