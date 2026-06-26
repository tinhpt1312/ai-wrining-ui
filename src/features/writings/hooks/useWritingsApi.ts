"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationResult,
  UseQueryResult,
} from "@tanstack/react-query";
import { writingsService } from "@/api";
import { CACHE_TIME, QUERY_KEYS } from "@/constants";
import * as types from "@/types/api";

export function useCreateWriting(): UseMutationResult<
  types.Writing,
  Error,
  types.CreateWritingPayload
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => writingsService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["writings"] });
    },
  });
}

export function useWritings(
  params?: types.QueryWritingParams,
): UseQueryResult<types.WritingsListResponse, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.writings.all(params),
    queryFn: () => writingsService.getAll(params),
    staleTime: CACHE_TIME.MEDIUM,
  });
}

export function useWriting(id: string): UseQueryResult<types.Writing, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.writings.detail(id),
    queryFn: () => writingsService.getById(id),
    staleTime: CACHE_TIME.LONG,
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
    mutationFn: ({ id, payload }) => writingsService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["writings"] });
      queryClient.setQueryData(QUERY_KEYS.writings.detail(data.id), data);
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
    mutationFn: (id) => writingsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["writings"] });
    },
  });
}

export function useWritingStats(): UseQueryResult<types.WritingStats, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.writings.stats,
    queryFn: () => writingsService.getStats(),
    staleTime: CACHE_TIME.LONG,
  });
}

export function useGenerateOutline(): UseMutationResult<
  types.WritingOutline,
  Error,
  types.GenerateOutlinePayload
> {
  return useMutation({
    mutationFn: (payload) => writingsService.generateOutline(payload),
  });
}

export function useGenerateWritingPrompts(): UseMutationResult<
  types.GeneratedWritingPrompt[],
  Error,
  types.GenerateWritingPromptsPayload
> {
  return useMutation({
    mutationFn: (payload) => writingsService.generatePrompts(payload),
  });
}
