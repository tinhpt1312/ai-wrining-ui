import { http, setAccessToken, clearAccessToken } from "./client";
import { API_PATHS } from "@/constants/api.constants";
import * as types from "@/types/api";

export const authService = {
  async register(payload: types.RegisterPayload): Promise<types.AuthResponse> {
    const response = await http.post<types.BackendAuthResponse>(
      API_PATHS.AUTH.REGISTER,
      payload,
    );
    if (response.data.accessToken) {
      setAccessToken(response.data.accessToken);
    }
    return {
      access_token: response.data.accessToken,
      user: response.data.user,
    };
  },

  async login(payload: types.LoginPayload): Promise<types.AuthResponse> {
    const response = await http.post<types.BackendAuthResponse>(
      API_PATHS.AUTH.LOGIN,
      payload,
    );
    if (response.data.accessToken) {
      setAccessToken(response.data.accessToken);
    }
    return {
      access_token: response.data.accessToken,
      user: response.data.user,
    };
  },

  async logout(): Promise<void> {
    clearAccessToken();
  },
};
