"use client";

import Link from "next/link";
import { TrendingDown, TrendingUp, Minus, ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants/routes.constants";
import { scoreTextColor } from "@/features/analysis/utils/score.utils";
import { cn } from "@/lib/utils";

export function AnalysisScoreCompare({
  currentScore,
  previousScore,
  previousAnalysisId,
  revisionNumber,
}: {
  currentScore: number;
  previousScore?: number | null;
  previousAnalysisId?: string | null;
  revisionNumber?: number | null;
}) {
  if (previousScore == null) return null;

  const delta = Math.round((currentScore - previousScore) * 10) / 10;

  return (
    <section className="panel-glass p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-subtle uppercase tracking-wider">
            So sánh lần chấm
            {revisionNumber != null ? ` #${revisionNumber}` : ""}
          </p>
          <div className="flex items-center gap-4 mt-3">
            <div className="text-center px-3 py-2 rounded-xl bg-surface-2/60 border border-border/60">
              <p className="text-[10px] uppercase tracking-wide text-subtle">
                Trước
              </p>
              <p
                className={cn(
                  "stat-value text-2xl font-bold mt-0.5",
                  scoreTextColor(previousScore),
                )}
              >
                {previousScore}
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-primary shrink-0" />
            <div className="text-center px-3 py-2 rounded-xl bg-primary/10 border border-primary/25 shadow-[0_0_16px_var(--glow-primary)]">
              <p className="text-[10px] uppercase tracking-wide text-primary/80">
                Hiện tại
              </p>
              <p
                className={cn(
                  "stat-value text-2xl font-bold mt-0.5",
                  scoreTextColor(currentScore),
                )}
              >
                {currentScore}
              </p>
            </div>
            <div
              className={cn(
                "flex items-center gap-1.5 ml-1 px-3 py-2 rounded-full border",
                delta > 0
                  ? "border-success/30 bg-success-soft/50 text-success"
                  : delta < 0
                    ? "border-error/30 bg-error-soft/50 text-error"
                    : "border-border bg-surface-2 text-muted",
              )}
            >
              {delta > 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : delta < 0 ? (
                <TrendingDown className="h-4 w-4" />
              ) : (
                <Minus className="h-4 w-4" />
              )}
              <span className="stat-value text-sm font-bold">
                {delta > 0 ? "+" : ""}
                {delta}
              </span>
            </div>
          </div>
        </div>
        {previousAnalysisId && (
          <Link
            href={ROUTES.analysis(previousAnalysisId)}
            className="text-sm font-medium text-primary hover:underline shrink-0"
          >
            Xem lần chấm trước →
          </Link>
        )}
      </div>
    </section>
  );
}
