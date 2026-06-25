import type { FeedbackCriterion } from "@/types/api";
import { scoreBgColor, scoreTextColor } from "../../utils/score.utils";

export function CriterionCard({
  label,
  criterion,
}: {
  label: string;
  criterion: FeedbackCriterion;
}) {
  const pct = Math.round((Math.min(Math.max(criterion.score, 0), 10) / 10) * 100);

  return (
    <div className="panel-glass p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-fg">{label}</h3>
        <span className={`stat-value text-sm font-bold ${scoreTextColor(criterion.score)}`}>
          {criterion.score}/10
        </span>
      </div>
      <div className="w-full bg-surface-2 rounded-full h-1.5 overflow-hidden mt-2">
        <div
          className={`h-full rounded-full transition-all ${scoreBgColor(criterion.score)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {criterion.feedback && (
        <p className="text-sm text-muted mt-3 leading-relaxed">{criterion.feedback}</p>
      )}
      {criterion.suggestions?.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {criterion.suggestions.map((s, i) => (
            <li key={i} className="flex gap-2 text-sm text-fg leading-relaxed">
              <span className="text-primary shrink-0">→</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
