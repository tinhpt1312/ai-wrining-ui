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

export function usePublicWritings(
  params?: types.QueryWritingParams,
): UseQueryResult<types.WritingsListResponse, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.writings.public(params),
    queryFn: () => writingsService.getPublicAll(params),
    staleTime: CACHE_TIME.MEDIUM,
  });
}

export function usePublicWritingsByUser(
  username: string,
  params?: types.QueryWritingParams,
): UseQueryResult<types.WritingsListResponse, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.writings.byUser(username, params),
    queryFn: () => writingsService.getPublicByUsername(username, params),
    staleTime: CACHE_TIME.MEDIUM,
    enabled: !!username,
  });
}
