"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationResult,
  UseQueryResult,
} from "@tanstack/react-query";
import { analyticsService } from "@/api";
import { CACHE_TIME, QUERY_KEYS } from "@/constants";
import * as types from "@/types/api";

function invalidateAnalysisQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  writingId?: string,
) {
  queryClient.invalidateQueries({ queryKey: ["analyses"] });
  if (writingId) {
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.analyses.byWriting(writingId),
    });
  }
}

export function useCreateAnalytics(): UseMutationResult<
  types.Analytics,
  Error,
  types.CreateAnalyticsPayload
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => analyticsService.create(payload),
    onSuccess: (data) => {
      invalidateAnalysisQueries(queryClient, data.writingId);
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
    mutationFn: (payload) => analyticsService.createAi(payload),
    onSuccess: (data) => {
      invalidateAnalysisQueries(queryClient, data.writingId);
    },
  });
}

export function useAnalyses(
  params?: types.QueryAnalyticsParams,
): UseQueryResult<types.AnalysesListResponse, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.analyses.all(params),
    queryFn: () => analyticsService.getAll(params),
    staleTime: CACHE_TIME.MEDIUM,
  });
}

export function useAnalytics(
  id: string,
): UseQueryResult<types.Analytics, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.analyses.detail(id),
    queryFn: () => analyticsService.getById(id),
    staleTime: CACHE_TIME.LONG,
    enabled: !!id,
  });
}

export function useAnalysesByWriting(
  writingId: string,
  enabled = true,
): UseQueryResult<types.AnalysesListResponse, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.analyses.byWriting(writingId),
    queryFn: () => analyticsService.getByWriting(writingId),
    staleTime: CACHE_TIME.MEDIUM,
    enabled: !!writingId && enabled,
  });
}

export function useDeleteAnalytics(): UseMutationResult<
  { message: string },
  Error,
  string
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => analyticsService.delete(id),
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
    queryKey: QUERY_KEYS.analyses.stats,
    queryFn: () => analyticsService.getStats(),
    staleTime: CACHE_TIME.LONG,
  });
}

export function useTokenUsage(): UseQueryResult<types.TokenUsage, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.tokens.usage,
    queryFn: () => analyticsService.getTokenUsage(),
    staleTime: CACHE_TIME.SHORT,
    retry: 1,
  });
}

export function useTokenStats(): UseQueryResult<types.TokenStats, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.tokens.stats,
    queryFn: () => analyticsService.getTokenStats(),
    staleTime: CACHE_TIME.LONG,
  });
}
