import Link from "next/link";
import {
  ArrowUpRight,
  Clock,
  FileText,
  PenLine,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { commonMessages } from "@/messages/common";
import { writingsMessages } from "@/messages/writings";
import { ROUTES } from "@/constants/routes.constants";
import {
  formatDate,
  truncateText,
  wordCount,
  getWritingTypeLabel,
  getWritingStatusLabel,
  estimateReadingTime,
} from "@/utils/helpers";
import { cn } from "@/lib/utils";
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
    <article
      className={cn(
        "group stat-card-glow card-elevated flex flex-col h-full transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-[0_0_28px_var(--glow-primary)] hover:border-primary/25",
      )}
    >
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
          <p className="text-sm text-muted leading-relaxed line-clamp-3">
            {truncateText(writing.content, 200)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-subtle font-mono tabular-nums">
          <span className="inline-flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" />
            {wordCount(writing.content)} {commonMessages.words}
          </span>
          <span className="text-border-strong">·</span>
          <span>{estimateReadingTime(writing.content)}</span>
          <span className="text-border-strong">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {formatDate(writing.updatedAt)}
          </span>
        </div>

        <div className="flex items-center gap-2 pt-3 border-t border-border/60">
          <Link href={ROUTES.writing(writing.id)} className="flex-1">
            <Button size="sm" className="gap-1.5 w-full">
              {writingsMessages.card.readButton}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <Button
            size="sm"
            variant="ghost"
            className="text-error hover:text-error hover:bg-error-soft shrink-0"
            onClick={() => onDelete(writing.id)}
            disabled={isDeleting}
            aria-label={writingsMessages.card.deleteAria}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}
