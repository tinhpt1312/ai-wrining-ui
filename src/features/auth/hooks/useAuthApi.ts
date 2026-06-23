"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationResult,
  UseQueryResult,
} from "@tanstack/react-query";
import { authService, usersService } from "@/api";
import { CACHE_TIME, QUERY_KEYS } from "@/constants";
import * as types from "@/types/api";

export function useRegister(): UseMutationResult<
  types.AuthResponse,
  Error,
  types.RegisterPayload
> {
  return useMutation({
    mutationFn: (payload) => authService.register(payload),
  });
}

export function useLogin(): UseMutationResult<
  types.AuthResponse,
  Error,
  types.LoginPayload
> {
  return useMutation({
    mutationFn: (payload) => authService.login(payload),
  });
}

export function useLogout(): UseMutationResult<void, Error, void> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

export function useUser(): UseQueryResult<types.User, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.user.me,
    queryFn: () => usersService.getMe(),
    staleTime: CACHE_TIME.LONG,
    retry: false,
  });
}
