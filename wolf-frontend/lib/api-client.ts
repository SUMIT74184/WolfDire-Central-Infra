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
};

// ── Post Service helpers ──────────────────────────────────────────────────────

export const postApi = {
  list: (page = 0, size = 20) =>
    apiClient.get(`/api/posts?page=${page}&size=${size}`),

  getById: (id: string) => apiClient.get(`/api/posts/${id}`),

  create: (data: unknown) => apiClient.post("/api/posts", data),

  update: (id: string, data: unknown) => apiClient.put(`/api/posts/${id}`, data),

  delete: (id: string) => apiClient.delete(`/api/posts/${id}`),
};

// ── Feed Service helpers ──────────────────────────────────────────────────────

export const feedApi = {
  getFeed: (page = 0, size = 20) =>
    apiClient.get(`/api/feed?page=${page}&size=${size}`),
};

// ── Social Connection Service helpers ─────────────────────────────────────────

export const socialApi = {
  follow: (userId: string) => apiClient.post(`/api/social/follow/${userId}`),
  unfollow: (userId: string) => apiClient.delete(`/api/social/unfollow/${userId}`),
  followers: (userId: string) => apiClient.get(`/api/social/followers/${userId}`),
  following: (userId: string) => apiClient.get(`/api/social/following/${userId}`),
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
  list: () => apiClient.get("/api/notifications"),
  markRead: (id: string) => apiClient.patch(`/api/notifications/${id}/read`),
};
