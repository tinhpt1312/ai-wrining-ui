"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationResult,
  UseQueryResult,
} from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import * as types from "@/types/api";
import { useCallback } from "react";

// Simple API wrapper for feature endpoints
export function useApi() {
  const getToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  }, []);

  const request = useCallback(
    async (
      method: "GET" | "POST" | "PATCH" | "DELETE",
      url: string,
      data?: unknown,
    ) => {
      const configuredBaseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      const baseUrl = configuredBaseUrl.replace(/\/$/, "");
      const requestUrl =
        baseUrl.endsWith("/api") && url.startsWith("/api/")
          ? `${baseUrl}${url.slice(4)}`
          : `${baseUrl}${url}`;
      const token = getToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(requestUrl, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      return response.json();
    },
    [getToken],
  );

  return {
    get: (url: string) => request("GET", url),
    post: (url: string, data: unknown) => request("POST", url, data),
    patch: (url: string, data: unknown) => request("PATCH", url, data),
    delete: (url: string) => request("DELETE", url),
  };
}

// ============ AUTH HOOKS ============

export function useRegister(): UseMutationResult<
  types.AuthResponse,
  Error,
  types.RegisterPayload
> {
  return useMutation({
    mutationFn: (payload) => apiClient.register(payload),
  });
}

export function useLogin(): UseMutationResult<
  types.AuthResponse,
  Error,
  types.LoginPayload
> {
  return useMutation({
    mutationFn: (payload) => apiClient.login(payload),
  });
}

export function useLogout(): UseMutationResult<void, Error, void> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

// ============ USERS HOOKS ============

export function useUser(): UseQueryResult<types.User, Error> {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: () => apiClient.getMe(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
}

// ============ WRITINGS HOOKS ============

export function useCreateWriting(): UseMutationResult<
  types.Writing,
  Error,
  types.CreateWritingPayload
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => apiClient.createWriting(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["writings"] });
    },
  });
}

export function useWritings(
  params?: types.QueryWritingParams,
): UseQueryResult<types.WritingsListResponse, Error> {
  return useQuery({
    queryKey: ["writings", params],
    queryFn: () => apiClient.getWritings(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useWriting(id: string): UseQueryResult<types.Writing, Error> {
  return useQuery({
    queryKey: ["writings", id],
    queryFn: () => apiClient.getWriting(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!id,
  });
}

export function useUpdateWriting(): UseMutationResult<
  types.Writing,
  Error,
  { id: string; payload: types.UpdateWritingPayload }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => apiClient.updateWriting(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["writings"] });
      queryClient.setQueryData(["writings", data.id], data);
    },
  });
}

export function useDeleteWriting(): UseMutationResult<
  { message: string },
  Error,
  string
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiClient.deleteWriting(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["writings"] });
    },
  });
}

export function useWritingStats(): UseQueryResult<types.WritingStats, Error> {
  return useQuery({
    queryKey: ["writings", "stats"],
    queryFn: () => apiClient.getWritingStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// ============ ANALYSIS HOOKS ============

export function useCreateAnalytics(): UseMutationResult<
  types.Analytics,
  Error,
  types.CreateAnalyticsPayload
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => apiClient.createAnalytics(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["analyses"] });
      queryClient.invalidateQueries({
        queryKey: ["analyses", "writing", data.writingId],
      });
    },
  });
}

export function useCreateAiAnalytics(): UseMutationResult<
  types.Analytics,
  Error,
  types.CreateAiAnalyticsPayload
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => apiClient.createAiAnalytics(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["analyses"] });
      queryClient.invalidateQueries({
        queryKey: ["analyses", "writing", data.writingId],
      });
    },
  });
}

export function useAnalyses(
  params?: types.QueryAnalyticsParams,
): UseQueryResult<types.AnalysesListResponse, Error> {
  return useQuery({
    queryKey: ["analyses", params],
    queryFn: () => apiClient.getAnalyses(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useAnalytics(
  id: string,
): UseQueryResult<types.Analytics, Error> {
  return useQuery({
    queryKey: ["analyses", id],
    queryFn: () => apiClient.getAnalytics(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!id,
  });
}

export function useAnalysesByWriting(
  writingId: string,
): UseQueryResult<types.AnalysesListResponse, Error> {
  return useQuery({
    queryKey: ["analyses", "writing", writingId],
    queryFn: () => apiClient.getAnalysesByWriting(writingId),
    staleTime: 1000 * 60 * 2, // 2 minutes
    enabled: !!writingId,
  });
}

export function useUpdateAnalytics(): UseMutationResult<
  types.Analytics,
  Error,
  { id: string; payload: types.UpdateAnalyticsPayload }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => apiClient.updateAnalytics(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["analyses"] });
      queryClient.setQueryData(["analyses", data.id], data);
    },
  });
}

