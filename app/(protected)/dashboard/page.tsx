"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  useWritingStats,
  useAnalysisStats,
  useTokenUsage,
  useWritings,
} from "@/hooks/useApi";
import { Loading, Error as ErrorState } from "@/components/ui/States";
import { Button } from "@/components/ui/Button";

export default function Dashboard() {
  const { data: writingStats, isLoading: writingStatsLoading } =
    useWritingStats();
  const { data: analysisStats, isLoading: analysisStatsLoading } =
    useAnalysisStats();
  const { data: tokenUsage, isLoading: tokenUsageLoading } = useTokenUsage();
  const { data: writings, isLoading: writingsLoading } = useWritings({
    limit: 5,
  });

  const isLoading =
    writingStatsLoading ||
    analysisStatsLoading ||
    tokenUsageLoading ||
    writingsLoading;

  const tokenPercentage = useMemo(() => {
    if (!tokenUsage) return 0;
    return Math.round((tokenUsage.used / tokenUsage.limit) * 100);
  }, [tokenUsage]);

  const recentWritings = useMemo(() => {
    return writings?.data || [];
  }, [writings]);

  if (isLoading) {
    return <Loading text="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here's your overview
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Writing Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Writings
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {writingStats?.totalWritings || 0}
                </p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Word Count Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Words</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {writingStats?.totalWords || 0}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C6.228 6.228 2 10.456 2 15.5S6.228 24 12 24s10-4.228 10-9.5S17.772 6.253 12 6.253z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Analysis Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Analyses
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {analysisStats?.totalAnalyses || 0}
                </p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Token Usage */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Token Usage</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {tokenPercentage}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {tokenUsage?.used}/{tokenUsage?.limit} tokens
                </p>
              </div>
              <div className="bg-orange-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Token Usage Progress Bar */}
        {tokenUsage && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Daily Token Budget
            </h2>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  tokenPercentage > 80
                    ? "bg-red-500"
                    : tokenPercentage > 50
                      ? "bg-orange-500"
                      : "bg-green-500"
                }`}
                style={{ width: `${tokenPercentage}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Used: {tokenUsage.used.toLocaleString()} tokens</span>
              <span>
                Resets:{" "}
                {new Date(tokenUsage.resetAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        )}

        {/* Recent Writings & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Writings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Writings
            </h2>
            {recentWritings.length > 0 ? (
              <div className="space-y-3">
                {recentWritings.map((writing) => (
                  <Link
                    key={writing.id}
                    href={`/writings/${writing.id}`}
                    className="block p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <p className="font-medium text-gray-900 truncate">
                      {writing.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(writing.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No writings yet</p>
            )}
            <Link href="/writings">
              <Button className="w-full mt-4" variant="secondary">
                View All Writings
              </Button>
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link href="/writings/new">
                <Button className="w-full">Create New Writing</Button>
              </Link>
              <Link href="/analysis">
                <Button className="w-full" variant="secondary">
                  View All Analyses
                </Button>
              </Link>
              <Link href="/writings">
                <Button className="w-full" variant="secondary">
                  Browse Writings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
