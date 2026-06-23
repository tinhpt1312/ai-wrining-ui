import Link from "next/link";
import { FileText, User } from "lucide-react";
import { Badge } from "@/components/badge";
import { ROUTES } from "@/constants/routes.constants";
import type { PublicShareWriting } from "@/api/share.service";
import {
  formatDateTime,
  wordCount,
  estimateReadingTime,
  getWritingTypeLabel,
} from "@/utils/helpers";

export function PublicWritingShareView({ writing }: { writing: PublicShareWriting }) {
  const authorName = writing.author.fullName || writing.author.username;

  return (
    <article className="space-y-6">
      <section className="card-elevated p-5 sm:p-6 space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <FileText className="h-5 w-5" />
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{getWritingTypeLabel(writing.type)}</Badge>
            <Badge variant="success">Công khai</Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-fg tracking-tight">
            {writing.title}
          </h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm text-muted">
            <span className="inline-flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {authorName}
            </span>
            <span>{wordCount(writing.content)} chữ</span>
            <span>{estimateReadingTime(writing.content)}</span>
            <span>{formatDateTime(writing.updatedAt)}</span>
          </div>
        </div>
      </section>

      <section className="card-elevated p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-fg mb-4">Nội dung</h2>
        <div className="rounded-xl border border-border bg-surface-2/70 px-5 py-6 sm:px-7 sm:py-8">
          <div className="text-base sm:text-lg text-fg leading-[1.85] whitespace-pre-wrap">
            {writing.content}
          </div>
        </div>
      </section>

      <p className="text-center text-sm text-muted">
        Viết &amp; chấm văn bằng AI —{" "}
        <Link href={ROUTES.LOGIN} className="text-primary hover:underline">
          Tham gia ngay
        </Link>
      </p>
    </article>
  );
}
