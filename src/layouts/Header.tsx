"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  PenLine,
  LogOut,
  Globe,
  UserCircle,
} from "lucide-react";
import { useAuth } from "@/features/auth";
import { Button } from "@/components/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes.constants";

const navItems = [
  { href: ROUTES.DASHBOARD, label: "Tổng quan", icon: LayoutDashboard },
  { href: ROUTES.WRITINGS, label: "Bài viết", icon: FileText },
  { href: ROUTES.EXPLORE, label: "Khám phá", icon: Globe },
  { href: ROUTES.ANALYSIS, label: "Chấm bài", icon: Sparkles },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push(ROUTES.LOGIN);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link
          href={ROUTES.DASHBOARD}
          className="flex items-center gap-2.5 shrink-0 group"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary ring-1 ring-primary/20 transition-transform group-hover:scale-105">
            <PenLine className="h-4 w-4" />
          </span>
          <span className="text-lg font-bold text-fg group-hover:text-primary transition-colors">
            Viết & Chấm Văn
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 overflow-y-hidden">
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 h-9 inline-flex items-center gap-2 rounded-lg text-sm font-medium transition-all",
                  active
                    ? "bg-primary-soft text-primary font-semibold shadow-sm"
                    : "text-fg/70 hover:text-fg hover:bg-surface-2",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <Link href={ROUTES.WRITING_NEW} className="hidden sm:block">
            <Button size="sm" className="gap-1.5">
              <PenLine className="h-3.5 w-3.5" />
              Viết mới
            </Button>
          </Link>
          <ThemeToggle />
          {user?.username && (
            <Link
              href={ROUTES.PROFILE}
              className="hidden lg:inline-flex items-center gap-1.5 text-sm text-fg/70 hover:text-primary max-w-[8rem] truncate px-1 transition-colors"
              title="Hồ sơ cá nhân"
            >
              <UserCircle className="h-4 w-4 shrink-0" />
              {user.username}
            </Link>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-1.5"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Đăng xuất</span>
          </Button>
        </div>
      </div>

      <nav className="md:hidden flex items-center gap-1 overflow-x-auto overflow-y-hidden scrollbar-none px-4 pb-2 -mt-1">
        {navItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 h-8 inline-flex items-center gap-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                active
                  ? "bg-primary-soft text-primary font-semibold"
                  : "text-fg/70 hover:text-fg hover:bg-surface-2",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
