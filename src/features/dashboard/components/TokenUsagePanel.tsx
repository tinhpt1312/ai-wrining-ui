"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TokenUsage } from "@/types/api";

function usageTone(percentage: number) {
  if (percentage > 80) return { stroke: "var(--error)", label: "text-error" };
  if (percentage > 50) return { stroke: "var(--warning)", label: "text-warning" };
  return { stroke: "var(--success)", label: "text-success" };
}

export function TokenUsagePanel({
  tokenUsage,
  percentage,
}: {
  tokenUsage: TokenUsage;
  percentage: number;
}) {
  const tone = usageTone(percentage);
  const chartData = [
    { name: "used", value: tokenUsage.used },
    { name: "remaining", value: Math.max(tokenUsage.limit - tokenUsage.used, 0) },
  ];

  return (
    <section className="card-elevated p-5 sm:p-6 h-full flex flex-col">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-warning-soft text-warning ring-1 ring-warning/20">
              <Zap className="h-4 w-4" />
            </span>
            <h2 className="text-sm font-semibold text-fg">Hạn mức token hôm nay</h2>
          </div>
          <p className="text-xs text-muted mt-2">
            Làm mới{" "}
            {new Date(tokenUsage.resetAt).toLocaleDateString("vi-VN", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <p className={cn("stat-value text-3xl font-bold", tone.label)}>
          {percentage}%
        </p>
      </div>

      <div className="flex flex-1 flex-col sm:flex-row items-center gap-6">
        <div className="relative h-36 w-36 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={46}
                outerRadius={62}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                stroke="none"
              >
                <Cell fill={tone.stroke} />
                <Cell fill="var(--surface-2)" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="stat-value text-lg font-bold text-fg">
              {tokenUsage.used.toLocaleString("vi-VN")}
            </span>
            <span className="text-[10px] text-subtle uppercase tracking-wide">
              đã dùng
            </span>
          </div>
        </div>

        <div className="flex-1 w-full space-y-3">
          <div className="w-full bg-surface-2 rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: tone.stroke,
                boxShadow: `0 0 12px ${tone.stroke}`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted font-mono tabular-nums">
            <span>{tokenUsage.used.toLocaleString("vi-VN")} token</span>
            <span>{tokenUsage.limit.toLocaleString("vi-VN")} token</span>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Token dùng cho chấm bài AI và gợi ý sửa. Dùng hết hạn mức thì chờ
            đến thời điểm làm mới.
          </p>
        </div>
      </div>
    </section>
  );
}
