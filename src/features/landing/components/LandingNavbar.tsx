"use client";

import Link from "next/link";
import { PenLine } from "lucide-react";
import { Button } from "@/components/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ROUTES } from "@/constants/routes.constants";
import { landingMessages as m } from "@/messages/landing";

export function LandingNavbar({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-surface/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href={ROUTES.HOME}
          className="inline-flex items-center gap-2.5 text-sm font-semibold text-fg hover:text-primary transition-colors"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/25 shadow-[0_0_16px_var(--glow-primary)]">
            <PenLine className="h-4 w-4" />
          </span>
          <span className="hidden sm:inline">{m.brand}</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {isAuthenticated ? (
            <Link href={ROUTES.DASHBOARD}>
              <Button className="btn-glow-solid">{m.navbar.dashboard}</Button>
            </Link>
          ) : (
            <>
              <Link href={ROUTES.LOGIN} className="hidden sm:block">
                <Button variant="ghost">{m.navbar.login}</Button>
              </Link>
              <Link href={ROUTES.REGISTER}>
                <Button className="btn-glow-solid">{m.navbar.registerFree}</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
