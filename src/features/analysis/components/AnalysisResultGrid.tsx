import type { Analytics } from "@/types/api";
import { AnalysisResultCard } from "./AnalysisResultCard";

export function AnalysisResultGrid({
  analyses,
  onDelete,
  isDeleting,
}: {
  analyses: Analytics[];
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {analyses.map((analysis) => (
        <AnalysisResultCard
          key={analysis.id}
          analysis={analysis}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
}
