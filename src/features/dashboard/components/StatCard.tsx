import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const toneStyles = {
  primary: {
    icon: "bg-primary-soft text-primary ring-primary/20",
    accent: "from-primary/5 to-transparent",
  },
  success: {
    icon: "bg-success-soft text-success ring-success/20",
    accent: "from-success/5 to-transparent",
  },
  warning: {
    icon: "bg-warning-soft text-warning ring-warning/20",
    accent: "from-warning/5 to-transparent",
  },
  info: {
    icon: "bg-info-soft text-info ring-info/20",
    accent: "from-info/5 to-transparent",
  },
} as const;

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  tone?: keyof typeof toneStyles;
}) {
  const styles = toneStyles[tone];

  return (
    <div className="card-elevated relative overflow-hidden p-5 group">
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-100",
          styles.accent,
        )}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-fg/80">{label}</p>
          <p className="text-3xl font-semibold text-fg mt-2 tracking-tight">
            {value}
          </p>
          {hint && <p className="text-xs text-subtle mt-1">{hint}</p>}
        </div>
        {Icon && (
          <span
            className={cn(
              "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1",
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
