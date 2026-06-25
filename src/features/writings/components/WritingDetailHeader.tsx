import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  FileText,
  History,
  PenLine,
  Settings2,
} from "lucide-react";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { ShareFacebookButton } from "@/components/share-button";
import { ROUTES } from "@/constants/routes.constants";
import {
  formatDateTime,
  wordCount,
  estimateReadingTime,
  getWritingTypeLabel,
  getWritingStatusLabel,
} from "@/utils/helpers";
import { buildShareWritingUrl } from "@/utils/share.utils";
import { cn } from "@/lib/utils";
import type { Writing } from "@/types/api";

export function WritingDetailHeader({
  writing,
  isOwner,
  latestAnalysisId,
  showJourney,
  revisionCount,
}: {
  writing: Writing;
  isOwner: boolean;
  latestAnalysisId?: string;
  showJourney?: boolean;
  revisionCount?: number;
}) {
  const isPublic = writing.status === "public";

  return (
    <section className="page-header-glass relative overflow-hidden p-5 sm:p-7 space-y-5">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative flex flex-col lg:flex-row lg:items-start gap-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/30 shadow-[0_0_24px_var(--glow-primary)]">
          <FileText className="h-6 w-6" />
        </div>

        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{getWritingTypeLabel(writing.type)}</Badge>
            <Badge variant={isPublic ? "success" : "warning"}>
              {getWritingStatusLabel(writing.status)}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-fg tracking-tight leading-tight">
            {writing.title}
          </h1>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs sm:text-sm text-muted font-mono tabular-nums">
            <span className="inline-flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              {wordCount(writing.content)} chữ
            </span>
            <span>{estimateReadingTime(writing.content)}</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {formatDateTime(writing.updatedAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="relative flex flex-col sm:flex-row flex-wrap gap-2 pt-4 border-t border-border/60">
        {isOwner && latestAnalysisId && (
          <Link
            href={ROUTES.writingRevise(writing.id, latestAnalysisId)}
            className="flex-1 sm:flex-none"
          >
            <Button className="gap-1.5 w-full sm:w-auto btn-glow-solid">
              <PenLine className="h-4 w-4" />
              Chữa bài
            </Button>
          </Link>
        )}
        {isOwner && showJourney && (
          <Link
            href={ROUTES.writingJourney(writing.id)}
            className="flex-1 sm:flex-none"
          >
            <Button
              variant={latestAnalysisId ? "secondary" : "solid"}
              className={cn(
                "gap-1.5 w-full sm:w-auto",
                !latestAnalysisId && "btn-glow-solid",
              )}
            >
              <History className="h-4 w-4" />
              Hành trình
              {revisionCount != null && revisionCount > 0 && (
                <Badge variant="neutral" className="ml-0.5">
                  {revisionCount}
                </Badge>
              )}
            </Button>
          </Link>
        )}
        {isOwner && (
          <>
            <Link
              href={ROUTES.writingEdit(writing.id)}
              className="flex-1 sm:flex-none"
            >
              <Button
                variant="secondary"
                className="gap-1.5 w-full sm:w-auto"
              >
                <Settings2 className="h-4 w-4" />
                Thông tin bài
              </Button>
            </Link>
            <ShareFacebookButton
              shareUrl={buildShareWritingUrl(writing.id)}
              isPublic={isPublic}
              className="flex-1 sm:flex-none"
            />
          </>
        )}
        <Link href={ROUTES.WRITINGS} className="flex-1 sm:flex-none">
          <Button variant="outline" className="gap-1.5 w-full sm:w-auto">
            <ArrowLeft className="h-4 w-4" />
            Danh sách
          </Button>
        </Link>
      </div>
    </section>
  );
}

export function WritingContentPanel({ content }: { content: string }) {
  return (
    <div className="card-elevated overflow-hidden">
      <div className="border-b border-border/60 px-5 sm:px-7 py-4">
        <h2 className="text-sm font-semibold text-fg uppercase tracking-wider">
          Nội dung bài viết
        </h2>
      </div>
      <div className="px-5 py-6 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
        <div className="mx-auto max-w-4xl">
          <div className="text-base sm:text-lg lg:text-xl text-fg leading-[1.9] whitespace-pre-wrap">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}

export function WritingAiSectionHeader({
  onAnalyze,
  isLoading,
}: {
  onAnalyze: () => void;
  isLoading?: boolean;
}) {
  return (
    <div className="card-elevated p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 className="text-sm font-semibold text-fg">Chấm bài AI</h2>
        <p className="text-sm text-muted mt-1">
          Nhận điểm số, nhận xét chi tiết và bài viết mẫu tham khảo.
        </p>
      </div>
      <Button
        onClick={onAnalyze}
        isLoading={isLoading}
        disabled={isLoading}
        className="shrink-0 w-full sm:w-auto gap-2 btn-glow-solid"
      >
        {isLoading ? "Đang chấm..." : "Chấm bài bằng AI"}
      </Button>
    </div>
  );
}
