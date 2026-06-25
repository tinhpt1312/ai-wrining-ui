"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronRight } from "lucide-react";
import { Drawer } from "vaul";
import { Button } from "@/components/button";
import { cn } from "@/lib/utils";
import { resolveBreadcrumbs } from "@/lib/layout";
import { SidebarNav } from "./Sidebar";

export function TopBar() {
  const pathname = usePathname();
  const breadcrumbs = resolveBreadcrumbs(pathname);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border/60 bg-surface/70 px-4 backdrop-blur-xl lg:px-6">
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden shrink-0"
          onClick={() => setMobileOpen(true)}
          aria-label="Mở menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 flex-1 items-center gap-1.5 text-sm"
        >
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <span
                key={`${item.label}-${index}`}
                className="inline-flex min-w-0 items-center gap-1.5"
              >
                {index > 0 && (
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-subtle" />
                )}
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="truncate text-muted hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      "truncate font-medium",
                      isLast ? "text-fg" : "text-muted",
                    )}
                  >
                    {item.label}
                  </span>
                )}
              </span>
            );
          })}
        </nav>
      </header>

      <Drawer.Root
        open={mobileOpen}
        onOpenChange={setMobileOpen}
        direction="left"
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-40 bg-bg/80 backdrop-blur-sm" />
          <Drawer.Content className="fixed inset-y-0 left-0 z-50 flex w-[min(280px,88vw)] outline-none">
            <div className="glass-sidebar flex h-full w-full flex-col border-r border-border/60">
              <Drawer.Title className="sr-only">Menu điều hướng</Drawer.Title>
              <SidebarNav onNavigate={() => setMobileOpen(false)} />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}
