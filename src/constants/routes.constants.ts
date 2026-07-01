export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  WRITINGS: "/writings",
  WRITING_NEW: "/writings/new",
  writing: (id: string) => `/writings/${id}`,
  writingEdit: (id: string) => `/writings/${id}/edit`,
  /** @deprecated Redirects to revise — kept for backward-compatible links. */
  writingSuggestions: (id: string) => `/writings/${id}/revise`,
  writingRevise: (id: string, analysisId?: string) =>
    analysisId
      ? `/writings/${id}/revise?analysisId=${analysisId}`
      : `/writings/${id}/revise`,
  writingJourney: (id: string) => `/writings/${id}/journey`,
  BOOKS: "/books",
  BOOKS_UPLOAD: "/books/upload",
  book: (id: string) => `/books/${id}`,
  bookRead: (id: string, chapterId?: string) =>
    chapterId ? `/books/${id}/read?chapter=${chapterId}` : `/books/${id}/read`,
  ADMIN_BOOKS: "/admin/books",
  EXPLORE: "/explore",
  PROFILE: "/profile",
  userProfile: (username: string) => `/users/${username}`,
  ANALYSIS: "/analysis",
  analysis: (id: string) => `/analysis/${id}`,
  shareWriting: (id: string) => `/share/writings/${id}`,
  shareAnalysis: (id: string) => `/share/analysis/${id}`,
} as const;
