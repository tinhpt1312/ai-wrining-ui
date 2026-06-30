"use client";

import Link from "next/link";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Flame, Target, TrendingUp } from "lucide-react";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Loading } from "@/components/loading";
import { useProgress } from "@/features/analysis";
import { ROUTES } from "@/constants/routes.constants";
import { formatDate } from "@/utils/helpers";
import { dashboardMessages as m } from "@/messages/dashboard";
import { msg } from "@/messages/format";
import { StatCard } from "./StatCard";

export function ProgressPanel() {
  const { data, isLoading } = useProgress();

  if (isLoading) {
    return <Loading text={m.loading.progress} />;
  }

  if (!data) return null;

  const chartData = data.scoreHistory.map((item) => ({
    label: formatDate(item.date),
    score: item.score,
  }));

  const hasChart = chartData.length >= 2;

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-primary">
            {m.progress.eyebrow}
          </p>
          <h2 className="text-lg font-bold text-fg mt-1">
            {m.progress.title}
          </h2>
        </div>
        <Link href={ROUTES.WRITING_NEW + "?tab=prompts"}>
          <Button variant="outline" size="sm" className="gap-1.5">
            {m.progress.practicePrompts}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label={m.progress.streak}
          value={data.writingStreak}
          icon={Flame}
          tone="warning"
          hint={
            data.writingStreak > 0 ? m.progress.streakActive : m.progress.streakEmpty
          }
        />
        <StatCard
          label={m.progress.graded}
          value={data.totalGraded}
          icon={Target}
          tone="primary"
        />
        <StatCard
          label={m.progress.trend}
          value={
            data.scoreDelta != null
              ? `${data.scoreDelta > 0 ? "+" : ""}${data.scoreDelta}`
              : m.progress.noData
          }
          icon={TrendingUp}
          tone={data.scoreDelta != null && data.scoreDelta >= 0 ? "success" : "info"}
          hint={
            data.averageRecentScore != null
              ? msg(m.progress.recentAverage, { score: data.averageRecentScore })
              : undefined
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card-elevated p-5 sm:p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold text-fg mb-4">{m.progress.chartTitle}</h3>
          {hasChart ? (
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="var(--color-primary, #6366f1)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-56 flex items-center justify-center text-center px-6">
              <p className="text-sm text-muted leading-relaxed">
                {m.progress.chartEmpty}
              </p>
            </div>
          )}
        </div>

        <div className="card-elevated p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-semibold text-fg">{m.progress.criteriaTitle}</h3>
          {data.weakestCriterion ? (
            <div className="rounded-xl border border-warning/30 bg-warning/5 p-4 space-y-2">
              <Badge variant="warning">{m.progress.priorityBadge}</Badge>
              <p className="text-sm font-medium text-fg">
                {data.weakestCriterion.label}
              </p>
              <p className="text-2xl font-bold text-warning">
                {data.weakestCriterion.score}
                <span className="text-sm text-muted font-normal">/10</span>
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted">
              {m.progress.criteriaEmpty}
            </p>
          )}

          <div className="space-y-2">
            {Object.entries(data.criterionAverages).map(([key, score]) => (
              <div
                key={key}
                className="flex items-center justify-between text-sm gap-3"
              >
                <span className="text-muted">
                  {m.progress.criteria[key as keyof typeof m.progress.criteria] ?? key}
                </span>
                <span className="font-medium text-fg tabular-nums">
                  {score != null
                    ? msg(m.progress.scoreOutOf, { score })
                    : m.progress.noData}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
