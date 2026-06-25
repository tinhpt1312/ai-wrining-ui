import Link from "next/link";
import { FileText, Sparkles, User } from "lucide-react";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { ROUTES } from "@/constants/routes.constants";
import type { PublicShareAnalysis } from "@/api/share.service";
import {
  formatDateTime,
  getAnalysisSummary,
  getWritingTypeLabel,
} from "@/utils/helpers";
import { cn } from "@/lib/utils";
import {
  getOverallAnalysisScore,
  scoreRingColor,
  scoreTextColor,
} from "@/features/analysis/utils/score.utils";

export function PublicAnalysisShareView({
  analysis,
}: {
  analysis: PublicShareAnalysis;
}) {
  const { writing } = analysis;
  const score = getOverallAnalysisScore(analysis.feedbackJson);
  const summary = getAnalysisSummary(analysis.feedbackJson);
  const authorName = writing.author.fullName || writing.author.username;

  return (
    <article className="space-y-6">
      <section className="page-header-glass relative overflow-hidden p-5 sm:p-7 space-y-5">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl"
        />

        <div className="relative flex flex-col sm:flex-row sm:items-start gap-4">
          <div
            className={cn(
              "flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl border-2 bg-surface-2/80 shadow-[0_0_24px_var(--glow-primary)]",
              score != null ? scoreRingColor(score) : "border-border",
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
                <span className="text-[10px] text-subtle">/10</span>
              </>
            ) : (
              <Sparkles className="h-6 w-6 text-primary" />
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-2">
            <p className="text-xs font-medium text-muted uppercase tracking-wider">
              Kết quả chấm bài AI
            </p>
            <h1 className="text-xl sm:text-2xl font-bold text-fg tracking-tight leading-tight">
              {writing.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted">
              <Badge>{getWritingTypeLabel(writing.type)}</Badge>
              <span className="inline-flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                {authorName}
              </span>
              <span>Chấm lúc {formatDateTime(analysis.createdAt)}</span>
            </div>
          </div>
        </div>

        {summary && (
          <div className="relative rounded-xl border border-border/60 bg-surface-2/50 p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-fg mb-2">
              Nhận xét tổng quan
            </h2>
            <p className="text-sm sm:text-base text-fg leading-relaxed whitespace-pre-wrap">
              {summary}
            </p>
          </div>
        )}

        <Link href={ROUTES.shareWriting(writing.id)}>
          <Button variant="secondary" size="sm" className="gap-1.5">
            <FileText className="h-4 w-4" />
            Đọc toàn bộ bài viết
          </Button>
        </Link>
      </section>

      <footer className="panel-glass p-5 text-center space-y-3">
        <p className="text-sm text-muted">
          Viết &amp; chấm văn bằng AI — tạo bài, nhận phản hồi và cải thiện từng câu.
        </p>
        <Link href={ROUTES.LOGIN}>
          <Button className="btn-glow-solid">Tham gia ngay</Button>
        </Link>
      </footer>
    </article>
  );
}
