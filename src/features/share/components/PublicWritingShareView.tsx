import Link from "next/link";
import { Clock, FileText, User } from "lucide-react";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { ROUTES } from "@/constants/routes.constants";
import type { PublicShareWriting } from "@/types/api";
import {
  formatDateTime,
  wordCount,
  estimateReadingTime,
  getWritingTypeLabel,
} from "@/utils/helpers";
import { shareMessages as m } from "@/messages/share";
import { msg } from "@/messages/format";

export function PublicWritingShareView({ writing }: { writing: PublicShareWriting }) {
  const authorName = writing.author.fullName || writing.author.username;

  return (
    <article className="space-y-6">
      <section className="page-header-glass relative overflow-hidden p-5 sm:p-7 space-y-4">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
        />

        <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/25 shadow-[0_0_20px_var(--glow-primary)]">
          <FileText className="h-5 w-5" />
        </div>

        <div className="relative space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{getWritingTypeLabel(writing.type)}</Badge>
            <Badge variant="success">{m.writing.publicBadge}</Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-fg tracking-tight leading-tight">
            {writing.title}
          </h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm text-muted font-mono tabular-nums">
            <span className="inline-flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {authorName}
            </span>
            <span>{msg(m.writing.wordCount, { count: wordCount(writing.content) })}</span>
            <span>{estimateReadingTime(writing.content)}</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatDateTime(writing.updatedAt)}
            </span>
          </div>
        </div>
      </section>

      <section className="panel-glass p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-fg mb-4 uppercase tracking-wider">
          {m.writing.contentTitle}
        </h2>
        <div className="rounded-xl border border-border/60 bg-surface-2/50 px-5 py-6 sm:px-7 sm:py-8">
          <div className="prose-content text-base sm:text-lg text-fg leading-[1.85] whitespace-pre-wrap">
            {writing.content}
          </div>
        </div>
      </section>

      <footer className="panel-glass p-5 text-center space-y-3">
        <p className="text-sm text-muted">
          {m.footer.tagline}
        </p>
        <Link href={ROUTES.LOGIN}>
          <Button className="btn-glow-solid">{m.footer.join}</Button>
        </Link>
      </footer>
    </article>
  );
}
