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
            Báo cáo chấm bài AI
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-fg tracking-tight leading-tight">
            {writing?.title || "Bài viết đã chấm"}
          </h1>
          <p className="text-sm text-muted font-mono tabular-nums">
            Chấm lúc {formatDateTime(analysis.createdAt)}
          </p>
        </div>
      </div>

      <div className="relative flex flex-col sm:flex-row flex-wrap gap-2 pt-4 border-t border-border/60">
        {writing && (
          <>
            <Link
              href={ROUTES.writingRevise(writing.id, analysis.id)}
              className="flex-1 sm:flex-none"
            >
              <Button size="sm" className="gap-1.5 w-full sm:w-auto btn-glow-solid">
                <PenLine className="h-4 w-4" />
                Chữa bài
              </Button>
            </Link>
            <Link
              href={ROUTES.writing(analysis.writingId)}
              className="flex-1 sm:flex-none"
            >
              <Button
                variant="secondary"
                size="sm"
                className="gap-1.5 w-full sm:w-auto"
              >
                <FileText className="h-4 w-4" />
                Bài viết
              </Button>
            </Link>
          </>
        )}
        <Link href={ROUTES.ANALYSIS} className="flex-1 sm:flex-none">
          <Button variant="outline" size="sm" className="gap-1.5 w-full sm:w-auto">
            <ArrowLeft className="h-4 w-4" />
            Danh sách
          </Button>
        </Link>
        <ShareFacebookButton
          shareUrl={buildShareAnalysisUrl(analysis.id)}
          isPublic={writing?.status === "public"}
          className="flex-1 sm:flex-none"
        />
        {analysis.feedbackJson && (
          <ExportReportButton
            analysisId={analysis.id}
            className="flex-1 sm:flex-none"
          />
        )}
        <Button
          variant="destructive"
          size="sm"
          className="gap-1.5 flex-1 sm:flex-none w-full sm:w-auto"
          onClick={onDelete}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
          {isDeleting ? "Đang xóa..." : "Xóa"}
        </Button>
      </div>
    </section>
  );
}
