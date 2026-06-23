import { http } from "./client";
import { API_PATHS } from "@/constants/api.constants";
import * as types from "@/types/api";

export const usersService = {
  async getMe(): Promise<types.User> {
    const response = await http.get<types.User>(API_PATHS.USERS.ME);
    return response.data;
  },

  async updateProfile(payload: types.UpdateProfilePayload): Promise<types.User> {
    const response = await http.patch<types.User>(
      API_PATHS.USERS.UPDATE_ME,
      payload,
    );
    return response.data;
  },

  async changePassword(
    payload: types.ChangePasswordPayload,
  ): Promise<{ message: string }> {
    const response = await http.patch<{ message: string }>(
      API_PATHS.USERS.CHANGE_PASSWORD,
      payload,
    );
    return response.data;
  },

  async getPublicProfile(username: string): Promise<types.PublicUserProfile> {
    const response = await http.get<types.PublicUserProfile>(
      API_PATHS.USERS.profile(username),
    );
    return response.data;
  },
};
