import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/avatar";
import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";
import {
  getAuthorDisplayName,
  getAuthorInitials,
} from "@/utils/author.utils";

export function AuthorChip({
  author,
  size = "md",
  linked = true,
  className,
}: {
  author?: { username: string; fullName?: string | null };
  size?: "sm" | "md";
  linked?: boolean;
  className?: string;
}) {
  if (!author?.username) return null;

  const displayName = getAuthorDisplayName(author);
  const initials = getAuthorInitials(displayName);
  const avatarSize = size === "sm" ? "h-8 w-8" : "h-9 w-9";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  const content = (
    <>
      <Avatar className={avatarSize}>
        <AvatarFallback className={size === "sm" ? "text-xs" : "text-sm"}>
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className={cn("font-medium text-fg truncate", textSize)}>
          {displayName}
        </p>
        <p className="text-xs text-subtle truncate">@{author.username}</p>
      </div>
    </>
  );

  const wrapperClass = cn(
    "inline-flex items-center gap-2.5 min-w-0 rounded-xl p-1.5 -m-1.5 transition-colors",
    linked && "hover:bg-surface-2",
    className,
  );

  if (linked) {
    return (
      <Link href={ROUTES.userProfile(author.username)} className={wrapperClass}>
        {content}
      </Link>
    );
  }

  return <div className={wrapperClass}>{content}</div>;
}
