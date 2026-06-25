import Link from "next/link";
import { ArrowLeft, BookOpen, CalendarDays } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/avatar";
import { Button } from "@/components/button";
import { ROUTES } from "@/constants/routes.constants";
import { formatDateTime } from "@/utils/helpers";
import type { PublicUserProfile } from "@/types/api";
import {
  getAuthorDisplayName,
  getAuthorInitials,
} from "@/utils/author.utils";

export function UserPublicProfileHeader({
  profile,
}: {
  profile: PublicUserProfile;
}) {
  const displayName = getAuthorDisplayName({
    username: profile.username,
    fullName: profile.fullName,
  });
  const initials = getAuthorInitials(displayName);

  return (
    <section className="page-header-glass relative overflow-hidden p-5 sm:p-7 space-y-5">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
      />

      <div className="relative flex flex-col sm:flex-row sm:items-start gap-4">
        <Avatar className="h-16 w-16 ring-2 ring-primary/30 shadow-[0_0_20px_var(--glow-primary)]">
          <AvatarFallback className="text-lg bg-primary/15 text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-fg tracking-tight truncate">
            {displayName}
          </h1>
          <p className="text-sm text-muted mt-1">@{profile.username}</p>
        </div>

        <Link href={ROUTES.EXPLORE} className="shrink-0">
          <Button variant="outline" size="sm" className="gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            Khám phá
          </Button>
        </Link>
      </div>

      <div className="relative flex flex-wrap gap-2 pt-4 border-t border-border/60">
        <div className="inline-flex items-center gap-2 rounded-lg bg-primary/10 border border-primary/20 px-3 py-1.5 text-sm">
          <BookOpen className="h-3.5 w-3.5 text-primary" />
          <span className="stat-value font-bold text-fg">
            {profile.publicWritingsCount}
          </span>
          <span className="text-muted">bài công khai</span>
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg bg-surface-2/80 border border-border/60 px-3 py-1.5 text-sm text-muted">
          <CalendarDays className="h-3.5 w-3.5" />
          Tham gia {formatDateTime(profile.createdAt)}
        </div>
      </div>
    </section>
  );
}
