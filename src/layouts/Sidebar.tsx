"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PenLine, LogOut, UserCircle, ChevronRight } from "lucide-react";
import { useAuth } from "@/features/auth";
import { Button } from "@/components/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/separator";
import { ScrollArea } from "@/components/scroll-area";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes.constants";
import { appMessages } from "@/messages/app";
import { navMessages } from "@/messages/nav";
import { MAIN_NAV_ITEMS, isNavActive } from "./nav.config";

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
        active
          ? "bg-primary/15 text-primary shadow-[0_0_20px_var(--glow-primary)] ring-1 ring-primary/25"
          : "text-muted hover:bg-surface-2/80 hover:text-fg",
      )}
    >
      <span
        className={cn(
          "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
          active ? "bg-primary/20 text-primary" : "bg-surface-2 text-muted group-hover:text-fg",
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex-1">{label}</span>
      {active && <ChevronRight className="h-4 w-4 opacity-60" />}
    </Link>
  );
}

export function SidebarNav({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    onNavigate?.();
    router.push(ROUTES.LOGIN);
  };

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="flex h-16 shrink-0 items-center gap-3 px-4 border-b border-border/60">
        <Link
          href={ROUTES.DASHBOARD}
          onClick={onNavigate}
          className="flex items-center gap-3 group min-w-0"
        >
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30 shadow-[0_0_24px_var(--glow-primary)] transition-transform group-hover:scale-105">
            <PenLine className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-fg truncate group-hover:text-primary transition-colors">
              {appMessages.name}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-subtle font-medium">
              {appMessages.tagline}
            </p>
          </div>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {MAIN_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={isNavActive(pathname, item.href)}
              onNavigate={onNavigate}
            />
          ))}
        </nav>

        <Separator className="my-4 bg-border/60" />

        <Link href={ROUTES.WRITING_NEW} onClick={onNavigate} className="block">
          <Button className="w-full gap-2 shadow-[0_0_24px_var(--glow-primary)]">
            <PenLine className="h-4 w-4" />
            {navMessages.writeNew}
          </Button>
        </Link>
      </ScrollArea>

      <div className="shrink-0 border-t border-border/60 p-3 space-y-2">
        <div className="flex items-center justify-between px-1">
          <ThemeToggle />
          {user?.username && (
            <Link
              href={ROUTES.PROFILE}
              onClick={onNavigate}
              className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-primary max-w-32 truncate transition-colors"
              title={navMessages.profileTitle}
            >
              <UserCircle className="h-4 w-4 shrink-0" />
              {user.username}
            </Link>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-2 text-muted"
        >
          <LogOut className="h-4 w-4" />
          {navMessages.logout}
        </Button>
      </div>
    </div>
  );
}

export function Sidebar({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        "glass-sidebar hidden lg:flex w-[240px] shrink-0 flex-col border-r border-border/60",
        className,
      )}
    >
      <SidebarNav />
    </aside>
  );
}
