import { http } from "./client";
import { API_PATHS } from "@/constants/api.constants";
import { normalizeListResponse } from "./response.helpers";
import * as types from "@/types/api";

export const writingsService = {
  async create(payload: types.CreateWritingPayload): Promise<types.Writing> {
    const response = await http.post<types.Writing>(
      API_PATHS.WRITINGS.ROOT,
      payload,
    );
    return response.data;
  },

  async getAll(
    params?: types.QueryWritingParams,
  ): Promise<types.WritingsListResponse> {
    const response = await http.get<
      types.BackendListResponse<types.Writing>
    >(API_PATHS.WRITINGS.ROOT, { params });
    return normalizeListResponse(response.data);
  },

  async getById(id: string): Promise<types.Writing> {
    const response = await http.get<types.Writing>(
      API_PATHS.WRITINGS.BY_ID(id),
    );
    return response.data;
  },

  async update(
    id: string,
    payload: types.UpdateWritingPayload,
  ): Promise<types.Writing> {
    const response = await http.patch<types.Writing>(
      API_PATHS.WRITINGS.BY_ID(id),
      payload,
    );
    return response.data;
  },

  async delete(id: string): Promise<{ message: string }> {
    const response = await http.delete<{ message: string }>(
      API_PATHS.WRITINGS.BY_ID(id),
    );
    return response.data;
  },

  async getStats(): Promise<types.WritingStats> {
    const response = await http.get<types.WritingStats>(
      API_PATHS.WRITINGS.STATS,
    );
    return response.data;
  },

  async getPublicAll(
    params?: types.QueryWritingParams,
  ): Promise<types.WritingsListResponse> {
    const response = await http.get<
      types.BackendListResponse<types.Writing>
    >(API_PATHS.WRITINGS.PUBLIC, { params });
    return normalizeListResponse(response.data);
  },

  async getPublicByUsername(
    username: string,
    params?: types.QueryWritingParams,
  ): Promise<types.WritingsListResponse> {
    const response = await http.get<
      types.BackendListResponse<types.Writing>
    >(API_PATHS.USERS.writings(username), { params });
    return normalizeListResponse(response.data);
  },
};
