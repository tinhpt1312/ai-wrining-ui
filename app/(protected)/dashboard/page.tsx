"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  useWritingStats,
  useAnalyticsStats,
  useTokenUsage,
  useWritings,
} from "@/hooks/useApi";
import { Loading } from "@/components/ui/States";
import { Button } from "@/components/ui/Button";

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className="text-3xl font-semibold text-fg mt-2 tracking-tight">
        {value}
      </p>
      {hint && <p className="text-xs text-subtle mt-1">{hint}</p>}
    </div>
  );
}

export default function Dashboard() {
  const { data: writingStats, isLoading: writingStatsLoading } =
    useWritingStats();
  const { data: analysisStats, isLoading: analysisStatsLoading } =
    useAnalyticsStats();
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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-fg tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted mt-1">
          Welcome back! Here&apos;s your overview.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Writings"
          value={writingStats?.totalWritings || 0}
        />
        <StatCard label="Total Words" value={writingStats?.totalWords || 0} />
        <StatCard
          label="Total Analyses"
          value={analysisStats?.totalAnalyses || 0}
        />
        <StatCard
          label="Token Usage"
          value={`${tokenPercentage}%`}
          hint={
            tokenUsage
              ? `${tokenUsage.used.toLocaleString()} / ${tokenUsage.limit.toLocaleString()}`
              : undefined
          }
        />
      </div>

      {tokenUsage && (
        <div className="bg-surface border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-fg mb-3">
            Daily Token Budget
          </h2>
          <div className="w-full bg-surface-2 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                tokenPercentage > 80
                  ? "bg-error"
                  : tokenPercentage > 50
                    ? "bg-warning"
                    : "bg-success"
              }`}
              style={{ width: `${Math.min(tokenPercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-fg">Recent Writings</h2>
            <Link
              href="/writings"
              className="text-sm text-primary font-medium hover:underline"
            >
              View all
            </Link>
          </div>
          {recentWritings.length > 0 ? (
            <div className="space-y-1.5">
              {recentWritings.map((writing) => (
                <Link
                  key={writing.id}
                  href={`/writings/${writing.id}`}
                  className="block px-3 py-2.5 rounded-lg hover:bg-surface-2 transition-colors"
                >
                  <p className="font-medium text-fg truncate text-sm">
                    {writing.title}
                  </p>
                  <p className="text-xs text-subtle mt-0.5">
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
            <p className="text-muted text-sm py-4">No writings yet</p>
          )}
        </div>

        <div className="bg-surface border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-fg mb-4">Quick Actions</h2>
          <div className="space-y-2.5">
            <Link href="/writings/new" className="block">
              <Button className="w-full">Create New Writing</Button>
            </Link>
            <Link href="/analysis" className="block">
              <Button className="w-full" variant="secondary">
                View Analyses
              </Button>
            </Link>
            <Link href="/writings" className="block">
              <Button className="w-full" variant="secondary">
                Browse Writings
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
