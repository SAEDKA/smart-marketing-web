import {
  AdminAuditLog,
  AdminComplaintTicket,
  AdminSystemHealth,
  AdminTenant,
  AdminTrafficAnalytics,
  ComplaintPriority,
  ComplaintStatus,
} from "@/types/domain";
import { apiRequest } from "./client";

export const adminApi = {
  getHealth: () =>
    apiRequest<AdminSystemHealth>("GET", "/admin/health"),

  getTenants: () =>
    apiRequest<AdminTenant[]>("GET", "/admin/tenants"),

  suspendTenant: (tenantId: string) =>
    apiRequest<AdminTenant>("POST", `/admin/tenants/${tenantId}/suspend`),

  reactivateTenant: (tenantId: string) =>
    apiRequest<AdminTenant>("POST", `/admin/tenants/${tenantId}/reactivate`),

  purgePublishingQueue: () =>
    apiRequest<{ purgedCount: number }>("POST", "/admin/system/purge-queue"),

  flushAiCache: () =>
    apiRequest<{ evictedEntries: number }>("POST", "/admin/system/flush-cache"),

  getTrafficAnalytics: () =>
    apiRequest<AdminTrafficAnalytics>("GET", "/admin/traffic"),

  getComplaints: () =>
    apiRequest<AdminComplaintTicket[]>("GET", "/admin/complaints"),

  submitComplaint: (payload: {
    companyName: string;
    ownerName: string;
    ownerEmail: string;
    category: AdminComplaintTicket["category"];
    priority?: ComplaintPriority;
    subject: string;
    message: string;
  }) =>
    apiRequest<AdminComplaintTicket>("POST", "/admin/complaints", payload),

  replyToComplaint: (
    ticketId: string,
    payload: { status: ComplaintStatus; adminReply?: string }
  ) =>
    apiRequest<AdminComplaintTicket>(
      "POST",
      `/admin/complaints/${ticketId}/reply`,
      payload
    ),

  getAuditLogs: () =>
    apiRequest<AdminAuditLog[]>("GET", "/admin/logs"),

  broadcastAnnouncement: (payload: { title: string; message: string }) =>
    apiRequest<{ deliveredTenants: number }>(
      "POST",
      "/admin/system/broadcast",
      payload
    ),
};
