import Link from "next/link";
import { ArrowLeft, FileText, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/button";
import { ShareFacebookButton } from "@/components/share-button";
import { ROUTES } from "@/constants/routes.constants";
import { formatDateTime } from "@/utils/helpers";
import { buildShareAnalysisUrl } from "@/utils/share.utils";
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
    <section className="card-elevated p-5 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div
          className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border-2 bg-surface-2 ${
            score != null ? scoreRingColor(score) : "border-border"
          }`}
        >
          {score != null ? (
            <>
              <span
                className={`text-lg font-bold leading-none ${scoreTextColor(score)}`}
              >
                {score}
              </span>
              <span className="text-[10px] text-subtle">/10</span>
            </>
          ) : (
            <Sparkles className="h-6 w-6 text-primary" />
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <p className="text-xs font-medium text-muted uppercase tracking-wide">
            Báo cáo chấm bài AI
          </p>
          <h1 className="text-xl sm:text-2xl font-bold text-fg tracking-tight">
            {writing?.title || "Bài viết đã chấm"}
          </h1>
          <p className="text-sm text-muted">
            Chấm lúc {formatDateTime(analysis.createdAt)}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-2 pt-4 border-t border-border">
        {writing && (
          <Link href={ROUTES.writing(analysis.writingId)} className="flex-1 sm:flex-none">
            <Button variant="secondary" size="sm" className="gap-1.5 w-full sm:w-auto">
              <FileText className="h-4 w-4" />
              Bài viết
            </Button>
          </Link>
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
