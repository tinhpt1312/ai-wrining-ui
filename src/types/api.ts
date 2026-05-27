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
  JOURNAL = "journal",
  SOCIAL_ESSAY = "social_essay",
  BLOG_POST = "blog_post",
  SHORT_STORY = "short_story",
  ARTICLE = "article",
}

export enum WritingStatus {
  DRAFT = "draft",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  ARCHIVED = "archived",
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

export interface WritingsListResponse {
  data: Writing[];
  total: number;
  limit: number;
  offset: number;
}

export interface WritingStats {
  totalWritings: number;
  totalWords: number;
  averageLength: number;
  byType: Record<WritingType, number>;
  byStatus: Record<WritingStatus, number>;
}

export interface Analysis {
  id: string;
  writingId: string;
  userId: string;
  feedbackJson?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnalysisPayload {
  writingId: string;
  feedbackJson?: Record<string, any>;
}

export interface UpdateAnalysisPayload {
  feedbackJson?: Record<string, any>;
}

export interface CreateAiAnalysisPayload {
  writingId: string;
  triggerAi?: boolean;
  writingType?: WritingType;
  feedbackJson?: Record<string, any>;
}

export interface QueryAnalysisParams {
  limit?: number;
  offset?: number;
  writingId?: string;
}

export interface AnalysesListResponse {
  data: Analysis[];
  total: number;
  limit: number;
  offset: number;
}

export interface AnalysisStats {
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
