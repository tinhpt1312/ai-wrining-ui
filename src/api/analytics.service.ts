import { http } from "./client";
import { API_PATHS } from "@/constants/api.constants";
import { normalizeListResponse } from "./response.helpers";
import * as types from "@/types/api";

export const analyticsService = {
  async create(payload: types.CreateAnalyticsPayload): Promise<types.Analytics> {
    const response = await http.post<types.Analytics>(
      API_PATHS.ANALYTICS.ROOT,
      payload,
    );
    return response.data;
  },

  async createAi(
    payload: types.CreateAiAnalyticsPayload,
  ): Promise<types.Analytics> {
    const response = await http.post<
      types.Analytics | types.CreateAiAnalyticsResponse
    >(API_PATHS.ANALYTICS.AI, payload);
    return "analysis" in response.data ? response.data.analysis : response.data;
  },

  async getAll(
    params?: types.QueryAnalyticsParams,
  ): Promise<types.AnalysesListResponse> {
    const response = await http.get<
      types.BackendListResponse<types.Analytics>
    >(API_PATHS.ANALYTICS.ROOT, { params });
    return normalizeListResponse(response.data);
  },

  async getById(id: string): Promise<types.Analytics> {
    const response = await http.get<types.Analytics>(
      API_PATHS.ANALYTICS.BY_ID(id),
    );
    return response.data;
  },

  async getByWriting(writingId: string): Promise<types.AnalysesListResponse> {
    const response = await http.get<types.AnalysesListResponse>(
      API_PATHS.ANALYTICS.BY_WRITING(writingId),
    );
    return normalizeListResponse(response.data);
  },

  async update(
    id: string,
    payload: types.UpdateAnalyticsPayload,
  ): Promise<types.Analytics> {
    const response = await http.patch<types.Analytics>(
      API_PATHS.ANALYTICS.BY_ID(id),
      payload,
    );
    return response.data;
  },

  async delete(id: string): Promise<{ message: string }> {
    const response = await http.delete<{ message: string }>(
      API_PATHS.ANALYTICS.BY_ID(id),
    );
    return response.data;
  },

  async getStats(): Promise<types.AnalyticsStats> {
    const response = await http.get<types.AnalyticsStats>(
      API_PATHS.ANALYTICS.STATS,
    );
    return response.data;
  },

  async getTokenUsage(): Promise<types.TokenUsage> {
    const response = await http.get<types.TokenUsage>(
      API_PATHS.ANALYTICS.TOKEN_USAGE,
    );
    return response.data;
  },

  async getTokenStats(): Promise<types.TokenStats> {
    const response = await http.get<types.TokenStats>(
      API_PATHS.ANALYTICS.TOKEN_STATS,
    );
    return response.data;
  },
};
