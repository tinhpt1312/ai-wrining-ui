import Link from "next/link";
import { ArrowUpRight, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/button";
import { ShareFacebookButton } from "@/components/share-button";
import { ROUTES } from "@/constants/routes.constants";
import { formatDateTime, getAnalysisSummary } from "@/utils/helpers";
import { buildShareAnalysisUrl } from "@/utils/share.utils";
import type { Analytics } from "@/types/api";
import {
  getOverallAnalysisScore,
  scoreRingColor,
} from "../utils/score.utils";

export function AnalysisResultCard({
  analysis,
  onDelete,
  isDeleting,
  isPublic = false,
}: {
  analysis: Analytics;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
  isPublic?: boolean;
}) {
  const score = getOverallAnalysisScore(analysis.feedbackJson);
  const summary =
    getAnalysisSummary(analysis.feedbackJson) ||
    "Đã có phản hồi AI cho bài viết này.";

  return (
    <article className="group card-elevated flex flex-col h-full transition-all hover:border-border-strong">
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl border-2 bg-surface-2 ${
              score != null ? scoreRingColor(score) : "border-border text-muted"
            }`}
          >
            {score != null ? (
              <>
                <span className="text-xl font-bold leading-none">{score}</span>
                <span className="text-[10px] text-subtle mt-0.5">/10</span>
              </>
            ) : (
              <SparklesIcon />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <Link href={ROUTES.analysis(analysis.id)}>
              <h3 className="text-base font-semibold text-fg line-clamp-2 group-hover:text-primary transition-colors">
                Báo cáo chấm bài
              </h3>
            </Link>
            <p className="text-xs text-subtle mt-1">
              {formatDateTime(analysis.createdAt)}
            </p>
            <Link
              href={ROUTES.writing(analysis.writingId)}
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
            >
              <FileText className="h-3.5 w-3.5" />
              Xem bài viết gốc
            </Link>
          </div>
        </div>

        <p className="text-sm text-fg leading-relaxed line-clamp-3 flex-1">
          {summary}
        </p>

        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 pt-3 border-t border-border">
          <Link href={ROUTES.analysis(analysis.id)} className="w-full sm:w-auto">
            <Button size="sm" className="gap-1.5 w-full sm:w-auto">
              Chi tiết
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <ShareFacebookButton
            shareUrl={buildShareAnalysisUrl(analysis.id)}
            isPublic={isPublic}
            size="sm"
            className="w-full sm:w-auto"
          />
          <Button
            size="sm"
            variant="ghost"
            className="text-error hover:text-error hover:bg-error-soft gap-1.5 w-full sm:w-auto"
            onClick={() => onDelete(analysis.id)}
            disabled={isDeleting}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Xóa
          </Button>
        </div>
      </div>
    </article>
  );
}

function SparklesIcon() {
  return (
    <svg
      className="h-6 w-6 text-primary opacity-70"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
      />
    </svg>
  );
}
