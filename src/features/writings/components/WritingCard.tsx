import Link from "next/link";
import {
  ArrowUpRight,
  Clock,
  FileText,
  Pencil,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { ROUTES } from "@/constants/routes.constants";
import {
  formatDate,
  truncateText,
  wordCount,
  getWritingTypeLabel,
  getWritingStatusLabel,
  estimateReadingTime,
} from "@/utils/helpers";
import type { Writing } from "@/types/api";

export function WritingCard({
  writing,
  onDelete,
  isDeleting,
}: {
  writing: Writing;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}) {
  const isPublic = writing.status === "public";

  return (
    <article className="group card-elevated flex flex-col h-full transition-all hover:border-border-strong">
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <Badge className="shrink-0">{getWritingTypeLabel(writing.type)}</Badge>
          <Badge variant={isPublic ? "success" : "warning"}>
            {getWritingStatusLabel(writing.status)}
          </Badge>
        </div>

        <div className="flex-1 space-y-2">
          <Link href={ROUTES.writing(writing.id)} className="block">
            <h3 className="text-lg font-semibold text-fg leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {writing.title}
            </h3>
          </Link>
          <p className="text-sm text-fg leading-relaxed line-clamp-3">
            {truncateText(writing.content, 200)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-subtle">
          <span className="inline-flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" />
            {wordCount(writing.content)} chữ
          </span>
          <span>·</span>
          <span>{estimateReadingTime(writing.content)}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {formatDate(writing.updatedAt)}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-3 border-t border-border">
          <Link href={ROUTES.writing(writing.id)} className="w-full sm:w-auto">
            <Button size="sm" className="gap-1.5 w-full sm:w-auto">
              Đọc bài
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <div className="flex gap-2 w-full sm:w-auto">
            <Link
              href={ROUTES.writingEdit(writing.id)}
              className="flex-1 sm:flex-none"
            >
              <Button
                size="sm"
                variant="secondary"
                className="gap-1.5 w-full sm:w-auto"
              >
                <Pencil className="h-3.5 w-3.5" />
                Sửa
              </Button>
            </Link>
            <Button
              size="sm"
              variant="ghost"
              className="text-error hover:text-error hover:bg-error-soft gap-1.5 flex-1 sm:flex-none"
              onClick={() => onDelete(writing.id)}
              disabled={isDeleting}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Xóa
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
