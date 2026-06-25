import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const toneStyles = {
  primary: {
    icon: "bg-primary/15 text-primary ring-primary/30 shadow-[0_0_16px_var(--glow-primary)]",
    value: "text-primary",
    accent: "from-primary/10 via-primary/5 to-transparent",
    border: "hover:border-primary/30",
  },
  success: {
    icon: "bg-success-soft text-success ring-success/25",
    value: "text-success",
    accent: "from-success/10 to-transparent",
    border: "hover:border-success/30",
  },
  warning: {
    icon: "bg-warning-soft text-warning ring-warning/25",
    value: "text-warning",
    accent: "from-warning/10 to-transparent",
    border: "hover:border-warning/30",
  },
  info: {
    icon: "bg-info-soft text-info ring-info/25",
    value: "text-info",
    accent: "from-info/10 to-transparent",
    border: "hover:border-info/30",
  },
} as const;

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "primary",
  className,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  tone?: keyof typeof toneStyles;
  className?: string;
}) {
  const styles = toneStyles[tone];

  return (
    <div
      className={cn(
        "stat-card-glow card-elevated group relative p-5 transition-all duration-200",
        "hover:shadow-[0_0_28px_var(--glow-primary)] hover:-translate-y-0.5",
        styles.border,
        className,
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60",
          styles.accent,
        )}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-subtle">
            {label}
          </p>
          <p
            className={cn(
              "stat-value text-3xl sm:text-4xl font-bold mt-2 tracking-tight",
              styles.value,
            )}
          >
            {value}
          </p>
          {hint && (
            <p className="text-xs text-muted mt-1.5 font-mono tabular-nums">
              {hint}
            </p>
          )}
        </div>
        {Icon && (
          <span
            className={cn(
              "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 transition-transform group-hover:scale-105",
              styles.icon,
            )}
          >
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>
    </div>
  );
}
