import {
  ChangePasswordRequest,
  NotificationItem,
  UpdateAccountProfileRequest,
  AuthUser,
} from "@/types/domain";
import { apiRequest } from "./client";

export const notificationsApi = {
  getNotifications: () =>
    apiRequest<NotificationItem[]>("GET", "/notifications"),

  markAsRead: (id: string) =>
    apiRequest<NotificationItem>("POST", `/notifications/${id}/read`),

  markAllAsRead: () =>
    apiRequest<{ updatedCount: number }>("POST", "/notifications/read-all"),

  deleteNotification: (id: string) =>
    apiRequest<{ success: boolean; id: string }>(
      "DELETE",
      `/notifications/${id}`
    ),
};

export const accountApi = {
  getProfile: () =>
    apiRequest<AuthUser>("GET", "/account/profile"),

  updateProfile: (payload: UpdateAccountProfileRequest) =>
    apiRequest<AuthUser>("PUT", "/account/profile", payload),

  changePassword: (payload: ChangePasswordRequest) =>
    apiRequest<{ success: boolean; message: string }>(
      "POST",
      "/account/change-password",
      payload
    ),
};
