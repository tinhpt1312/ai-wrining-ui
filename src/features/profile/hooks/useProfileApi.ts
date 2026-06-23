"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationResult,
  UseQueryResult,
} from "@tanstack/react-query";
import { usersService } from "@/api";
import { CACHE_TIME, QUERY_KEYS } from "@/constants";
import * as types from "@/types/api";

export function useUserProfile(
  username: string,
): UseQueryResult<types.PublicUserProfile, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.user.profile(username),
    queryFn: () => usersService.getPublicProfile(username),
    staleTime: CACHE_TIME.LONG,
    enabled: !!username,
  });
}

export function useUpdateProfile(): UseMutationResult<
  types.User,
  Error,
  types.UpdateProfilePayload
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => usersService.updateProfile(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.user.me, data);
    },
  });
}

export function useChangePassword(): UseMutationResult<
  { message: string },
  Error,
  types.ChangePasswordPayload
> {
  return useMutation({
    mutationFn: (payload) => usersService.changePassword(payload),
  });
}
