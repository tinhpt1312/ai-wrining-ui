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
import { StatCard } from "./StatCard";

const CRITERIA_LABELS: Record<string, string> = {
  structure: "Bố cục",
  clarity: "Diễn đạt",
  tone: "Giọng điệu",
  coherence: "Liên kết",
};

export function ProgressPanel() {
  const { data, isLoading } = useProgress();

  if (isLoading) {
    return <Loading text="Đang tải tiến độ học viết..." />;
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
            Tiến bộ học viết
          </p>
          <h2 className="text-lg font-bold text-fg mt-1">
            Theo dõi điểm số và thói quen luyện tập
          </h2>
        </div>
        <Link href={ROUTES.WRITING_NEW + "?tab=prompts"}>
          <Button variant="outline" size="sm" className="gap-1.5">
            Luyện với đề gợi ý
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Chuỗi ngày viết"
          value={data.writingStreak}
          icon={Flame}
          tone="warning"
          hint={data.writingStreak > 0 ? "Ngày liên tiếp có hoạt động" : "Hãy viết hôm nay"}
        />
        <StatCard
          label="Lần chấm có điểm"
          value={data.totalGraded}
          icon={Target}
          tone="primary"
        />
        <StatCard
          label="Xu hướng điểm"
          value={
            data.scoreDelta != null
              ? `${data.scoreDelta > 0 ? "+" : ""}${data.scoreDelta}`
              : "—"
          }
          icon={TrendingUp}
          tone={data.scoreDelta != null && data.scoreDelta >= 0 ? "success" : "info"}
          hint={
            data.averageRecentScore != null
              ? `TB gần đây: ${data.averageRecentScore}/10`
              : undefined
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card-elevated p-5 sm:p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold text-fg mb-4">Biểu đồ điểm qua các lần chấm</h3>
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
                Chấm ít nhất 2 bài để xem biểu đồ tiến bộ. Hãy tạo bài mới và chấm bằng AI.
              </p>
            </div>
          )}
        </div>

        <div className="card-elevated p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-semibold text-fg">Tiêu chí cần luyện thêm</h3>
          {data.weakestCriterion ? (
            <div className="rounded-xl border border-warning/30 bg-warning/5 p-4 space-y-2">
              <Badge variant="warning">Ưu tiên luyện tập</Badge>
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
              Chưa đủ dữ liệu chấm bài. Hãy chấm bài để nhận phân tích tiêu chí.
            </p>
          )}

          <div className="space-y-2">
            {Object.entries(data.criterionAverages).map(([key, score]) => (
              <div
                key={key}
                className="flex items-center justify-between text-sm gap-3"
              >
                <span className="text-muted">{CRITERIA_LABELS[key] ?? key}</span>
                <span className="font-medium text-fg tabular-nums">
                  {score != null ? `${score}/10` : "—"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