export function useDeleteAnalytics(): UseMutationResult<
  { message: string },
  Error,
  string
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiClient.deleteAnalytics(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analyses"] });
    },
  });
}

export function useAnalyticsStats(): UseQueryResult<
  types.AnalyticsStats,
  Error
> {
  return useQuery({
    queryKey: ["analyses", "stats"],
    queryFn: () => apiClient.getAnalyticsStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useTokenUsage(): UseQueryResult<types.TokenUsage, Error> {
  return useQuery({
    queryKey: ["tokens", "usage"],
    queryFn: () => apiClient.getTokenUsage(),
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
  });
}

export function useTokenStats(): UseQueryResult<types.TokenStats, Error> {
  return useQuery({
    queryKey: ["tokens", "stats"],
    queryFn: () => apiClient.getTokenStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// ============ DAILY TIPS HOOKS ============

export function useCreateDailyTip(): UseMutationResult<
  types.DailyTip,
  Error,
  types.CreateDailyTipPayload
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => apiClient.createDailyTip(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-tips"] });
    },
  });
}

export function useDailyTips(
  params?: types.QueryDailyTipsParams,
): UseQueryResult<types.DailyTipsListResponse, Error> {
  return useQuery({
    queryKey: ["daily-tips", params],
    queryFn: () => apiClient.getDailyTips(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useDailyTip(id: string): UseQueryResult<types.DailyTip, Error> {
  return useQuery({
    queryKey: ["daily-tips", id],
    queryFn: () => apiClient.getDailyTip(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!id,
  });
}

export function useUpdateDailyTip(): UseMutationResult<
  types.DailyTip,
  Error,
  { id: string; payload: types.UpdateDailyTipPayload }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => apiClient.updateDailyTip(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["daily-tips"] });
      queryClient.setQueryData(["daily-tips", data.id], data);
    },
  });
}

export function useDeleteDailyTip(): UseMutationResult<
  { message: string },
  Error,
  string
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiClient.deleteDailyTip(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-tips"] });
    },
  });
}

export function useTodayTip(): UseQueryResult<types.DailyTip, Error> {
  return useQuery({
    queryKey: ["daily-tips", "today"],
    queryFn: () => apiClient.getTodayTip(),
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 1,
  });
}

export function useUnreadTipsCount(): UseQueryResult<{ count: number }, Error> {
  return useQuery({
    queryKey: ["daily-tips", "unread", "count"],
    queryFn: () => apiClient.getUnreadTipsCount(),
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
  });
}

export function useGenerateDailyTip(): UseMutationResult<
  types.DailyTip,
  Error,
  void
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.generateDailyTip(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-tips"] });
      queryClient.invalidateQueries({ queryKey: ["daily-tips", "today"] });
    },
  });
}

// ============ ACHIEVEMENTS HOOKS ============

