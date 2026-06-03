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

// Daily Tips Types
export interface DailyTip {
  id: string;
  userId: string;
  tipDate: string;
  category: string;
  title: string;
  content: string;
  exampleBefore?: string;
  exampleAfter?: string;
  basedOnAnalyticsIds?: string[];
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDailyTipPayload {
  tipDate: string;
  category: string;
  title: string;
  content: string;
  exampleBefore?: string;
  exampleAfter?: string;
  basedOnAnalyticsIds?: string[];
}

export interface UpdateDailyTipPayload {
  isRead?: boolean;
  category?: string;
  title?: string;
  content?: string;
  exampleBefore?: string;
  exampleAfter?: string;
}

export interface QueryDailyTipsParams {
  limit?: number;
  offset?: number;
  isRead?: boolean;
  category?: string;
}

export type DailyTipsListResponse = ListResponse<DailyTip>;

// Achievements Types
export interface Achievement {
  id: string;
  key: string;
  name: string;
  description: string;
  iconEmoji?: string;
  badgeColor?: string;
  pointsReward: number;
  requirementType: string;
  requirementValue: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserAchievementStatus {
  achievement: Achievement;
  progress: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface UserAchievementsStats {
  totalPoints: number;
  level: number;
  achievementsUnlocked: number;
  achievementsTotal: number;
  nextMilestone?: {
    name: string;
    pointsNeeded: number;
  };
}

export type AchievementsListResponse = ListResponse<Achievement>;
export type UserAchievementsStatusListResponse =
  ListResponse<UserAchievementStatus>;

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

// Feedback Categories Types
export interface FeedbackCategory {
  id: string;
  key: string;
  name: string;
  description: string;
  iconEmoji?: string;
  learningResources?: {
    tips?: string[];
    exercises?: Array<{
      title: string;
      description: string;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeedbackCategoryPayload {
  key: string;
  name: string;
  description: string;
  iconEmoji?: string;
  learningResources?: {
    tips?: string[];
    exercises?: Array<{
      title: string;
      description: string;
    }>;
  };
}

export interface UpdateFeedbackCategoryPayload {
  name?: string;
  description?: string;
  iconEmoji?: string;
  learningResources?: {
    tips?: string[];
    exercises?: Array<{
      title: string;
      description: string;
    }>;
  };
}

export type FeedbackCategoriesListResponse = ListResponse<FeedbackCategory>;

// API Error Response
export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}
