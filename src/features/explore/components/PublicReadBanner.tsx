import { Eye } from "lucide-react";
import { exploreMessages } from "@/messages/explore";
import { AuthorChip } from "./AuthorChip";

export function PublicReadBanner({
  author,
}: {
  author?: { username: string; fullName?: string | null };
}) {
  if (!author?.username) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-primary/20 bg-primary-soft/40 px-4 py-3">
      <div className="flex items-start gap-3 min-w-0">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Eye className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-fg">
            {exploreMessages.publicBanner.title}
          </p>
          <p className="text-xs text-muted mt-0.5">
            {exploreMessages.publicBanner.description}
          </p>
        </div>
      </div>
      <AuthorChip author={author} size="sm" linked />
    </div>
  );
}
