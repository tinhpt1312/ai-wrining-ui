import {
  FileEdit,
  Globe,
  History,
  Lightbulb,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { landingMessages as m } from "@/messages/landing";

const FEATURE_ICONS: LucideIcon[] = [
  FileEdit,
  Sparkles,
  Lightbulb,
  History,
  Globe,
  Sparkles,
];

export function LandingFeatures() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">
          {m.features.eyebrow}
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-fg sm:text-4xl">
          {m.features.title}
        </h2>
        <p className="mt-4 text-muted leading-relaxed">
          {m.features.description}
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {m.features.items.map((feature, index) => {
          const Icon = FEATURE_ICONS[index];
          return (
            <article
              key={feature.title}
              className={cn(
                "stat-card-glow panel-glass p-5 sm:p-6 transition-all duration-200",
                "hover:-translate-y-0.5 hover:shadow-[0_0_28px_var(--glow-primary)] hover:border-primary/25",
              )}
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/25 shadow-[0_0_16px_var(--glow-primary)]">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-fg">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {feature.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
