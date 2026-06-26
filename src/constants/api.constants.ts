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
    EXPORT_DOCX: (id: string) => `/writings/${id}/export/docx`,
    EXPORT_PDF: (id: string) => `/writings/${id}/export/pdf`,
    BY_ID: (id: string) => `/writings/${id}`,
    REVISIONS: (id: string) => `/writings/${id}/revisions`,
    REVISION_TIMELINE: (id: string) => `/writings/${id}/revisions/timeline`,
    REVISION_BASELINE: (id: string) => `/writings/${id}/revisions/baseline`,
    REVISION_BY_ID: (writingId: string, revisionId: string) =>
      `/writings/${writingId}/revisions/${revisionId}`,
    RESTORE_REVISION: (writingId: string, revisionId: string) =>
      `/writings/${writingId}/revisions/${revisionId}/restore`,
    STATS: "/writings/stats/overview",
    OUTLINE: "/writings/outline",
    PROMPTS_GENERATE: "/writings/prompts/generate",
  },
  DOCUMENTS: {
    PARSE: "/documents/parse",
  },
  ANALYTICS: {
    ROOT: "/analytics",
    AI: "/analytics/ai",
    BY_ID: (id: string) => `/analytics/${id}`,
    BY_WRITING: (writingId: string) => `/analytics/writing/${writingId}`,
    STATS: "/analytics/stats/overview",
    PROGRESS: "/analytics/progress",
    TOKEN_USAGE: "/analytics/tokens/usage",
    TOKEN_STATS: "/analytics/tokens/stats",
    EXPORT_DOCX: (id: string) => `/analytics/${id}/export/docx`,
    EXPORT_PDF: (id: string) => `/analytics/${id}/export/pdf`,
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
    GENERATE_FROM_ANALYSIS: "/writing-suggestions/generate-from-analysis",
    APPLY: (suggestionId: string) =>
      `/writing-suggestions/${suggestionId}/apply`,
  },
} as const;
