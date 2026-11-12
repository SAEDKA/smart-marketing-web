import { Post, SchedulePostRequest } from "@/types/domain";
import { apiRequest } from "./client";

export const publishingApi = {
  getCalendarSchedule: (year?: number, month?: number) => {
    const params = new URLSearchParams();
    if (year) params.append("year", year.toString());
    if (month) params.append("month", month.toString());
    const query = params.toString();
    return apiRequest<Post[]>(
      "GET",
      query ? `/publishing/calendar?${query}` : "/publishing/calendar"
    );
  },

  schedulePost: (payload: SchedulePostRequest) =>
    apiRequest<Post>("POST", "/publishing/schedule", payload),

  cancelSchedule: (postId: string) =>
    apiRequest<Post>("POST", `/publishing/posts/${postId}/cancel-schedule`),

  retryPublish: (postId: string) =>
    apiRequest<Post>("POST", `/publishing/posts/${postId}/retry`),

  publishNow: (postId: string) =>
    apiRequest<Post>("POST", `/publishing/posts/${postId}/publish-now`),
};