export function useAchievements(params?: {
  limit?: number;
  offset?: number;
}): UseQueryResult<types.AchievementsListResponse, Error> {
  return useQuery({
    queryKey: ["achievements", params],
    queryFn: () => apiClient.getAchievements(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useAchievement(
  id: string,
): UseQueryResult<types.Achievement, Error> {
  return useQuery({
    queryKey: ["achievements", id],
    queryFn: () => apiClient.getAchievement(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!id,
  });
}

export function useUserAchievements(): UseQueryResult<
  types.UserAchievementsStatusListResponse,
  Error
> {
  return useQuery({
    queryKey: ["achievements", "my"],
    queryFn: () => apiClient.getUserAchievements(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useUserAchievementsStats(): UseQueryResult<
  types.UserAchievementsStats,
  Error
> {
  return useQuery({
    queryKey: ["achievements", "stats", "my"],
    queryFn: () => apiClient.getUserAchievementsStats(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// ============ WRITING SUGGESTIONS HOOKS ============

export function useCreateWritingSuggestion(): UseMutationResult<
  types.WritingSuggestion,
  Error,
  types.CreateWritingSuggestionPayload
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => apiClient.createWritingSuggestion(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["writing-suggestions"] });
      queryClient.invalidateQueries({
        queryKey: ["writing-suggestions", "writing", data.writingId],
      });
    },
  });
}

export function useWritingSuggestions(
  params?: types.QueryWritingSuggestionsParams,
): UseQueryResult<types.WritingSuggestionsListResponse, Error> {
  return useQuery({
    queryKey: ["writing-suggestions", params],
    queryFn: () => apiClient.getWritingSuggestions(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useWritingSuggestion(
  id: string,
): UseQueryResult<types.WritingSuggestion, Error> {
  return useQuery({
    queryKey: ["writing-suggestions", id],
    queryFn: () => apiClient.getWritingSuggestion(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!id,
  });
}

export function useUpdateWritingSuggestion(): UseMutationResult<
  types.WritingSuggestion,
  Error,
  { id: string; payload: types.UpdateWritingSuggestionPayload }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) =>
      apiClient.updateWritingSuggestion(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["writing-suggestions"] });
      queryClient.setQueryData(["writing-suggestions", data.id], data);
    },
  });
}

export function useDeleteWritingSuggestion(): UseMutationResult<
  { message: string },
  Error,
  string
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiClient.deleteWritingSuggestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["writing-suggestions"] });
    },
  });
}

export function useSuggestionsByWriting(
  writingId: string,
): UseQueryResult<types.WritingSuggestionsListResponse, Error> {
  return useQuery({
    queryKey: ["writing-suggestions", "writing", writingId],
    queryFn: () => apiClient.getSuggestionsByWriting(writingId),
    staleTime: 1000 * 60 * 2, // 2 minutes
    enabled: !!writingId,
  });
}

export function useSuggestionStats(
  writingId: string,
): UseQueryResult<types.WritingSuggestionStats, Error> {
  return useQuery({
    queryKey: ["writing-suggestions", "writing", writingId, "stats"],
    queryFn: () => apiClient.getSuggestionStats(writingId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!writingId,
  });
}

export function useRefactoredWriting(
  writingId: string,
  enabled = true,
): UseQueryResult<types.RefactoredWriting, Error> {
  return useQuery({
    queryKey: ["writing-suggestions", "writing", writingId, "refactored"],
    queryFn: () => apiClient.getRefactoredWriting(writingId),
    staleTime: 1000 * 60 * 2, // 2 minutes
    enabled: !!writingId && enabled,
  });
}

export function useGenerateSuggestions(): UseMutationResult<
  types.WritingSuggestionsListResponse,
  Error,
  { writingId: string; focusAreas?: string[] }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ writingId, focusAreas }) =>
      apiClient.generateSuggestions(writingId, focusAreas),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["writing-suggestions"] });
      queryClient.invalidateQueries({
        queryKey: ["writing-suggestions", "writing", variables.writingId],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "writing-suggestions",
          "writing",
          variables.writingId,
          "stats",
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "writing-suggestions",
          "writing",
          variables.writingId,
          "refactored",
        ],
      });
    },
  });
}

export function useApplySuggestion(): UseMutationResult<
  types.WritingSuggestion,
  Error,
  { suggestionId: string; writingId: string; updateWriting?: boolean }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ suggestionId, writingId, updateWriting }) =>
      apiClient.applySuggestion(suggestionId, writingId, updateWriting),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["writing-suggestions"] });
      queryClient.invalidateQueries({
        queryKey: ["writing-suggestions", "writing", variables.writingId],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "writing-suggestions",
          "writing",
          variables.writingId,
          "stats",
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "writing-suggestions",
          "writing",
          variables.writingId,
          "refactored",
        ],
      });
      if (variables.updateWriting) {
        queryClient.invalidateQueries({ queryKey: ["writings"] });
        queryClient.invalidateQueries({
          queryKey: ["writings", variables.writingId],
        });
      }
    },
  });
}

// ============ FEEDBACK CATEGORIES HOOKS ============

export function useFeedbackCategories(params?: {
  limit?: number;
  offset?: number;
}): UseQueryResult<types.FeedbackCategoriesListResponse, Error> {
  return useQuery({
    queryKey: ["feedback-categories", params],
    queryFn: () => apiClient.getFeedbackCategories(params),
    staleTime: 1000 * 60 * 10, // 10 minutes (categories rarely change)
  });
}

export function useFeedbackCategory(
  id: string,
): UseQueryResult<types.FeedbackCategory, Error> {
  return useQuery({
    queryKey: ["feedback-categories", id],
    queryFn: () => apiClient.getFeedbackCategory(id),
    staleTime: 1000 * 60 * 10, // 10 minutes
    enabled: !!id,
  });
}

export function useCreateFeedbackCategory(): UseMutationResult<
  types.FeedbackCategory,
  Error,
  types.CreateFeedbackCategoryPayload
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => apiClient.createFeedbackCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedback-categories"] });
    },
  });
}

export function useUpdateFeedbackCategory(): UseMutationResult<
  types.FeedbackCategory,
  Error,
  { id: string; payload: types.UpdateFeedbackCategoryPayload }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) =>
      apiClient.updateFeedbackCategory(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["feedback-categories"] });
      queryClient.setQueryData(["feedback-categories", data.id], data);
    },
  });
}

export function useDeleteFeedbackCategory(): UseMutationResult<
  { message: string },
  Error,
  string
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiClient.deleteFeedbackCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedback-categories"] });
    },
  });
}
