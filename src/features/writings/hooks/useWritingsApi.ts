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

function invalidateRevisionQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  writingId: string,
  analysisId?: string,
) {
  queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.revisions.byWriting(writingId),
  });
  queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.revisions.timeline(writingId, analysisId),
  });
  queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.revisions.timeline(writingId),
  });
}

export function useWritingRevisions(
  writingId: string,
): UseQueryResult<types.WritingRevisionsListResponse, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.revisions.byWriting(writingId),
    queryFn: () => writingsService.getRevisions(writingId),
    staleTime: CACHE_TIME.MEDIUM,
    enabled: !!writingId,
  });
}

export function useRevisionTimeline(
  writingId: string,
  analysisId?: string,
): UseQueryResult<types.RevisionTimelineResponse, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.revisions.timeline(writingId, analysisId),
    queryFn: () => writingsService.getRevisionTimeline(writingId, analysisId),
    staleTime: CACHE_TIME.MEDIUM,
    enabled: !!writingId,
  });
}

export function useEnsureBaselineRevision(): UseMutationResult<
  types.WritingRevision,
  Error,
  { writingId: string; payload: types.EnsureBaselineRevisionPayload }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ writingId, payload }) =>
      writingsService.ensureBaselineRevision(writingId, payload),
    onSuccess: (_data, variables) => {
      invalidateRevisionQueries(
        queryClient,
        variables.writingId,
        variables.payload.analysisId,
      );
    },
  });
}

export function useCreateWritingRevision(): UseMutationResult<
  types.WritingRevision,
  Error,
  { writingId: string; payload: types.CreateWritingRevisionPayload }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ writingId, payload }) =>
      writingsService.createRevision(writingId, payload),
    onSuccess: (_data, variables) => {
      invalidateRevisionQueries(
        queryClient,
        variables.writingId,
        variables.payload.analysisId,
      );
    },
  });
}

export function useRestoreWritingRevision(): UseMutationResult<
  types.Writing,
  Error,
  { writingId: string; revisionId: string }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ writingId, revisionId }) =>
      writingsService.restoreRevision(writingId, revisionId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["writings"] });
      queryClient.setQueryData(
        QUERY_KEYS.writings.detail(variables.writingId),
        data,
      );
      invalidateRevisionQueries(queryClient, variables.writingId);
    },
  });
}
