"use client";

import React, { useState, useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import DailyTipsCard from "@/components/DailyTipsCard";
import AchievementsPanel from "@/components/AchievementsPanel";

interface AnalyticsData {
  totalSubmissions: number;
  totalWords: number;
  averageScore: number;
  submissionsByDate: { date: string; count: number }[];
  scoresTrend: { date: string; score: number }[];
  wordCountTrend: { date: string; words: number }[];
  improvementPercentage: number;
}

interface DailyStats {
  today: number;
  thisWeek: number;
  thisMonth: number;
}

interface WritingType {
  type: string;
  count: number;
}

export default function AnalyticsPage() {
  const api = useApi();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStats | null>(null);
  const [writingTypes, setWritingTypes] = useState<WritingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">(
    "month",
  );

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [analyticsRes, dailyRes, typesRes] = await Promise.all([
        api.get("/api/analytics/dashboard"),
        api.get("/api/analytics/daily"),
        api.get("/api/analytics/by-type"),
      ]);

      setAnalytics(analyticsRes.data);
      setDailyStats(dailyRes.data);
      setWritingTypes(typesRes.data || []);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse bg-white rounded-lg shadow p-6 h-96"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">📊 Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Track your writing progress and improvement
        </p>
      </div>

      {/* Timeframe Selector */}
      <div className="flex gap-2">
        {(["week", "month", "year"] as const).map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-4 py-2 rounded capitalize font-semibold transition-colors ${
              timeframe === tf
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            This {tf}
          </button>
        ))}
      </div>

      {/* Main Stats */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600">
              {analytics.totalSubmissions}
            </div>
            <div className="text-gray-600 text-sm mt-1">Total Writings</div>
          </div>
          <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-purple-600">
              {analytics.totalWords}
            </div>
            <div className="text-gray-600 text-sm mt-1">Total Words</div>
          </div>
          <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600">
              {analytics.averageScore.toFixed(1)}
            </div>
            <div className="text-gray-600 text-sm mt-1">Avg Score</div>
          </div>
          <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-orange-600">
              {analytics.improvementPercentage.toFixed(0)}%
            </div>
            <div className="text-gray-600 text-sm mt-1">Improvement</div>
          </div>
        </div>
      )}

      {/* Daily Stats */}
      {dailyStats && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">📅 Activity Overview</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded">
              <div className="text-2xl font-bold text-blue-600">
                {dailyStats.today}
              </div>
              <div className="text-sm text-gray-600 mt-1">Today</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded">
              <div className="text-2xl font-bold text-purple-600">
                {dailyStats.thisWeek}
              </div>
              <div className="text-sm text-gray-600 mt-1">This Week</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded">
              <div className="text-2xl font-bold text-green-600">
                {dailyStats.thisMonth}
              </div>
              <div className="text-sm text-gray-600 mt-1">This Month</div>
            </div>
          </div>
        </div>
      )}

      {/* Writing Types */}
      {writingTypes.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">📝 Writings by Type</h2>
          <div className="space-y-4">
            {writingTypes.map((typeData) => {
              const maxCount = Math.max(...writingTypes.map((t) => t.count), 1);
              const percentage = (typeData.count / maxCount) * 100;
              return (
                <div key={typeData.type}>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold capitalize">
                      {typeData.type}
                    </span>
                    <span className="text-gray-600 font-semibold">
                      {typeData.count}
                    </span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Daily Tips & Achievements Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DailyTipsCard />
        <AchievementsPanel />
      </div>
    </div>
  );
}
