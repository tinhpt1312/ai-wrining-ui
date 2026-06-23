import axios, { AxiosInstance } from "axios";
import { API_CONFIG } from "@/constants/api.constants";
import { AUTH_STORAGE_KEYS } from "@/constants/auth.constants";
import { ROUTES } from "@/constants/routes.constants";

let cachedToken: string | null = null;

function readTokenFromStorage(): string | null {
  if (typeof window === "undefined") {
    return cachedToken;
  }
  return localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
}

export function getAccessToken(): string | null {
  return readTokenFromStorage();
}

export function setAccessToken(token: string): void {
  cachedToken = token;
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, token);
  }
}

export function clearAccessToken(): void {
  cachedToken = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
  }
}

export const http: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAccessToken();
      if (typeof window !== "undefined") {
        window.location.href = ROUTES.LOGIN;
      }
    } else if (error.response?.status === 403) {
      console.error("Access denied:", error.response.data?.message);
    } else if (error.response?.status === 429) {
      console.error("Rate limit exceeded. Please try again later.");
    } else if (error.response?.status >= 500) {
      console.error("Server error:", error.response.data?.message);
    }
    return Promise.reject(error);
  },
);

if (typeof window !== "undefined") {
  cachedToken = readTokenFromStorage();
}
