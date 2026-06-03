"use client";

import React, { useState } from "react";
import { useAnalyticsStats, useWritingStats } from "@/hooks/useApi";
import DailyTipsCard from "@/components/DailyTipsCard";
import AchievementsPanel from "@/components/AchievementsPanel";

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">(
    "month",
  );

  // Fetch analytics stats
  const {
    data: analyticsStats,
    isLoading: isAnalyticsLoading,
    error: analyticsError,
  } = useAnalyticsStats();

  // Fetch writing stats
  const {
    data: writingStats,
    isLoading: isWritingStatsLoading,
    error: writingStatsError,
  } = useWritingStats();

  const loading = isAnalyticsLoading || isWritingStatsLoading;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse bg-white rounded-lg shadow p-6 h-96"></div>
      </div>
    );
  }

  // Transform writing stats data for display
  const writingTypesList = writingStats
    ? Object.entries(writingStats.byType).map(([type, count]) => ({
        type,
        count: count as number,
      }))
    : [];

  const writingStatusList = writingStats
    ? Object.entries(writingStats.byStatus).map(([status, count]) => ({
        status,
        count: count as number,
      }))
    : [];

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

      {/* Error Messages */}
      {(analyticsError || writingStatsError) && (
        <div className="bg-red-100 text-red-800 p-4 rounded">
          {analyticsError && <p>Failed to load analytics: {analyticsError.message}</p>}
          {writingStatsError && <p>Failed to load writing stats: {writingStatsError.message}</p>}
        </div>
      )}

      {/* Main Stats */}
      {writingStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600">
              {writingStats.totalWritings}
            </div>
            <div className="text-gray-600 text-sm mt-1">Total Writings</div>
          </div>
          <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-purple-600">
              {writingStats.totalWords}
            </div>
            <div className="text-gray-600 text-sm mt-1">Total Words</div>
          </div>
          <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600">
              {writingStats.averageLength.toFixed(0)}
            </div>
            <div className="text-gray-600 text-sm mt-1">Avg Words/Writing</div>
          </div>
          <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-orange-600">
              {analyticsStats?.analysesWithFeedback || 0}
            </div>
            <div className="text-gray-600 text-sm mt-1">With Feedback</div>
          </div>
        </div>
      )}

      {/* Analytics Stats */}
      {analyticsStats && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">📈 Feedback Overview</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded">
              <div className="text-2xl font-bold text-blue-600">
                {analyticsStats.totalAnalyses}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Analyses</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded">
              <div className="text-2xl font-bold text-purple-600">
                {analyticsStats.analysesWithFeedback}
              </div>
              <div className="text-sm text-gray-600 mt-1">With Feedback</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded">
              <div className="text-2xl font-bold text-green-600">
                {analyticsStats.percentageWithFeedback.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600 mt-1">Coverage</div>
            </div>
          </div>
        </div>
      )}

      {/* Writing Types */}
      {writingTypesList.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">📝 Writings by Type</h2>
          <div className="space-y-4">
            {writingTypesList.map((typeData) => {
              const maxCount = Math.max(
                ...writingTypesList.map((t) => t.count),
                1,
              );
              const percentage = (typeData.count / maxCount) * 100;
              return (
                <div key={typeData.type}>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">{typeData.type}</span>
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

      {/* Writing Status */}
      {writingStatusList.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">📌 Writings by Status</h2>
          <div className="space-y-4">
            {writingStatusList.map((statusData) => {
              const maxCount = Math.max(
                ...writingStatusList.map((t) => t.count),
                1,
              );
              const percentage = (statusData.count / maxCount) * 100;
              return (
                <div key={statusData.status}>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold capitalize">
                      {statusData.status}
                    </span>
                    <span className="text-gray-600 font-semibold">
                      {statusData.count}
                    </span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        statusData.status === "draft"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
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
