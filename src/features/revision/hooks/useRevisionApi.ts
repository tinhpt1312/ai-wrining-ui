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
