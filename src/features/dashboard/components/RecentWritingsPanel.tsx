import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { ROUTES } from "@/constants/routes.constants";
import type { Writing } from "@/types/api";
import { wordCount } from "@/utils/helpers";
import { dashboardMessages as m } from "@/messages/dashboard";
import { msg } from "@/messages/format";

export function RecentWritingsPanel({
  writings,
}: {
  writings: Writing[];
}) {
  return (
    <section className="card-elevated p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-fg">{m.recentWritings.title}</h2>
        <Link
          href={ROUTES.WRITINGS}
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          {m.recentWritings.viewAll}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {writings.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
          {writings.map((writing) => (
            <li key={writing.id}>
              <Link
                href={ROUTES.writing(writing.id)}
                className="group flex flex-col gap-1 rounded-xl border border-border/60 bg-surface-2/30 px-3 py-3 h-full transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-[0_0_16px_var(--glow-primary)]"
              >
                <p className="font-medium text-fg line-clamp-2 text-sm group-hover:text-primary transition-colors">
                  {writing.title}
                </p>
                <p className="text-xs text-subtle font-mono tabular-nums mt-auto">
                  {msg(m.recentWritings.wordCount, {
                    count: wordCount(writing.content),
                  })}
                </p>
                <ChevronRight className="h-3.5 w-3.5 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted text-sm py-6 text-center">
          {m.recentWritings.empty}
        </p>
      )}
    </section>
  );
}
