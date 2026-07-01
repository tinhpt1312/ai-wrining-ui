import Link from "next/link";
import { ArrowUpRight, BookOpen, Clock } from "lucide-react";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { ROUTES } from "@/constants/routes.constants";
import { truncateText, getWritingTypeLabel } from "@/utils/helpers";
import { cn } from "@/lib/utils";
import { booksMessages } from "@/messages/books";
import { msg } from "@/messages/format";
import type { Book } from "@/types/api";

export function BookCard({ book }: { book: Book }) {
  return (
    <article
      className={cn(
        "group stat-card-glow card-elevated flex flex-col h-full transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-[0_0_28px_var(--glow-primary)] hover:border-primary/25",
      )}
    >
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <Badge className="shrink-0">{booksMessages.category[book.category]}</Badge>
          {book.readingTimeMinutes ? (
            <span className="inline-flex items-center gap-1 text-xs text-subtle font-mono tabular-nums">
              <Clock className="h-3.5 w-3.5" />
              {msg(booksMessages.card.readingTime, {
                minutes: book.readingTimeMinutes,
              })}
            </span>
          ) : null}
        </div>

        <div className="flex-1 space-y-2">
          <Link href={ROUTES.book(book.id)} className="block">
            <h3 className="text-lg font-semibold text-fg leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {book.title}
            </h3>
          </Link>
          <p className="text-sm text-muted">{book.author}</p>
          {book.description ? (
            <p className="text-sm text-muted leading-relaxed line-clamp-3">
              {truncateText(book.description, 160)}
            </p>
          ) : null}
        </div>

        {book.writingTypes.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {book.writingTypes.slice(0, 2).map((type) => (
              <span
                key={type}
                className="inline-flex items-center gap-1 rounded-md bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-muted"
              >
                <BookOpen className="h-3 w-3" />
                {getWritingTypeLabel(type)}
              </span>
            ))}
          </div>
        ) : null}

        <div className="flex items-center justify-end pt-4 border-t border-border/60">
          <Link href={ROUTES.book(book.id)}>
            <Button size="sm" variant="secondary" className="gap-1.5 shrink-0">
              {booksMessages.card.viewButton}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
