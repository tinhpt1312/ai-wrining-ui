"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationResult,
  UseQueryResult,
} from "@tanstack/react-query";
import { suggestionsService } from "@/api";
import { CACHE_TIME, QUERY_KEYS } from "@/constants";
import * as types from "@/types/api";

function invalidateSuggestionQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  writingId: string,
) {
  queryClient.invalidateQueries({ queryKey: ["writing-suggestions"] });
  queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.suggestions.byWriting(writingId),
  });
  queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.suggestions.stats(writingId),
  });
  queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.suggestions.refactored(writingId),
  });
}

export function useCreateWritingSuggestion(): UseMutationResult<
  types.WritingSuggestion,
  Error,
  types.CreateWritingSuggestionPayload
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => suggestionsService.create(payload),
    onSuccess: (data) => {
      invalidateSuggestionQueries(queryClient, data.writingId);
    },
  });
}

export function useWritingSuggestions(
  params?: types.QueryWritingSuggestionsParams,
): UseQueryResult<types.WritingSuggestionsListResponse, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.suggestions.all(params),
    queryFn: () => suggestionsService.getAll(params),
    staleTime: CACHE_TIME.MEDIUM,
  });
}

export function useWritingSuggestion(
  id: string,
): UseQueryResult<types.WritingSuggestion, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.suggestions.detail(id),
    queryFn: () => suggestionsService.getById(id),
    staleTime: CACHE_TIME.LONG,
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
    mutationFn: ({ id, payload }) => suggestionsService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["writing-suggestions"] });
      queryClient.setQueryData(QUERY_KEYS.suggestions.detail(data.id), data);
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
    mutationFn: (id) => suggestionsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["writing-suggestions"] });
    },
  });
}

export function useSuggestionsByWriting(
  writingId: string,
): UseQueryResult<types.WritingSuggestionsListResponse, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.suggestions.byWriting(writingId),
    queryFn: () => suggestionsService.getByWriting(writingId),
    staleTime: CACHE_TIME.MEDIUM,
    enabled: !!writingId,
  });
}

export function useSuggestionStats(
  writingId: string,
): UseQueryResult<types.WritingSuggestionStats, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.suggestions.stats(writingId),
    queryFn: () => suggestionsService.getStats(writingId),
    staleTime: CACHE_TIME.LONG,
    enabled: !!writingId,
  });
}

export function useRefactoredWriting(
  writingId: string,
  enabled = true,
): UseQueryResult<types.RefactoredWriting, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.suggestions.refactored(writingId),
    queryFn: () => suggestionsService.getRefactored(writingId),
    staleTime: CACHE_TIME.MEDIUM,
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
      suggestionsService.generate(writingId, focusAreas),
    onSuccess: (_data, variables) => {
      invalidateSuggestionQueries(queryClient, variables.writingId);
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
      suggestionsService.apply(suggestionId, writingId, updateWriting),
    onSuccess: (_data, variables) => {
      invalidateSuggestionQueries(queryClient, variables.writingId);
      if (variables.updateWriting) {
        queryClient.invalidateQueries({ queryKey: ["writings"] });
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.writings.detail(variables.writingId),
        });
      }
    },
  });
}
