import Link from "next/link";
import { CalendarDays, ExternalLink, Shield, UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/avatar";
import { Badge } from "@/components/badge";
import { ROUTES } from "@/constants/routes.constants";
import { formatDateTime } from "@/utils/helpers";
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
    <section className="card-elevated p-5 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <Avatar className="h-16 w-16 ring-2 ring-border">
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-fg tracking-tight truncate">
              {displayName}
            </h1>
            {user.role === "admin" && (
              <Badge variant="success">Admin</Badge>
            )}
          </div>
          <p className="text-sm text-muted">@{user.username}</p>
          {user.email && (
            <p className="text-sm text-subtle truncate">{user.email}</p>
          )}
        </div>

        <Link
          href={ROUTES.userProfile(user.username)}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-medium text-fg hover:bg-surface transition-colors shrink-0"
        >
          <ExternalLink className="h-4 w-4 text-primary" />
          Trang công khai
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
        <div className="inline-flex items-center gap-2 rounded-lg bg-surface-2 px-3 py-1.5 text-sm text-muted">
          <UserRound className="h-3.5 w-3.5" />
          <span className="capitalize">{user.role || "user"}</span>
        </div>
        {user.createdAt && (
          <div className="inline-flex items-center gap-2 rounded-lg bg-surface-2 px-3 py-1.5 text-sm text-muted">
            <CalendarDays className="h-3.5 w-3.5" />
            Tham gia {formatDateTime(user.createdAt)}
          </div>
        )}
        <div className="inline-flex items-center gap-2 rounded-lg bg-surface-2 px-3 py-1.5 text-sm text-muted">
          <Shield className="h-3.5 w-3.5" />
          Bảo mật tài khoản
        </div>
      </div>
    </section>
  );
}
