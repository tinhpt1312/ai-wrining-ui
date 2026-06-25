import { cn } from "@/lib/utils";

export function SuggestionStatCard({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: number;
  valueClass?: string;
}) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className={cn("mt-2 text-3xl font-semibold text-fg", valueClass)}>
        {value}
      </p>
    </div>
  );
}
