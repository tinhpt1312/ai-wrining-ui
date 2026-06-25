// Auth Types
export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface BackendAuthResponse {
  accessToken: string;
  user: User;
}

// User Types
export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  username: string;
  email?: string;
  fullName?: string;
  isActive?: boolean;
  role?: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface WritingAuthor {
  username: string;
  fullName?: string | null;
}

export interface UpdateProfilePayload {
  username?: string;
  email?: string;
  fullName?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface PublicUserProfile {
  username: string;
  fullName?: string | null;
  createdAt: string;
  publicWritingsCount: number;
}

// Writing Types
export enum WritingType {
  SOCIAL_ESSAY = "BÀI LUẬN XÃ HỘI",
  CATHOLIC_ESSAY = "BÀI LUẬN CÔNG GIÁO",
  SHORT_STORY = "TRUYỆN NGẮN",
  ARTICLE = "BÀI BÁO",
}

export enum WritingStatus {
  DRAFT = "draft",
  PUBLIC = "public",
}

export interface Writing {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: WritingType;
  status: WritingStatus;
  createdAt: string;
  updatedAt: string;
  author?: WritingAuthor;
}

export interface CreateWritingPayload {
  title: string;
  content: string;
  type: WritingType;
  status?: WritingStatus;
}

export interface UpdateWritingPayload {
  title?: string;
  content?: string;
  type?: WritingType;
  status?: WritingStatus;
}

export interface QueryWritingParams {
  limit?: number;
  offset?: number;
  type?: WritingType;
  status?: WritingStatus;
  search?: string;
}

export interface PaginationMeta {
  total: number;
  limit: number;
  offset: number;
  hasMore?: boolean;
}

export interface ListResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  pagination?: PaginationMeta;
}

export interface BackendListResponse<T> {
  data: T[];
  total?: number;
  limit?: number;
  offset?: number;
  pagination?: PaginationMeta;
}

export interface BackendDataResponse<T> {
  data: T;
}

export type WritingsListResponse = ListResponse<Writing>;

export interface WritingStats {
  totalWritings: number;
  totalWords: number;
  averageLength: number;
  byType: Record<WritingType, number>;
  byStatus: Record<WritingStatus, number>;
}

export interface Analytics {
  id: string;
  writingId: string;
  userId: string;
  feedbackJson?: Record<string, unknown>;
  writing?: Writing;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnalyticsPayload {
  writingId: string;
  feedbackJson?: Record<string, unknown>;
}

export interface UpdateAnalyticsPayload {
  feedbackJson?: Record<string, unknown>;
}

export interface CreateAiAnalyticsPayload {
  writingId: string;
  triggerAi?: boolean;
  writingType?: WritingType;
  feedbackJson?: Record<string, unknown>;
  previousAnalysisId?: string;
}

export interface CreateAiAnalyticsResponse {
  analysis: Analytics;
  tokensUsed: number;
  error?: unknown;
}

export interface QueryAnalyticsParams {
  limit?: number;
  offset?: number;
  writingId?: string;
}

export type AnalysesListResponse = ListResponse<Analytics>;

export interface AnalyticsStats {
  totalAnalyses: number;
  analysesWithFeedback: number;
  percentageWithFeedback: number;
}

// Structured AI grading feedback (matches backend WritingAnalyticsSchema)
export interface FeedbackCriterion {
  score: number;
  feedback: string;
  suggestions: string[];
}

export interface AnalysisFeedback {
  structure?: FeedbackCriterion;
  clarity?: FeedbackCriterion;
  tone?: FeedbackCriterion;
  coherence?: FeedbackCriterion;
  overallFeedback?: string;
  strengths?: string[];
  areasForImprovement?: string[];
  actionItems?: string[];
  sampleWriting?: string;
}

export interface TokenUsage {
  used: number;
  remaining: number;
  limit: number;
  percentage: number;
  resetAt: string;
}

export interface TokenStats {
  data: Array<{
    date: string;
    tokensUsed: number;
  }>;
}

// Writing Suggestions Types
export interface WritingSuggestion {
  id: string;
  writingId: string;
  type: string;
  originalText: string;
  suggestedText: string;
  explanation: string;
  confidenceScore: number;
  isApplied: boolean;
  severity: string;
  position?: {
    start: number;
    end: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateWritingSuggestionPayload {
  writingId: string;
  type: string;
  originalText: string;
  suggestedText: string;
  explanation: string;
  confidenceScore?: number;
  severity?: string;
  position?: {
    start: number;
    end: number;
  };
}

export interface UpdateWritingSuggestionPayload {
  isApplied?: boolean;
  type?: string;
  originalText?: string;
  suggestedText?: string;
  explanation?: string;
  confidenceScore?: number;
  severity?: string;
}

export interface QueryWritingSuggestionsParams {
  limit?: number;
  offset?: number;
  writingId?: string;
  type?: string;
  isApplied?: boolean;
}

export interface WritingSuggestionStats {
  totalSuggestions: number;
  bySeverity: Record<string, number>;
  byType: Record<string, number>;
  appliedCount: number;
  appliedPercentage: number;
}

export interface BackendWritingSuggestionStats {
  total: number;
  applied: number;
  byType: Array<{ type: string; count: number }>;
  bySeverity: Array<{ severity: string; count: number }>;
}

export interface RefactoredWriting {
  original: string;
  refactored: string;
}

export type WritingSuggestionsListResponse = ListResponse<WritingSuggestion>;

export type WritingRevisionSource =
  | "manual"
  | "suggestions"
  | "sample"
  | "revision_workspace"
  | "grading_baseline";

export interface WritingRevision {
  id: string;
  writingId: string;
  userId: string;
  content: string;
  source: WritingRevisionSource;
  analysisId?: string | null;
  parentRevisionId?: string | null;
  revisionNumber: number;
  createdAt: string;
}

export interface CreateWritingRevisionPayload {
  content: string;
  source?: WritingRevisionSource;
  analysisId?: string;
  parentRevisionId?: string;
}

export interface EnsureBaselineRevisionPayload {
  analysisId: string;
  content: string;
}

export interface RevisionTimelineItem extends WritingRevision {
  wordCount: number;
  wordCountDelta: number;
}

export type WritingRevisionsListResponse = ListResponse<WritingRevision>;
export type RevisionTimelineResponse = ListResponse<RevisionTimelineItem>;

// API Error Response
export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}
