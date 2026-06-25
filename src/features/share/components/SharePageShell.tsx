"use client";

import Link from "next/link";
import { PenLine } from "lucide-react";
import { GridBackground } from "@/components/ui/grid-background";
import { ThemeToggle } from "@/components/theme-toggle";
import { ROUTES } from "@/constants/routes.constants";

export function SharePageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-full flex flex-col">
      <GridBackground />

      <header className="sticky top-0 z-20 border-b border-border/60 bg-surface/70 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link
            href={ROUTES.HOME}
            className="inline-flex items-center gap-2 text-sm font-semibold text-fg hover:text-primary transition-colors"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/25 shadow-[0_0_12px_var(--glow-primary)]">
              <PenLine className="h-4 w-4" />
            </span>
            Viết &amp; Chấm Văn
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="relative flex-1 mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}
