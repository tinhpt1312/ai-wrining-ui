"use client";

import { useMemo } from "react";
import { diffWords } from "diff";
import { GitCompare, Lightbulb } from "lucide-react";
import type { AnalysisFeedback } from "@/types/api";
import { TextDiffView } from "@/features/revision";
import { cn } from "@/lib/utils";

function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function getSectionAnnotation(
  index: number,
  total: number,
  feedback?: AnalysisFeedback,
): string {
  const pickSuggestion = (criterion?: {
    feedback?: string;
    suggestions?: string[];
  }) =>
    criterion?.suggestions?.[0] ||
    criterion?.feedback ||
    undefined;

  if (index === 0) {
    return (
      pickSuggestion(feedback?.structure) ||
      "Đoạn mở bài mẫu thường nêu luận điểm hoặc vấn đề rõ ràng hơn."
    );
  }

  if (index === total - 1) {
    return (
      pickSuggestion(feedback?.coherence) ||
      "Kết bài mẫu tổng kết ý chính và có câu chốt mạch lạc."
    );
  }

  return (
    pickSuggestion(feedback?.clarity) ||
    pickSuggestion(feedback?.tone) ||
    "Bài mẫu diễn đạt cụ thể hơn và có liên kết giữa các ý."
  );
}

function ParagraphDiffSummary({
  original,
  sample,
}: {
  original: string;
  sample: string;
}) {
  const parts = useMemo(
    () => diffWords(original || "", sample || ""),
    [original, sample],
  );

  const added = parts.filter((part) => part.added).length;
  const removed = parts.filter((part) => part.removed).length;

  if (!original && sample) {
    return (
      <p className="text-xs text-muted">
        Bạn chưa có đoạn tương ứng — bài mẫu có thêm nội dung ở phần này.
      </p>
    );
  }

  if (added === 0 && removed === 0) {
    return (
      <p className="text-xs text-success">
        Đoạn này khá gần với bài mẫu về cấu trúc câu.
      </p>
    );
  }

  return (
    <p className="text-xs text-muted">
      Khác biệt chính: thêm {added} cụm từ, bớt {removed} cụm từ so với bài mẫu.
    </p>
  );
}

interface SampleComparisonViewProps {
  userContent: string;
  sampleWriting: string;
  feedback?: AnalysisFeedback;
  className?: string;
}

export function SampleComparisonView({
  userContent,
  sampleWriting,
  feedback,
  className,
}: SampleComparisonViewProps) {
  const userParagraphs = useMemo(
    () => splitParagraphs(userContent),
    [userContent],
  );
  const sampleParagraphs = useMemo(
    () => splitParagraphs(sampleWriting),
    [sampleWriting],
  );
  const pairCount = Math.max(userParagraphs.length, sampleParagraphs.length);

  if (!sampleWriting.trim()) {
    return (
      <p className="text-sm text-muted text-center py-8">
        Chưa có bài mẫu để so sánh.
      </p>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="panel-glass p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <GitCompare className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-fg">
              So sánh từng đoạn với bài mẫu
            </h3>
            <p className="text-sm text-muted mt-1 leading-relaxed">
              Xem bài của bạn và bài mẫu song song — chú thích gợi ý cách cải
              thiện từng phần.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <TextDiffView original={userContent} revised={sampleWriting} />
      </div>

      <div className="space-y-4">
        {Array.from({ length: pairCount }).map((_, index) => {
          const userParagraph = userParagraphs[index] ?? "";
          const sampleParagraph = sampleParagraphs[index] ?? "";
          const annotation = getSectionAnnotation(
            index,
            pairCount,
            feedback,
          );

          return (
            <article
              key={index}
              className="card-elevated overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-border bg-surface-2/50">
                <p className="text-xs font-semibold uppercase tracking-wide text-subtle">
                  Đoạn {index + 1}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
                <div className="p-4 space-y-2">
                  <p className="text-xs font-medium text-muted">Bài của bạn</p>
                  <p className="text-sm text-fg leading-relaxed whitespace-pre-wrap">
                    {userParagraph || (
                      <span className="text-muted italic">(Chưa có)</span>
                    )}
                  </p>
                </div>
                <div className="p-4 space-y-2 bg-primary-soft/20">
                  <p className="text-xs font-medium text-primary">Bài mẫu</p>
                  <p className="text-sm text-fg leading-relaxed whitespace-pre-wrap">
                    {sampleParagraph || (
                      <span className="text-muted italic">(Không có)</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="px-4 py-3 border-t border-border bg-surface-2/30 space-y-2">
                <ParagraphDiffSummary
                  original={userParagraph}
                  sample={sampleParagraph}
                />
                <p className="text-sm text-fg leading-relaxed flex gap-2">
                  <Lightbulb className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                  <span>{annotation}</span>
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
