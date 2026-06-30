"use client";

import { useMemo } from "react";
import Link from "next/link";
import { FileText, AlignLeft, Sparkles, Zap, PenLine } from "lucide-react";
import { useWritingStats, useWritings } from "@/features/writings";
import { useAnalyticsStats, useTokenUsage } from "@/features/analysis";
import { Loading } from "@/components/loading";
import { Button } from "@/components/button";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "./StatCard";
import { TokenUsagePanel } from "./TokenUsagePanel";
import { QuickActionsPanel } from "./QuickActionsPanel";
import { ProgressPanel } from "./ProgressPanel";
import { RecentWritingsPanel } from "./RecentWritingsPanel";
import { ROUTES } from "@/constants/routes.constants";
import { dashboardMessages as m } from "@/messages/dashboard";
import { msg } from "@/messages/format";

export function DashboardView() {
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

  const recentWritings = writings?.data || [];

  if (isLoading) {
    return <Loading text={m.loading.overview} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        variant="glass"
        title={m.header.title}
        description={m.header.description}
        actions={
          <Link href={ROUTES.WRITING_NEW}>
            <Button className="gap-2 btn-glow-solid">
              <PenLine className="h-4 w-4" />
              {m.header.newWriting}
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label={m.stats.totalWritings}
          value={writingStats?.totalWritings || 0}
          icon={FileText}
          tone="primary"
        />
        <StatCard
          label={m.stats.totalWords}
          value={(writingStats?.totalWords || 0).toLocaleString("vi-VN")}
          icon={AlignLeft}
          tone="info"
        />
        <StatCard
          label={m.stats.totalAnalyses}
          value={analysisStats?.totalAnalyses || 0}
          icon={Sparkles}
          tone="success"
        />
        <StatCard
          label={m.stats.tokenUsed}
          value={msg(m.stats.tokenPercent, { percent: tokenPercentage })}
          icon={Zap}
          tone="warning"
          hint={
            tokenUsage
              ? msg(m.stats.tokenUsage, {
                  used: tokenUsage.used.toLocaleString("vi-VN"),
                  limit: tokenUsage.limit.toLocaleString("vi-VN"),
                })
              : undefined
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {tokenUsage && (
          <div className="lg:col-span-2">
            <TokenUsagePanel
              tokenUsage={tokenUsage}
              percentage={tokenPercentage}
            />
          </div>
        )}
        <QuickActionsPanel />
      </div>

      <ProgressPanel />

      <RecentWritingsPanel writings={recentWritings} />
    </div>
  );
}
