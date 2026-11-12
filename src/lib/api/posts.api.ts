import {
  CreatePostRequest,
  Post,
  PostFilterParams,
  PostStatus,
  UpdatePostRequest,
} from "@/types/domain";
import { apiRequest } from "./client";

export const postsApi = {
  getPosts: (params?: PostFilterParams) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("search", params.search);
    if (params?.status && params.status !== "ALL")
      searchParams.append("status", params.status);
    if (params?.platform && params.platform !== "ALL")
      searchParams.append("platform", params.platform);
    if (params?.campaignId && params.campaignId !== "ALL")
      searchParams.append("campaignId", params.campaignId);

    const query = searchParams.toString();
    const endpoint = query ? `/posts?${query}` : "/posts";
    return apiRequest<Post[]>("GET", endpoint);
  },

  getPostById: (id: string) =>
    apiRequest<Post>("GET", `/posts/${id}`),

  createPost: (payload: CreatePostRequest) =>
    apiRequest<Post>("POST", "/posts", payload),

  updatePost: (id: string, payload: UpdatePostRequest) =>
    apiRequest<Post>("PUT", `/posts/${id}`, payload),

  approvePost: (id: string) =>
    apiRequest<Post>("POST", `/posts/${id}/approve`),

  rejectPost: (id: string, reason: string) =>
    apiRequest<Post>("POST", `/posts/${id}/reject`, { reason }),

  revertVersion: (id: string, versionNumber: number) =>
    apiRequest<Post>("POST", `/posts/${id}/revert`, { versionNumber }),

  deletePost: (id: string) =>
    apiRequest<Post>("DELETE", `/posts/${id}`),
};
