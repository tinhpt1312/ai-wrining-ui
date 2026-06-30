import Link from "next/link";
import { CalendarDays, ExternalLink, Shield, UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/avatar";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { ROUTES } from "@/constants/routes.constants";
import { formatDateTime } from "@/utils/helpers";
import { profileMessages } from "@/messages/profile";
import { msg } from "@/messages/format";
import type { User } from "@/types/api";
import {
  getAuthorDisplayName,
  getAuthorInitials,
} from "@/utils/author.utils";

export function ProfilePageHeader({ user }: { user: User }) {
  const displayName = getAuthorDisplayName({
    username: user.username,
    fullName: user.fullName,
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

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-bold text-fg tracking-tight truncate">
              {displayName}
            </h2>
            {user.role === "admin" && (
              <Badge variant="success">{profileMessages.header.adminBadge}</Badge>
            )}
          </div>
          <p className="text-sm text-muted">@{user.username}</p>
          {user.email && (
            <p className="text-sm text-subtle truncate">{user.email}</p>
          )}
        </div>

        <Link href={ROUTES.userProfile(user.username)} className="shrink-0">
          <Button variant="secondary" size="sm" className="gap-2">
            <ExternalLink className="h-4 w-4" />
            {profileMessages.header.publicPageButton}
          </Button>
        </Link>
      </div>

      <div className="relative flex flex-wrap gap-2 pt-4 border-t border-border/60">
        <div className="inline-flex items-center gap-2 rounded-lg bg-surface-2/80 border border-border/60 px-3 py-1.5 text-sm text-muted">
          <UserRound className="h-3.5 w-3.5" />
          <span className="capitalize">{user.role || "user"}</span>
        </div>
        {user.createdAt && (
          <div className="inline-flex items-center gap-2 rounded-lg bg-surface-2/80 border border-border/60 px-3 py-1.5 text-sm text-muted">
            <CalendarDays className="h-3.5 w-3.5" />
            {msg(profileMessages.header.joinedAt, {
              date: formatDateTime(user.createdAt),
            })}
          </div>
        )}
        <div className="inline-flex items-center gap-2 rounded-lg bg-primary/10 border border-primary/20 px-3 py-1.5 text-sm text-primary">
          <Shield className="h-3.5 w-3.5" />
          {profileMessages.header.securityBadge}
        </div>
      </div>
    </section>
  );
}
