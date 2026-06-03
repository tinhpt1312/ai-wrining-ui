import axios, { AxiosInstance } from "axios";
import * as types from "@/types/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add interceptor to include token in requests
    this.client.interceptors.request.use((config) => {
      const token = this.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Unauthorized - clear token and redirect to login
          this.clearToken();
          if (typeof window !== "undefined") {
            // Trigger logout event or redirect
            window.location.href = "/login";
          }
        } else if (error.response?.status === 403) {
          // Forbidden - user doesn't have permission
          console.error("Access denied:", error.response.data?.message);
        } else if (error.response?.status === 429) {
          // Rate limit exceeded
          console.error("Rate limit exceeded. Please try again later.");
        } else if (error.response?.status >= 500) {
          // Server error
          console.error("Server error:", error.response.data?.message);
        }
        return Promise.reject(error);
      },
    );

    // Load token from localStorage on initialization
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("accessToken");
    }
  }

  private getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return this.token;
  }

  setToken(token: string): void {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", token);
    }
  }

  clearToken(): void {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
    }
  }

  // ============ AUTH ENDPOINTS ============

  async register(payload: types.RegisterPayload): Promise<types.AuthResponse> {
    const response = await this.client.post<types.BackendAuthResponse>(
      "/auth/register",
      payload,
    );
    if (response.data.accessToken) {
      this.setToken(response.data.accessToken);
    }
    return {
      access_token: response.data.accessToken,
      user: response.data.user,
    };
  }

  async login(payload: types.LoginPayload): Promise<types.AuthResponse> {
    const response = await this.client.post<types.BackendAuthResponse>(
      "/auth/login",
      payload,
    );
    if (response.data.accessToken) {
      this.setToken(response.data.accessToken);
    }
    return {
      access_token: response.data.accessToken,
      user: response.data.user,
    };
  }

  async logout(): Promise<void> {
    this.clearToken();
  }

  // ============ USERS ENDPOINTS ============

  async getMe(): Promise<types.User> {
    const response = await this.client.get<types.User>("/users/me");
    return response.data;
  }

  // ============ WRITINGS ENDPOINTS ============

  async createWriting(
    payload: types.CreateWritingPayload,
  ): Promise<types.Writing> {
    const response = await this.client.post<types.Writing>(
      "/writings",
      payload,
    );
    return response.data;
  }

  async getWritings(
    params?: types.QueryWritingParams,
  ): Promise<types.WritingsListResponse> {
    const response = await this.client.get<
      types.BackendListResponse<types.Writing>
    >("/writings", {
      params,
    });
    return this.normalizeListResponse(response.data);
  }

  async getWriting(id: string): Promise<types.Writing> {
    const response = await this.client.get<types.Writing>(`/writings/${id}`);
    return response.data;
  }

  async updateWriting(
    id: string,
    payload: types.UpdateWritingPayload,
  ): Promise<types.Writing> {
    const response = await this.client.patch<types.Writing>(
      `/writings/${id}`,
      payload,
    );
    return response.data;
  }

  async deleteWriting(id: string): Promise<{ message: string }> {
    const response = await this.client.delete<{ message: string }>(
      `/writings/${id}`,
    );
    return response.data;
  }

  async getWritingStats(): Promise<types.WritingStats> {
    const response = await this.client.get<types.WritingStats>(
      "/writings/stats/overview",
    );
    return response.data;
  }

  // ============ ANALYSIS ENDPOINTS ============

  async createAnalytics(
    payload: types.CreateAnalyticsPayload,
  ): Promise<types.Analytics> {
    const response = await this.client.post<types.Analytics>(
      "/analytics",
      payload,
    );
    return response.data;
  }

  async createAiAnalytics(
    payload: types.CreateAiAnalyticsPayload,
  ): Promise<types.Analytics> {
    const response = await this.client.post<
      types.Analytics | types.CreateAiAnalyticsResponse
    >("/analytics/ai", payload);
    return "analysis" in response.data ? response.data.analysis : response.data;
  }

  async getAnalyses(
    params?: types.QueryAnalyticsParams,
  ): Promise<types.AnalysesListResponse> {
    const response = await this.client.get<
      types.BackendListResponse<types.Analytics>
    >("/analytics", {
      params,
    });
    return this.normalizeListResponse(response.data);
  }

  async getAnalytics(id: string): Promise<types.Analytics> {
    const response = await this.client.get<types.Analytics>(`/analytics/${id}`);
    return response.data;
  }

  async getAnalysesByWriting(
    writingId: string,
  ): Promise<types.AnalysesListResponse> {
    const response = await this.client.get<types.AnalysesListResponse>(
      `/analytics/writing/${writingId}`,
    );
    return this.normalizeListResponse(response.data);
  }

  async updateAnalytics(
    id: string,
    payload: types.UpdateAnalyticsPayload,
  ): Promise<types.Analytics> {
    const response = await this.client.patch<types.Analytics>(
      `/analytics/${id}`,
      payload,
    );
    return response.data;
  }

  async deleteAnalytics(id: string): Promise<{ message: string }> {
    const response = await this.client.delete<{ message: string }>(
      `/analytics/${id}`,
    );
    return response.data;
  }

  async getAnalyticsStats(): Promise<types.AnalyticsStats> {
    const response = await this.client.get<types.AnalyticsStats>(
      "/analytics/stats/overview",
    );
    return response.data;
  }

  async getTokenUsage(): Promise<types.TokenUsage> {
    const response = await this.client.get<types.TokenUsage>(
      "/analytics/tokens/usage",
    );
    return response.data;
  }

  async getTokenStats(): Promise<types.TokenStats> {
    const response = await this.client.get<types.TokenStats>(
      "/analytics/tokens/stats",
    );
    return response.data;
  }

  // ============ DAILY TIPS ENDPOINTS ============

  async createDailyTip(
    payload: types.CreateDailyTipPayload,
  ): Promise<types.DailyTip> {
    const response = await this.client.post<types.DailyTip>(
      "/daily-tips",
      payload,
    );
    return response.data;
  }

  async getDailyTips(
    params?: types.QueryDailyTipsParams,
  ): Promise<types.DailyTipsListResponse> {
    const response = await this.client.get<
      types.BackendListResponse<types.DailyTip>
    >("/daily-tips", {
      params,
    });
    return this.normalizeListResponse(response.data);
  }

  async getDailyTip(id: string): Promise<types.DailyTip> {
    const response = await this.client.get<types.DailyTip>(`/daily-tips/${id}`);
    return response.data;
  }

  async updateDailyTip(
    id: string,
    payload: types.UpdateDailyTipPayload,
  ): Promise<types.DailyTip> {
    const response = await this.client.patch<types.DailyTip>(
      `/daily-tips/${id}`,
      payload,
    );
    return response.data;
  }

  async deleteDailyTip(id: string): Promise<{ message: string }> {
    const response = await this.client.delete<{ message: string }>(
      `/daily-tips/${id}`,
    );
    return response.data;
  }

  async getTodayTip(): Promise<types.DailyTip> {
    const response = await this.client.get<types.DailyTip>("/daily-tips/today");
    return response.data;
  }

  async getUnreadTipsCount(): Promise<{ count: number }> {
    const response = await this.client.get<{ count: number }>(
      "/daily-tips/unread/count",
    );
    return response.data;
  }

  async generateDailyTip(): Promise<types.DailyTip> {
    const response = await this.client.post<types.DailyTip>(
      "/daily-tips/generate",
      {},
    );
    return response.data;
  }

  // ============ ACHIEVEMENTS ENDPOINTS ============

  async getAchievements(params?: {
    limit?: number;
    offset?: number;
  }): Promise<types.AchievementsListResponse> {
    const response = await this.client.get<
      types.BackendListResponse<types.Achievement>
    >("/achievements", {
      params,
    });
    return this.normalizeListResponse(response.data);
  }

  async getAchievement(id: string): Promise<types.Achievement> {
    const response = await this.client.get<types.Achievement>(
      `/achievements/${id}`,
    );
    return response.data;
  }

  async getUserAchievements(): Promise<types.UserAchievementsStatusListResponse> {
    const response =
      await this.client.get<
        types.BackendListResponse<types.UserAchievementStatus>
      >("/achievements/my");
    return this.normalizeListResponse(response.data);
  }

  async getUserAchievementsStats(): Promise<types.UserAchievementsStats> {
    const response = await this.client.get<types.UserAchievementsStats>(
      "/achievements/stats/my",
    );
    return response.data;
  }

  // ============ WRITING SUGGESTIONS ENDPOINTS ============

  async createWritingSuggestion(
    payload: types.CreateWritingSuggestionPayload,
  ): Promise<types.WritingSuggestion> {
    const response = await this.client.post<types.WritingSuggestion>(
      "/writing-suggestions",
      payload,
    );
    return response.data;
  }

  async getWritingSuggestions(
    params?: types.QueryWritingSuggestionsParams,
  ): Promise<types.WritingSuggestionsListResponse> {
    const response = await this.client.get<
      types.BackendListResponse<types.WritingSuggestion>
    >("/writing-suggestions", {
      params,
    });
    return this.normalizeListResponse(response.data);
  }

  async getWritingSuggestion(id: string): Promise<types.WritingSuggestion> {
    const response = await this.client.get<types.WritingSuggestion>(
      `/writing-suggestions/${id}`,
    );
    return response.data;
  }

  async updateWritingSuggestion(
    id: string,
    payload: types.UpdateWritingSuggestionPayload,
  ): Promise<types.WritingSuggestion> {
    const response = await this.client.patch<types.WritingSuggestion>(
      `/writing-suggestions/${id}`,
      payload,
    );
    return response.data;
  }

  async deleteWritingSuggestion(id: string): Promise<{ message: string }> {
    const response = await this.client.delete<{ message: string }>(
      `/writing-suggestions/${id}`,
    );
    return response.data;
  }

  async getSuggestionsByWriting(
    writingId: string,
  ): Promise<types.WritingSuggestionsListResponse> {
    const response = await this.client.get<
      types.BackendListResponse<types.WritingSuggestion>
    >(`/writing-suggestions/writing/${writingId}`);
    return this.normalizeListResponse(response.data);
  }

  async getSuggestionStats(
    writingId: string,
  ): Promise<types.WritingSuggestionStats> {
    const response = await this.client.get<
      | types.BackendDataResponse<types.BackendWritingSuggestionStats>
      | types.BackendWritingSuggestionStats
      | types.WritingSuggestionStats
    >(`/writing-suggestions/writing/${writingId}/stats`);
    return this.normalizeSuggestionStats(this.unwrapDataResponse(response.data));
  }

  async generateSuggestions(
    writingId: string,
    focusAreas?: string[],
  ): Promise<types.WritingSuggestionsListResponse> {
    const response = await this.client.post<
      types.BackendListResponse<types.WritingSuggestion>
    >("/writing-suggestions/generate", {
      writingId,
      focusAreas,
    });
    return this.normalizeListResponse(response.data);
  }

  async applySuggestion(
    suggestionId: string,
    writingId: string,
    updateWriting?: boolean,
  ): Promise<types.WritingSuggestion> {
    const response = await this.client.patch<
      types.BackendDataResponse<types.WritingSuggestion> | types.WritingSuggestion
    >(
      `/writing-suggestions/${suggestionId}/apply`,
      { updateWriting },
      {
        params: { writingId, updateWriting },
      },
    );
    return this.unwrapDataResponse(response.data);
  }

  async getRefactoredWriting(writingId: string): Promise<types.RefactoredWriting> {
    const response = await this.client.get<
      types.BackendDataResponse<types.RefactoredWriting> | types.RefactoredWriting
    >(`/writing-suggestions/writing/${writingId}/refactored`);
    return this.unwrapDataResponse(response.data);
  }

  // ============ FEEDBACK CATEGORIES ENDPOINTS ============

  async getFeedbackCategories(params?: {
    limit?: number;
    offset?: number;
  }): Promise<types.FeedbackCategoriesListResponse> {
    const response = await this.client.get<
      types.BackendListResponse<types.FeedbackCategory>
    >("/feedback-categories", {
      params,
    });
    return this.normalizeListResponse(response.data);
  }

  async getFeedbackCategory(id: string): Promise<types.FeedbackCategory> {
    const response = await this.client.get<types.FeedbackCategory>(
      `/feedback-categories/${id}`,
    );
    return response.data;
  }

  async createFeedbackCategory(
    payload: types.CreateFeedbackCategoryPayload,
  ): Promise<types.FeedbackCategory> {
    const response = await this.client.post<types.FeedbackCategory>(
      "/feedback-categories",
      payload,
    );
    return response.data;
  }

  async updateFeedbackCategory(
    id: string,
    payload: types.UpdateFeedbackCategoryPayload,
  ): Promise<types.FeedbackCategory> {
    const response = await this.client.patch<types.FeedbackCategory>(
      `/feedback-categories/${id}`,
      payload,
    );
    return response.data;
  }

  async deleteFeedbackCategory(id: string): Promise<{ message: string }> {
    const response = await this.client.delete<{ message: string }>(
      `/feedback-categories/${id}`,
    );
    return response.data;
  }

  private normalizeListResponse<T>(
    response: types.BackendListResponse<T>,
  ): types.ListResponse<T> {
    return {
      data: response.data || [],
      total:
        response.total ??
        response.pagination?.total ??
        response.data?.length ??
        0,
      limit:
        response.limit ??
        response.pagination?.limit ??
        response.data?.length ??
        0,
      offset: response.offset ?? response.pagination?.offset ?? 0,
      pagination: response.pagination,
    };
  }

  private unwrapDataResponse<T>(response: types.BackendDataResponse<T> | T): T {
    if (
      typeof response === "object" &&
      response !== null &&
      "data" in response
    ) {
      return (response as types.BackendDataResponse<T>).data;
    }

    return response as T;
  }

  private normalizeSuggestionStats(
    stats:
      | types.BackendWritingSuggestionStats
      | types.WritingSuggestionStats,
  ): types.WritingSuggestionStats {
    if ("totalSuggestions" in stats) {
      return stats;
    }

    const byType = stats.byType.reduce<Record<string, number>>((acc, item) => {
      acc[item.type] = item.count;
      return acc;
    }, {});
    const bySeverity = stats.bySeverity.reduce<Record<string, number>>(
      (acc, item) => {
        acc[item.severity] = item.count;
        return acc;
      },
      {},
    );

    return {
      totalSuggestions: stats.total,
      appliedCount: stats.applied,
      appliedPercentage:
        stats.total > 0 ? Math.round((stats.applied / stats.total) * 100) : 0,
      byType,
      bySeverity,
    };
  }
}

export const apiClient = new ApiClient();
