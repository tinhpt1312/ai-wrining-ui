import { http } from "./client";
import { API_PATHS } from "@/constants/api.constants";
import {
  normalizeListResponse,
  normalizeSuggestionStats,
  unwrapDataResponse,
} from "./response.helpers";
import * as types from "@/types/api";

export const suggestionsService = {
  async create(
    payload: types.CreateWritingSuggestionPayload,
  ): Promise<types.WritingSuggestion> {
    const response = await http.post<types.WritingSuggestion>(
      API_PATHS.SUGGESTIONS.ROOT,
      payload,
    );
    return response.data;
  },

  async getAll(
    params?: types.QueryWritingSuggestionsParams,
  ): Promise<types.WritingSuggestionsListResponse> {
    const response = await http.get<
      types.BackendListResponse<types.WritingSuggestion>
    >(API_PATHS.SUGGESTIONS.ROOT, { params });
    return normalizeListResponse(response.data);
  },

  async getById(id: string): Promise<types.WritingSuggestion> {
    const response = await http.get<types.WritingSuggestion>(
      API_PATHS.SUGGESTIONS.BY_ID(id),
    );
    return response.data;
  },

  async update(
    id: string,
    payload: types.UpdateWritingSuggestionPayload,
  ): Promise<types.WritingSuggestion> {
    const response = await http.patch<types.WritingSuggestion>(
      API_PATHS.SUGGESTIONS.BY_ID(id),
      payload,
    );
    return response.data;
  },

  async delete(id: string): Promise<{ message: string }> {
    const response = await http.delete<{ message: string }>(
      API_PATHS.SUGGESTIONS.BY_ID(id),
    );
    return response.data;
  },

  async getByWriting(
    writingId: string,
  ): Promise<types.WritingSuggestionsListResponse> {
    const response = await http.get<
      types.BackendListResponse<types.WritingSuggestion>
    >(API_PATHS.SUGGESTIONS.BY_WRITING(writingId));
    return normalizeListResponse(response.data);
  },

  async getStats(
    writingId: string,
  ): Promise<types.WritingSuggestionStats> {
    const response = await http.get<
      | types.BackendDataResponse<types.BackendWritingSuggestionStats>
      | types.BackendWritingSuggestionStats
      | types.WritingSuggestionStats
    >(API_PATHS.SUGGESTIONS.STATS(writingId));
    return normalizeSuggestionStats(unwrapDataResponse(response.data));
  },

  async generate(
    writingId: string,
    focusAreas?: string[],
  ): Promise<types.WritingSuggestionsListResponse> {
    const response = await http.post<
      types.BackendListResponse<types.WritingSuggestion>
    >(API_PATHS.SUGGESTIONS.GENERATE, { writingId, focusAreas });
    return normalizeListResponse(response.data);
  },

  async apply(
    suggestionId: string,
    writingId: string,
    updateWriting?: boolean,
  ): Promise<types.WritingSuggestion> {
    const response = await http.patch<
      types.BackendDataResponse<types.WritingSuggestion> | types.WritingSuggestion
    >(
      API_PATHS.SUGGESTIONS.APPLY(suggestionId),
      { updateWriting },
      { params: { writingId, updateWriting } },
    );
    return unwrapDataResponse(response.data);
  },

  async getRefactored(writingId: string): Promise<types.RefactoredWriting> {
    const response = await http.get<
      types.BackendDataResponse<types.RefactoredWriting> | types.RefactoredWriting
    >(API_PATHS.SUGGESTIONS.REFACTORED(writingId));
    return unwrapDataResponse(response.data);
  },
};
