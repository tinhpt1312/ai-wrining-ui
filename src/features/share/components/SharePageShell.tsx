import Link from "next/link";
import { PenLine } from "lucide-react";
import { ROUTES } from "@/constants/routes.constants";

export function SharePageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full flex flex-col">
      <header className="border-b border-border bg-surface/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link
            href={ROUTES.LOGIN}
            className="inline-flex items-center gap-2 text-sm font-semibold text-fg hover:text-primary transition-colors"
          >
            <PenLine className="h-4 w-4 text-primary" />
            Viết &amp; Chấm Văn
          </Link>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}
