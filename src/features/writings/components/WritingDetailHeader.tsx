import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  FileText,
  Lightbulb,
  Pencil,
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
import type { Writing } from "@/types/api";

export function WritingDetailHeader({
  writing,
  isOwner,
}: {
  writing: Writing;
  isOwner: boolean;
}) {
  const isPublic = writing.status === "public";

  return (
    <section className="card-elevated p-5 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <FileText className="h-5 w-5" />
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{getWritingTypeLabel(writing.type)}</Badge>
            <Badge variant={isPublic ? "success" : "warning"}>
              {getWritingStatusLabel(writing.status)}
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-fg tracking-tight">
            {writing.title}
          </h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm text-muted">
            <span className="inline-flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" />
              {wordCount(writing.content)} chữ
            </span>
            <span>{estimateReadingTime(writing.content)}</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatDateTime(writing.updatedAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-2 pt-4 border-t border-border">
        {isOwner && (
          <>
            <Link href={ROUTES.writingEdit(writing.id)} className="flex-1 sm:flex-none">
              <Button className="gap-1.5 w-full sm:w-auto">
                <Pencil className="h-4 w-4" />
                Sửa bài
              </Button>
            </Link>
            <Link
              href={ROUTES.writingSuggestions(writing.id)}
              className="flex-1 sm:flex-none"
            >
              <Button variant="secondary" className="gap-1.5 w-full sm:w-auto">
                <Lightbulb className="h-4 w-4" />
                Gợi ý sửa
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
    <div className="card-elevated p-5 sm:p-6">
      <h2 className="text-sm font-semibold text-fg mb-4">Nội dung</h2>
      <div className="rounded-xl border border-border bg-surface-2/70 px-5 py-6 sm:px-7 sm:py-8 shadow-inner">
        <div className="text-base sm:text-lg text-fg leading-[1.85] whitespace-pre-wrap">
          {content}
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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
        className="shrink-0 w-full sm:w-auto"
      >
        {isLoading ? "Đang chấm..." : "Chấm bài bằng AI"}
      </Button>
    </div>
  );
}
