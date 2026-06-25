"use client";

import type { Analytics } from "@/types/api";
import { formatDateTime } from "@/utils/helpers";
import { getOverallAnalysisScore, scoreTextColor } from "@/features/analysis/utils/score.utils";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScoreProgress({
  analyses,
  highlightAnalysisId,
}: {
  analyses: Analytics[];
  highlightAnalysisId?: string;
}) {
  const sorted = [...analyses]
    .filter((a) => getOverallAnalysisScore(a.feedbackJson) != null)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

  if (sorted.length < 2) return null;

  const scores = sorted.map((a) => ({
    id: a.id,
    score: getOverallAnalysisScore(a.feedbackJson)!,
    date: a.createdAt,
  }));

  const latest = scores[scores.length - 1];
  const previous = scores[scores.length - 2];
  const delta = Math.round((latest.score - previous.score) * 10) / 10;

  return (
    <div className="card-elevated p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-fg">Tiến bộ điểm số</h3>
          <p className="text-xs text-muted mt-0.5">
            {sorted.length} lần chấm · so với lần trước
          </p>
        </div>
        <div className="flex items-center gap-2">
          {delta > 0 ? (
            <TrendingUp className="h-4 w-4 text-success" />
          ) : delta < 0 ? (
            <TrendingDown className="h-4 w-4 text-error" />
          ) : (
            <Minus className="h-4 w-4 text-muted" />
          )}
          <span
            className={cn(
              "text-sm font-bold",
              delta > 0
                ? "text-success"
                : delta < 0
                  ? "text-error"
                  : "text-muted",
            )}
          >
            {delta > 0 ? "+" : ""}
            {delta}
          </span>
        </div>
      </div>

      <div className="flex items-end gap-2 h-20">
        {scores.map((item, index) => {
          const heightPct = (item.score / 10) * 100;
          const isHighlight = item.id === highlightAnalysisId;
          const isLatest = index === scores.length - 1;

          return (
            <div
              key={item.id}
              className="flex-1 flex flex-col items-center gap-1 min-w-0"
              title={`${item.score}/10 — ${formatDateTime(item.date)}`}
            >
              <span
                className={cn(
                  "text-xs font-semibold",
                  scoreTextColor(item.score),
                )}
              >
                {item.score}
              </span>
              <div className="w-full h-14 flex items-end">
                <div
                  className={cn(
                    "w-full rounded-t-md transition-all",
                    isHighlight || isLatest ? "bg-primary" : "bg-surface-2",
                    isHighlight && "ring-2 ring-primary ring-offset-1",
                  )}
                  style={{ height: `${heightPct}%` }}
                />
              </div>
              <span className="text-[10px] text-subtle truncate w-full text-center">
                L{index + 1}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
