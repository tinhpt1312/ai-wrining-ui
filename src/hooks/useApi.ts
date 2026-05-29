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
      data?: any,
    ) => {
      const configuredBaseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      const baseUrl = configuredBaseUrl.replace(/\/$/, "");
      const requestUrl =
        baseUrl.endsWith("/api") && url.startsWith("/api/")
          ? `${baseUrl}${url.slice(4)}`
          : `${baseUrl}${url}`;
      const token = getToken();
      const headers: any = {
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
    post: (url: string, data: any) => request("POST", url, data),
    patch: (url: string, data: any) => request("PATCH", url, data),
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
