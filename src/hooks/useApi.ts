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

export function useCreateAnalysis(): UseMutationResult<
  types.Analysis,
  Error,
  types.CreateAnalysisPayload
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => apiClient.createAnalysis(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["analyses"] });
      queryClient.invalidateQueries({
        queryKey: ["analyses", "writing", data.writingId],
      });
    },
  });
}

export function useCreateAiAnalysis(): UseMutationResult<
  types.Analysis,
  Error,
  types.CreateAiAnalysisPayload
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => apiClient.createAiAnalysis(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["analyses"] });
      queryClient.invalidateQueries({
        queryKey: ["analyses", "writing", data.writingId],
      });
    },
  });
}

export function useAnalyses(
  params?: types.QueryAnalysisParams,
): UseQueryResult<types.AnalysesListResponse, Error> {
  return useQuery({
    queryKey: ["analyses", params],
    queryFn: () => apiClient.getAnalyses(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useAnalysis(id: string): UseQueryResult<types.Analysis, Error> {
  return useQuery({
    queryKey: ["analyses", id],
    queryFn: () => apiClient.getAnalysis(id),
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

export function useUpdateAnalysis(): UseMutationResult<
  types.Analysis,
  Error,
  { id: string; payload: types.UpdateAnalysisPayload }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => apiClient.updateAnalysis(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["analyses"] });
      queryClient.setQueryData(["analyses", data.id], data);
    },
  });
}

export function useDeleteAnalysis(): UseMutationResult<
  { message: string },
  Error,
  string
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiClient.deleteAnalysis(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analyses"] });
    },
  });
}

export function useAnalysisStats(): UseQueryResult<types.AnalysisStats, Error> {
  return useQuery({
    queryKey: ["analyses", "stats"],
    queryFn: () => apiClient.getAnalysisStats(),
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
