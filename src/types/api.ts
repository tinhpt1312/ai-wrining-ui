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
export interface User {
  id: string;
  username: string;
  email?: string;
  fullName?: string;
  isActive?: boolean;
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
  feedbackJson?: Record<string, any>;
  writing?: Writing;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnalyticsPayload {
  writingId: string;
  feedbackJson?: Record<string, any>;
}

export interface UpdateAnalyticsPayload {
  feedbackJson?: Record<string, any>;
}

export interface CreateAiAnalyticsPayload {
  writingId: string;
  triggerAi?: boolean;
  writingType?: WritingType;
  feedbackJson?: Record<string, any>;
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

// API Error Response
export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}
