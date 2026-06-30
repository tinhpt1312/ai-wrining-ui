import Link from "next/link";
import { ArrowUpRight, FileText, PenLine, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/button";
import { ShareFacebookButton } from "@/components/share-button";
import { ROUTES } from "@/constants/routes.constants";
import { formatDateTime, getAnalysisSummary } from "@/utils/helpers";
import { buildShareAnalysisUrl } from "@/utils/share.utils";
import { cn } from "@/lib/utils";
import type { Analytics } from "@/types/api";
import {
  getOverallAnalysisScore,
  scoreRingColor,
  scoreTextColor,
} from "../utils/score.utils";
import { analysisMessages } from "@/messages/analysis";

export function AnalysisResultCard({
  analysis,
  onDelete,
  isDeleting,
  isPublic = false,
}: {
  analysis: Analytics;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
  isPublic?: boolean;
}) {
  const score = getOverallAnalysisScore(analysis.feedbackJson);
  const summary =
    getAnalysisSummary(analysis.feedbackJson) ||
    analysisMessages.card.defaultSummary;

  return (
    <article
      className={cn(
        "group stat-card-glow card-elevated flex flex-col h-full transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-[0_0_28px_var(--glow-primary)] hover:border-primary/25",
      )}
    >
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl border-2 bg-surface-2/80",
              score != null
                ? cn(scoreRingColor(score), "shadow-[0_0_16px_var(--glow-primary)]")
                : "border-border text-muted",
            )}
          >
            {score != null ? (
              <>
                <span
                  className={cn(
                    "stat-value text-xl font-bold leading-none",
                    scoreTextColor(score),
                  )}
                >
                  {score}
                </span>
                <span className="text-[10px] text-subtle mt-0.5">/10</span>
              </>
            ) : (
              <Sparkles className="h-6 w-6 text-primary opacity-80" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <Link href={ROUTES.analysis(analysis.id)}>
              <h3 className="text-base font-semibold text-fg line-clamp-2 group-hover:text-primary transition-colors">
                {analysisMessages.card.reportTitle}
              </h3>
            </Link>
            <p className="text-xs text-subtle mt-1 font-mono tabular-nums">
              {formatDateTime(analysis.createdAt)}
            </p>
            <Link
              href={ROUTES.writing(analysis.writingId)}
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
            >
              <FileText className="h-3.5 w-3.5" />
              {analysisMessages.card.originalWriting}
            </Link>
          </div>
        </div>

        <p className="text-sm text-muted leading-relaxed line-clamp-3 flex-1">
          {summary}
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border/60">
          <Link
            href={ROUTES.writingRevise(analysis.writingId, analysis.id)}
            className="flex-1 sm:flex-none"
          >
            <Button size="sm" variant="secondary" className="gap-1.5 w-full sm:w-auto">
              <PenLine className="h-3.5 w-3.5" />
              {analysisMessages.card.revise}
            </Button>
          </Link>
          <Link href={ROUTES.analysis(analysis.id)} className="flex-1 sm:flex-none">
            <Button size="sm" className="gap-1.5 w-full sm:w-auto">
              {analysisMessages.card.detail}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
          {onDelete && (
            <Button
              size="sm"
              variant="ghost"
              className="text-error hover:text-error hover:bg-error-soft"
              onClick={() => onDelete(analysis.id)}
              disabled={isDeleting}
              aria-label={analysisMessages.delete.ariaLabel}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <ShareFacebookButton
            shareUrl={buildShareAnalysisUrl(analysis.id)}
            isPublic={isPublic}
            size="sm"
            className="w-full sm:w-auto"
          />
        </div>
      </div>
    </article>
  );
}
