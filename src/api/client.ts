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
    const response = await this.client.post<any>("/auth/register", payload);
    if (response.data.accessToken) {
      this.setToken(response.data.accessToken);
    }
    return {
      access_token: response.data.accessToken,
      user: response.data.user,
    };
  }

  async login(payload: types.LoginPayload): Promise<types.AuthResponse> {
    const response = await this.client.post<any>("/auth/login", payload);
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
    const response = await this.client.get<types.WritingsListResponse>(
      "/writings",
      {
        params,
      },
    );
    return response.data;
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
      "/analysis",
      payload,
    );
    return response.data;
  }

  async createAiAnalytics(
    payload: types.CreateAiAnalyticsPayload,
  ): Promise<types.Analytics> {
    const response = await this.client.post<types.Analytics>(
      "/analysis/ai",
      payload,
    );
    return response.data;
  }

  async getAnalyses(
    params?: types.QueryAnalyticsParams,
  ): Promise<types.AnalysesListResponse> {
    const response = await this.client.get<types.AnalysesListResponse>(
      "/analysis",
      {
        params,
      },
    );
    return response.data;
  }

  async getAnalytics(id: string): Promise<types.Analytics> {
    const response = await this.client.get<types.Analytics>(`/analysis/${id}`);
    return response.data;
  }

  async getAnalysesByWriting(
    writingId: string,
  ): Promise<types.AnalysesListResponse> {
    const response = await this.client.get<types.AnalysesListResponse>(
      `/analysis/writing/${writingId}`,
    );
    return response.data;
  }

  async updateAnalytics(
    id: string,
    payload: types.UpdateAnalyticsPayload,
  ): Promise<types.Analytics> {
    const response = await this.client.patch<types.Analytics>(
      `/analysis/${id}`,
      payload,
    );
    return response.data;
  }

  async deleteAnalytics(id: string): Promise<{ message: string }> {
    const response = await this.client.delete<{ message: string }>(
      `/analysis/${id}`,
    );
    return response.data;
  }

  async getAnalyticsStats(): Promise<types.AnalyticsStats> {
    const response = await this.client.get<types.AnalyticsStats>(
      "/analysis/stats/overview",
    );
    return response.data;
  }

  async getTokenUsage(): Promise<types.TokenUsage> {
    const response = await this.client.get<types.TokenUsage>(
      "/analysis/tokens/usage",
    );
    return response.data;
  }

  async getTokenStats(): Promise<types.TokenStats> {
    const response = await this.client.get<types.TokenStats>(
      "/analysis/tokens/stats",
    );
    return response.data;
  }
}

export const apiClient = new ApiClient();
