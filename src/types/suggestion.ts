import type { ListResponse } from "./common";

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
