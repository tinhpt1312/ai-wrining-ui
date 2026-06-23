export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
} as const;

export const API_PATHS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
  },
  USERS: {
    ME: "/users/me",
    UPDATE_ME: "/users/me",
    CHANGE_PASSWORD: "/users/me/password",
    profile: (username: string) => `/users/${username}/profile`,
    writings: (username: string) => `/users/${username}/writings`,
  },
  WRITINGS: {
    ROOT: "/writings",
    PUBLIC: "/writings/public",
    BY_ID: (id: string) => `/writings/${id}`,
    STATS: "/writings/stats/overview",
  },
  ANALYTICS: {
    ROOT: "/analytics",
    AI: "/analytics/ai",
    BY_ID: (id: string) => `/analytics/${id}`,
    BY_WRITING: (writingId: string) => `/analytics/writing/${writingId}`,
    STATS: "/analytics/stats/overview",
    TOKEN_USAGE: "/analytics/tokens/usage",
    TOKEN_STATS: "/analytics/tokens/stats",
  },
  SHARE: {
    WRITING: (id: string) => `/share/writings/${id}`,
    ANALYSIS: (id: string) => `/share/analysis/${id}`,
  },
  SUGGESTIONS: {
    ROOT: "/writing-suggestions",
    BY_ID: (id: string) => `/writing-suggestions/${id}`,
    BY_WRITING: (writingId: string) =>
      `/writing-suggestions/writing/${writingId}`,
    STATS: (writingId: string) =>
      `/writing-suggestions/writing/${writingId}/stats`,
    REFACTORED: (writingId: string) =>
      `/writing-suggestions/writing/${writingId}/refactored`,
    GENERATE: "/writing-suggestions/generate",
    APPLY: (suggestionId: string) =>
      `/writing-suggestions/${suggestionId}/apply`,
  },
} as const;
