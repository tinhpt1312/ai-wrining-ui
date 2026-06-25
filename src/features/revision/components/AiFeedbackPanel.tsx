"use client";

import { Copy, Lightbulb } from "lucide-react";
import { Button } from "@/components/button";
import type { AnalysisFeedback } from "@/types/api";

export function AiFeedbackPanel({
  feedback,
  hasAnalysis,
  onUseSample,
  onCopySample,
}: {
  feedback: AnalysisFeedback;
  hasAnalysis: boolean;
  onUseSample: () => void;
  onCopySample: () => void;
}) {
  if (!hasAnalysis) {
    return (
      <p className="text-sm text-muted">
        Mở từ báo cáo chấm bài để xem gợi ý theo tiêu chí.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {feedback.actionItems && feedback.actionItems.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-subtle mb-2">
            Việc nên làm
          </h3>
          <ul className="space-y-2">
            {feedback.actionItems.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm text-fg leading-relaxed">
                <span className="text-primary shrink-0">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {feedback.areasForImprovement &&
        feedback.areasForImprovement.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-subtle mb-2">
              Cần cải thiện
            </h3>
            <ul className="space-y-2">
              {feedback.areasForImprovement.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm text-fg leading-relaxed">
                  <span className="text-warning shrink-0">!</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      {feedback.sampleWriting && (
        <div className="rounded-lg border border-primary/20 bg-primary-soft/30 p-3 space-y-2">
          <h3 className="text-xs font-semibold text-primary flex items-center gap-1.5">
            <Lightbulb className="h-3.5 w-3.5" />
            Bài mẫu tham khảo
          </h3>
          <p className="text-xs text-muted line-clamp-4">
            {feedback.sampleWriting.slice(0, 200)}…
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="gap-1 text-xs"
              onClick={onUseSample}
            >
              Dùng làm bản nháp
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1 text-xs"
              onClick={onCopySample}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
