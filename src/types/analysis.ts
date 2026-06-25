import type { ListResponse } from "./common";
import type { Writing, WritingType } from "./writing";

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
