import Link from "next/link";
import { ArrowLeft, BookOpen, CalendarDays } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/avatar";
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
    <section className="card-elevated p-5 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <Avatar className="h-16 w-16 ring-2 ring-border">
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-fg tracking-tight truncate">
            {displayName}
          </h1>
          <p className="text-sm text-muted mt-0.5">@{profile.username}</p>
        </div>

        <Link
          href={ROUTES.EXPLORE}
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
          Khám phá
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
        <div className="inline-flex items-center gap-2 rounded-lg bg-surface-2 px-3 py-1.5 text-sm text-muted">
          <BookOpen className="h-3.5 w-3.5" />
          <span className="font-medium text-fg">
            {profile.publicWritingsCount}
          </span>
          bài công khai
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg bg-surface-2 px-3 py-1.5 text-sm text-muted">
          <CalendarDays className="h-3.5 w-3.5" />
          Tham gia {formatDateTime(profile.createdAt)}
        </div>
      </div>
    </section>
  );
}
