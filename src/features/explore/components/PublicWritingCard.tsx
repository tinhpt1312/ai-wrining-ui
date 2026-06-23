import Link from "next/link";
import { ArrowUpRight, Clock, FileText } from "lucide-react";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { ROUTES } from "@/constants/routes.constants";
import {
  formatDate,
  truncateText,
  wordCount,
  getWritingTypeLabel,
  estimateReadingTime,
} from "@/utils/helpers";
import type { Writing } from "@/types/api";
import { AuthorChip } from "./AuthorChip";

export function PublicWritingCard({ writing }: { writing: Writing }) {
  return (
    <article className="group card-elevated flex flex-col h-full transition-all hover:border-border-strong">
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <Badge className="shrink-0">{getWritingTypeLabel(writing.type)}</Badge>
          <span className="inline-flex items-center gap-1 text-xs text-subtle">
            <Clock className="h-3.5 w-3.5" />
            {formatDate(writing.updatedAt)}
          </span>
        </div>

        <div className="flex-1 space-y-2">
          <Link href={ROUTES.writing(writing.id)} className="block">
            <h3 className="text-lg font-semibold text-fg leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {writing.title}
            </h3>
          </Link>
          <p className="text-sm text-fg leading-relaxed line-clamp-4">
            {truncateText(writing.content, 220)}
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-subtle">
          <span className="inline-flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" />
            {wordCount(writing.content)} chữ
          </span>
          <span>·</span>
          <span>{estimateReadingTime(writing.content)}</span>
        </div>

        <div className="flex items-center justify-between gap-3 pt-4 border-t border-border">
          <AuthorChip author={writing.author} size="sm" />
          <Link href={ROUTES.writing(writing.id)}>
            <Button size="sm" variant="secondary" className="gap-1.5 shrink-0">
              Đọc bài
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
