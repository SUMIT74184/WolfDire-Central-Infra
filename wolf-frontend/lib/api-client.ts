/**
 * WolfDire API Client
 *
 * Typed fetch wrapper that:
 * - Reads NEXT_PUBLIC_API_URL (points to the API Gateway)
 * - Auto-attaches the JWT Bearer token from localStorage
 * - Handles JSON serialization / deserialization
 * - Throws ApiError with status + message for easy error handling
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8090";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function getAuthHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...getAuthHeader(),
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      message = body?.message ?? body?.error ?? message;
    } catch {
      // ignore parse errors
    }
    throw new ApiError(res.status, message);
  }

  // 204 No Content — return empty object
  if (res.status === 204) return {} as T;

  return res.json() as Promise<T>;
}

// ── Convenience methods ───────────────────────────────────────────────────────

export const apiClient = {
  get: <T>(path: string, opts?: RequestInit) =>
    request<T>(path, { method: "GET", ...opts }),

  post: <T>(path: string, body?: unknown, opts?: RequestInit) =>
    request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
      ...opts,
    }),

  put: <T>(path: string, body?: unknown, opts?: RequestInit) =>
    request<T>(path, {
      method: "PUT",
      body: JSON.stringify(body),
      ...opts,
    }),

  patch: <T>(path: string, body?: unknown, opts?: RequestInit) =>
    request<T>(path, {
      method: "PATCH",
      body: JSON.stringify(body),
      ...opts,
    }),

  delete: <T>(path: string, opts?: RequestInit) =>
    request<T>(path, { method: "DELETE", ...opts }),
};

// ── Auth Service helpers ──────────────────────────────────────────────────────

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>("/api/auth/login", data),

  register: (data: RegisterRequest) =>
    apiClient.post<AuthResponse>("/api/auth/register", data),

  logout: () => apiClient.post("/api/auth/logout"),

  refresh: (refreshToken: string) =>
    apiClient.post<AuthResponse>("/api/auth/refresh", { refreshToken }),

  me: () => apiClient.get<Record<string, unknown>>("/api/auth/me"),

  validate: () => apiClient.get("/api/auth/validate"),

  forgotPassword: (data: ForgotPasswordRequest) =>
    apiClient.post<{ message: string }>("/api/auth/forgot-password", data),

  resetPassword: (data: ResetPasswordRequest) =>
    apiClient.post<{ message: string }>("/api/auth/reset-password", data),

  updateProfile: (data: unknown) =>
    apiClient.put<Record<string, unknown>>("/api/auth/me", data),

  verifyEmail: (token: string) =>
    apiClient.post<{ message: string }>(`/api/auth/verify-email?token=${encodeURIComponent(token)}`),

  deactivateAccount: () => apiClient.post("/api/auth/deactivate"),
};

// ── Post Service helpers ──────────────────────────────────────────────────────

export const postApi = {
  list: (page = 0, size = 20) =>
    apiClient.get(`/api/posts?page=${page}&size=${size}`),

  getById: (id: string) => apiClient.get(`/api/posts/${id}`),

  create: (data: unknown) => apiClient.post("/api/posts", data),

  update: (id: string, data: unknown) => apiClient.put(`/api/posts/${id}`, data),

  delete: (id: string) => apiClient.delete(`/api/posts/${id}`),

  getCommunityPosts: (communityId: string, page = 0, size = 20) =>
    apiClient.get(`/api/posts/community/${communityId}?page=${page}&size=${size}`),

  getUserPosts: (userId: string, page = 0, size = 20) =>
    apiClient.get(`/api/posts/user/${userId}?page=${page}&size=${size}`),

  savePost: (postId: string) => apiClient.post(`/api/posts/${postId}/save`),
  
  unsavePost: (postId: string) => apiClient.delete(`/api/posts/${postId}/save`),
  
  getSavedPosts: (page = 0, size = 20) => apiClient.get(`/api/posts/saved?page=${page}&size=${size}`),

  search: (query: string, page = 0, size = 20) =>
    apiClient.get(`/api/posts/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`),

  trending: (page = 0, size = 20) =>
    apiClient.get(`/api/posts/trending?page=${page}&size=${size}`),

  hot: (communityId: string, page = 0, size = 20) =>
    apiClient.get(`/api/posts/community/${communityId}/hot?page=${page}&size=${size}`),
};

// ── Comment Service helpers ───────────────────────────────────────────────────

export const commentApi = {
  getPostComments: (postId: string, page = 0, size = 50) =>
    apiClient.get(`/api/comments/post/${postId}?page=${page}&size=${size}`),

  create: (data: unknown) => apiClient.post("/api/comments", data),

  getReplies: (commentId: string) =>
    apiClient.get(`/api/comments/${commentId}/replies`),

  update: (commentId: string, content: string) =>
    apiClient.put(`/api/comments/${commentId}?content=${encodeURIComponent(content)}`),

  delete: (commentId: string) => apiClient.delete(`/api/comments/${commentId}`),

  upvote: (commentId: string) => apiClient.post(`/api/comments/${commentId}/upvote`),

  downvote: (commentId: string) => apiClient.post(`/api/comments/${commentId}/downvote`),
};

// ── Feed Service helpers ──────────────────────────────────────────────────────

export const feedApi = {
  getFeed: (page = 0, size = 20) =>
    apiClient.get(`/api/feed?page=${page}&size=${size}`),

  getPersonalizedFeed: (page = 0, size = 20) =>
    apiClient.get(`/api/feed/personalized?page=${page}&size=${size}`),

  trackInteraction: (postId: string, type: 'VIEW' | 'UPVOTE' | 'COMMENT' | 'SHARE', durationSeconds?: number) =>
    apiClient.post(`/api/feed/interact?postId=${postId}&type=${type}${durationSeconds ? `&durationSeconds=${durationSeconds}` : ''}`),
};

// ── Social Connection Service helpers ─────────────────────────────────────────

export const socialApi = {
  follow: (userId: string) => apiClient.post(`/api/social/follow/${userId}`),
  unfollow: (userId: string) => apiClient.delete(`/api/social/unfollow/${userId}`),
  followers: () => apiClient.get(`/api/social/followers`),
  following: () => apiClient.get(`/api/social/following`),
  
  getBlockedUsers: () => apiClient.get('/api/social/blocked'),
  unblockUser: (blockedId: string) => apiClient.delete(`/api/social/block/${blockedId}`),
};

// ── Analytics Service helpers ─────────────────────────────────────────────────

export const analyticsApi = {
  dashboard: () => apiClient.get("/api/analytics/dashboard"),
  trending: () => apiClient.get("/api/analytics/trending"),
  user: (userId: string, startDate: string, endDate: string) =>
    apiClient.get(`/api/analytics/user/${userId}?startDate=${startDate}&endDate=${endDate}`),
};

// ── Notification Service helpers ──────────────────────────────────────────────

export const notificationApi = {
  listByUser: (userId: string, page = 0, size = 20, unreadOnly = false) => 
    apiClient.get(`/api/notifications/user/${userId}?page=${page}&size=${size}${unreadOnly ? '&unreadOnly=true' : ''}`),
    
  getUnreadCount: (userId: string) => 
    apiClient.get(`/api/notifications/user/${userId}/unread-count`),
    
  markRead: (userId: string, notificationIds: number[]) => 
    apiClient.post(`/api/notifications/mark-read`, { userId, notificationIds }),
    
  markAllRead: (userId: string) => 
    apiClient.post(`/api/notifications/user/${userId}/mark-all-read`),

  getPreferences: (userId: string) => apiClient.get(`/api/notifications/preferences/${userId}`),
  updatePreferences: (userId: string, data: any) => apiClient.put(`/api/notifications/preferences/${userId}`, data),
};

// ── Moderation Service helpers ────────────────────────────────────────────────

export const moderationApi = {
  getFlaggedQueue: (page = 0, size = 20) =>
    apiClient.get(`/api/moderation/flagged?page=${page}&size=${size}`),

  getContentDetail: (id: string) =>
    apiClient.get(`/api/moderation/content/${id}`),

  approveContent: (id: string) =>
    apiClient.post(`/api/moderation/content/${id}/approve`),

  rejectContent: (id: string) =>
    apiClient.post(`/api/moderation/content/${id}/reject`),
};

// ── Admin Auth helpers ────────────────────────────────────────────────────────

export const authAdminApi = {
  listUsers: (page = 0, size = 20) =>
    apiClient.get(`/api/auth/users?page=${page}&size=${size}`),

  banUser: (userId: string) =>
    apiClient.post(`/api/auth/users/${userId}/ban`),

  unbanUser: (userId: string) =>
    apiClient.post(`/api/auth/users/${userId}/unban`),
};

// ── Community Service helpers ─────────────────────────────────────────────────

export const communityApi = {
  list: (page = 0, size = 20) =>
    apiClient.get(`/api/communities?page=${page}&size=${size}`),

  getAll: (page = 0, size = 50) =>
    apiClient.get(`/api/communities?page=${page}&size=${size}`),

  getById: (id: string) =>
    apiClient.get(`/api/communities/${id}`),

  getBySlug: (slug: string) =>
    apiClient.get(`/api/communities/slug/${slug}`),

  create: (data: unknown) =>
    apiClient.post("/api/communities", data),
    
  follow: (communityId: string) =>
    apiClient.post(`/api/communities/follow`, { communityId }),

  unfollow: (communityId: string) =>
    apiClient.delete(`/api/communities/follow/${communityId}`),

  myCommunities: (page = 0, size = 50) =>
    apiClient.get(`/api/communities/my-communities?page=${page}&size=${size}`),
};
