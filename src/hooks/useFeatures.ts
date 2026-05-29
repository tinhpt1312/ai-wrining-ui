import { useCallback } from "react";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

function getFeatureUrl(path: string) {
  const baseUrl = BASE_URL.replace(/\/$/, "");
  return baseUrl.endsWith("/api") && path.startsWith("/api/")
    ? `${baseUrl}${path.slice(4)}`
    : `${baseUrl}${path}`;
}

function getAuthHeaders(includeJson = false) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  return {
    ...(includeJson ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function useDailyTips() {
  const getTodayTip = useCallback(async () => {
    const res = await fetch(getFeatureUrl("/api/daily-tips/today"), {
      headers: getAuthHeaders(true),
    });
    if (!res.ok) throw new Error("Failed to fetch daily tip");
    return res.json();
  }, []);

  const generateTip = useCallback(async (categories?: string[]) => {
    const res = await fetch(
      getFeatureUrl(`/api/daily-tips/generate?categories=${
        categories ? categories.join(",") : ""
      }`),
      {
        method: "POST",
        headers: getAuthHeaders(true),
      },
    );
    if (!res.ok) throw new Error("Failed to generate tip");
    return res.json();
  }, []);

  return { getTodayTip, generateTip };
}

export function useAchievements() {
  const getAchievements = useCallback(async () => {
    const res = await fetch(getFeatureUrl("/api/achievements/my"), {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch achievements");
    return res.json();
  }, []);

  const getStats = useCallback(async () => {
    const res = await fetch(getFeatureUrl("/api/achievements/stats/my"), {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch stats");
    return res.json();
  }, []);

  return { getAchievements, getStats };
}

export function useAnalytics() {
  const getDashboard = useCallback(async () => {
    const res = await fetch(getFeatureUrl("/api/analytics/dashboard"), {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch analytics");
    return res.json();
  }, []);

  return { getDashboard };
}

export function useLearningPaths() {
  const getPaths = useCallback(async () => {
    const res = await fetch(
      getFeatureUrl("/api/feedback-categories/learning-paths"),
      {
        headers: getAuthHeaders(),
      },
    );
    if (!res.ok) throw new Error("Failed to fetch learning paths");
    return res.json();
  }, []);

  return { getPaths };
}

export function useWritingSuggestions() {
  const generate = useCallback(
    async (writingId: string, focusAreas?: string[]) => {
      const res = await fetch(getFeatureUrl("/api/writing-suggestions/generate"), {
        method: "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify({ writingId, focusAreas }),
      });
      if (!res.ok) throw new Error("Failed to generate suggestions");
      return res.json();
    },
    [],
  );

  return { generate };
}
