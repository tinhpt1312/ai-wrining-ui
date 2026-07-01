import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  PenLine,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/button";
import { ShareFacebookButton } from "@/components/share-button";
import { ExportReportButton } from "@/components/export-button";
import { ROUTES } from "@/constants/routes.constants";
import { formatDateTime } from "@/utils/helpers";
import { buildShareAnalysisUrl } from "@/utils/share.utils";
import { cn } from "@/lib/utils";
import type { Analytics, Writing } from "@/types/api";
import {
  getOverallAnalysisScore,
  scoreRingColor,
  scoreTextColor,
} from "../utils/score.utils";
import { analysisMessages } from "@/messages/analysis";
import { msg } from "@/messages/format";

export function AnalysisDetailHeader({
  analysis,
  writing,
  onDelete,
  isDeleting,
}: {
  analysis: Analytics;
  writing?: Writing | null;
  onDelete: () => void;
  isDeleting?: boolean;
}) {
  const score = getOverallAnalysisScore(analysis.feedbackJson);

  return (
    <section className="page-header-glass relative overflow-hidden p-5 sm:p-7 space-y-5">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative flex flex-col lg:flex-row lg:items-start gap-5">
        <div
          className={cn(
            "flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl border-2 bg-surface-2/80 shadow-[0_0_24px_var(--glow-primary)]",
            score != null ? scoreRingColor(score) : "border-border",
          )}
        >
          {score != null ? (
            <>
              <span
                className={cn(
                  "stat-value text-3xl font-bold leading-none",
                  scoreTextColor(score),
                )}
              >
                {score}
              </span>
              <span className="text-[10px] text-subtle uppercase tracking-wide">
                /10
              </span>
            </>
          ) : (
            <Sparkles className="h-8 w-8 text-primary" />
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <p className="text-xs font-medium text-primary uppercase tracking-wider">
            {analysisMessages.header.reportLabel}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-fg tracking-tight leading-tight">
            {writing?.title || analysisMessages.header.defaultTitle}
          </h1>
          <p className="text-sm text-muted font-mono tabular-nums">
            {msg(analysisMessages.header.gradedAt, {
              datetime: formatDateTime(analysis.createdAt),
            })}
          </p>
        </div>
      </div>

      <div className="relative flex flex-col gap-3 pt-4 border-t border-border/60 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row flex-wrap gap-2">
          {writing && (
            <>
              <Link
                href={ROUTES.writingRevise(writing.id, analysis.id)}
                className="flex-1 sm:flex-none"
              >
                <Button className="gap-1.5 w-full sm:w-auto btn-glow-solid">
                  <PenLine className="h-4 w-4" />
                  {analysisMessages.header.revise}
                </Button>
              </Link>
              <Link
                href={ROUTES.writing(analysis.writingId)}
                className="flex-1 sm:flex-none"
              >
                <Button
                  variant="secondary"
                  className="gap-1.5 w-full sm:w-auto"
                >
                  <FileText className="h-4 w-4" />
                  {analysisMessages.header.writing}
                </Button>
              </Link>
            </>
          )}
          <Link href={ROUTES.ANALYSIS} className="flex-1 sm:flex-none">
            <Button variant="outline" className="gap-1.5 w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4" />
              {analysisMessages.header.list}
            </Button>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:shrink-0">
          {analysis.feedbackJson && (
            <ExportReportButton
              analysisId={analysis.id}
              size="md"
              className="w-full sm:w-auto"
            />
          )}
          <ShareFacebookButton
            shareUrl={buildShareAnalysisUrl(analysis.id)}
            isPublic={writing?.status === "public"}
            className="w-full sm:w-auto"
          />
          <Button
            variant="destructive"
            className="gap-1.5 w-full sm:w-auto"
            onClick={onDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting
              ? analysisMessages.delete.deleting
              : analysisMessages.delete.confirm}
          </Button>
        </div>
      </div>
    </section>
  );
}
