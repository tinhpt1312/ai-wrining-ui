import type {
  QueryAnalyticsParams,
  QueryBookParams,
  QueryWritingParams,
  QueryWritingSuggestionsParams,
} from "@/types/api";

export const QUERY_KEYS = {
  user: {
    me: ["user", "me"] as const,
    profile: (username: string) => ["user", "profile", username] as const,
  },
  writings: {
    all: (params?: QueryWritingParams) => ["writings", params] as const,
    public: (params?: QueryWritingParams) => ["writings", "public", params] as const,
    byUser: (username: string, params?: QueryWritingParams) =>
      ["writings", "user", username, params] as const,
    detail: (id: string) => ["writings", id] as const,
    stats: ["writings", "stats"] as const,
  },
  analyses: {
    all: (params?: QueryAnalyticsParams) => ["analyses", params] as const,
    detail: (id: string) => ["analyses", id] as const,
    byWriting: (writingId: string) => ["analyses", "writing", writingId] as const,
    stats: ["analyses", "stats"] as const,
    progress: ["analyses", "progress"] as const,
  },
  tokens: {
    usage: ["tokens", "usage"] as const,
    stats: ["tokens", "stats"] as const,
  },
  revisions: {
    byWriting: (writingId: string) =>
      ["writings", writingId, "revisions"] as const,
    timeline: (writingId: string, analysisId?: string) =>
      ["writings", writingId, "revisions", "timeline", analysisId] as const,
  },
  books: {
    all: (params?: QueryBookParams) => ["books", params] as const,
    detail: (id: string) => ["books", id] as const,
    chapters: (bookId: string) => ["books", bookId, "chapters"] as const,
    chapter: (bookId: string, chapterId: string) =>
      ["books", bookId, "chapters", chapterId] as const,
    progress: (bookId: string) => ["books", bookId, "progress"] as const,
    myUploads: (params?: QueryBookParams) =>
      ["books", "my-uploads", params] as const,
    pending: (params?: QueryBookParams) =>
      ["books", "pending", params] as const,
    recommendations: (payload?: unknown) =>
      ["books", "recommendations", payload] as const,
  },
  suggestions: {
    all: (params?: QueryWritingSuggestionsParams) =>
      ["writing-suggestions", params] as const,
    detail: (id: string) => ["writing-suggestions", id] as const,
    byWriting: (writingId: string) =>
      ["writing-suggestions", "writing", writingId] as const,
    stats: (writingId: string) =>
      ["writing-suggestions", "writing", writingId, "stats"] as const,
    refactored: (writingId: string) =>
      ["writing-suggestions", "writing", writingId, "refactored"] as const,
  },
} as const;
