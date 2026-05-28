import { useCallback } from "react";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export function useDailyTips() {
  const getTodayTip = useCallback(async () => {
    const res = await fetch(`${BASE_URL}/api/daily-tips/today`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch daily tip");
    return res.json();
  }, []);

  const generateTip = useCallback(async (categories?: string[]) => {
    const res = await fetch(
      `${BASE_URL}/api/daily-tips/generate?categories=${
        categories ? categories.join(",") : ""
      }`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    if (!res.ok) throw new Error("Failed to generate tip");
    return res.json();
  }, []);

  return { getTodayTip, generateTip };
}

export function useAchievements() {
  const getAchievements = useCallback(async () => {
    const res = await fetch(`${BASE_URL}/api/achievements/my`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch achievements");
    return res.json();
  }, []);

  const getStats = useCallback(async () => {
    const res = await fetch(`${BASE_URL}/api/achievements/stats/my`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch stats");
    return res.json();
  }, []);

  return { getAchievements, getStats };
}

export function useAnalytics() {
  const getDashboard = useCallback(async () => {
    const res = await fetch(`${BASE_URL}/api/analytics/dashboard`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch analytics");
    return res.json();
  }, []);

  return { getDashboard };
}

export function useLearningPaths() {
  const getPaths = useCallback(async () => {
    const res = await fetch(
      `${BASE_URL}/api/feedback-categories/learning-paths`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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
      const res = await fetch(`${BASE_URL}/api/writing-suggestions/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ writingId, focusAreas }),
      });
      if (!res.ok) throw new Error("Failed to generate suggestions");
      return res.json();
    },
    [],
  );

  return { generate };
}
