"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Copy, PenLine } from "lucide-react";
import type { AnalysisFeedback, FeedbackCriterion } from "@/types/api";
import { extractAnalysisFeedback } from "@/utils/helpers";
import { Button } from "@/components/button";
import { ROUTES } from "@/constants/routes.constants";
import { toast } from "@/lib/toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";
import {
  isCriterion,
  scoreBgColor,
  scoreTextColor,
} from "../utils/score.utils";

const CRITERIA: { key: keyof AnalysisFeedback; label: string }[] = [
  { key: "structure", label: "Bố cục & Tổ chức" },
  { key: "clarity", label: "Rõ ràng & Diễn đạt" },
  { key: "tone", label: "Giọng điệu & Phong cách" },
  { key: "coherence", label: "Sự liên kết" },
];

function CriterionCard({
  label,
  criterion,
}: {
  label: string;
  criterion: FeedbackCriterion;
}) {
  const pct = Math.round(
    (Math.min(Math.max(criterion.score, 0), 10) / 10) * 100,
  );

  return (
    <div className="panel-glass p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-fg">{label}</h3>
        <span
          className={`stat-value text-sm font-bold ${scoreTextColor(criterion.score)}`}
        >
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
        <p className="text-sm text-muted mt-3 leading-relaxed">
          {criterion.feedback}
        </p>
      )}
      {criterion.suggestions?.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {criterion.suggestions.map((s, i) => (
            <li key={i} className="flex gap-2 text-sm text-fg leading-relaxed">
              <span className="text-primary flex-shrink-0">→</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ListCard({
  title,
  items,
  marker,
  markerClass,
}: {
  title: string;
  items: string[];
  marker: string;
  markerClass: string;
}) {
  if (!items || items.length === 0) return null;
  return (
    <div className="panel-glass p-4 sm:p-5">
      <h3 className="text-sm font-semibold text-fg mb-3">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm text-fg leading-relaxed">
            <span className={`flex-shrink-0 font-bold ${markerClass}`}>
              {marker}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AnalysisFeedbackView({
  feedback,
  writingId,
  analysisId,
}: {
  feedback: Record<string, unknown> | null | undefined;
  writingId?: string;
  analysisId?: string;
}) {
  const data = useMemo(() => extractAnalysisFeedback(feedback), [feedback]);

  const criteria = useMemo(
    () =>
      CRITERIA.map(({ key, label }) => ({
        label,
        criterion: data[key],
      })).filter((c) => isCriterion(c.criterion)) as {
        label: string;
        criterion: FeedbackCriterion;
      }[],
    [data],
  );

  const hasStructuredData =
    criteria.length > 0 ||
    !!data.overallFeedback ||
    (data.strengths?.length ?? 0) > 0 ||
    (data.areasForImprovement?.length ?? 0) > 0 ||
    (data.actionItems?.length ?? 0) > 0 ||
    !!data.sampleWriting;

  if (!hasStructuredData) {
    return (
      <div className="panel-glass p-8 text-center">
        <p className="text-fg font-medium">Không hiển thị được báo cáo</p>
        <p className="text-sm text-muted mt-2 max-w-md mx-auto leading-relaxed">
          Dữ liệu phản hồi không đúng định dạng. Hãy mở bài viết và chấm lại
          bằng AI để nhận báo cáo mới.
        </p>
      </div>
    );
  }

  const hasOverview =
    !!data.overallFeedback ||
    (data.strengths?.length ?? 0) > 0 ||
    (data.areasForImprovement?.length ?? 0) > 0 ||
    (data.actionItems?.length ?? 0) > 0;

  const defaultTab = hasOverview
    ? "overview"
    : criteria.length > 0
      ? "criteria"
      : "sample";

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList>
        {hasOverview && (
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
        )}
        {criteria.length > 0 && (
          <TabsTrigger value="criteria">Tiêu chí</TabsTrigger>
        )}
        {data.sampleWriting && (
          <TabsTrigger value="sample">Bài mẫu</TabsTrigger>
        )}
      </TabsList>

      {hasOverview && (
        <TabsContent value="overview" className="space-y-4 mt-2">
          {data.overallFeedback && (
            <div className="panel-glass p-6">
              <h2 className="text-sm font-semibold text-fg mb-2">
                Nhận xét chung
              </h2>
              <p className="text-sm text-muted leading-relaxed prose-content">
                {data.overallFeedback}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ListCard
              title="Điểm mạnh"
              items={data.strengths || []}
              marker="✓"
              markerClass="text-success"
            />
            <ListCard
              title="Cần cải thiện"
              items={data.areasForImprovement || []}
              marker="!"
              markerClass="text-warning"
            />
          </div>

          <ListCard
            title="Việc nên làm tiếp theo"
            items={data.actionItems || []}
            marker="→"
            markerClass="text-primary"
          />

          {writingId && (data.actionItems?.length ?? 0) > 0 && (
            <div className="flex justify-center pt-2">
              <Link href={ROUTES.writingRevise(writingId, analysisId)}>
                <Button className="gap-1.5 btn-glow-solid">
                  <PenLine className="h-4 w-4" />
                  Bắt đầu chữa bài
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>
      )}

      {criteria.length > 0 && (
        <TabsContent value="criteria" className="mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {criteria.map((c) => (
              <CriterionCard
                key={c.label}
                label={c.label}
                criterion={c.criterion}
              />
            ))}
          </div>
        </TabsContent>
      )}

      {data.sampleWriting && (
        <TabsContent value="sample" className="mt-2">
          <div className="panel-glass border-primary/20 p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-fg tracking-tight mb-1">
                  Bài viết mẫu
                </h2>
                <p className="text-sm text-muted">
                  Phiên bản tham khảo áp dụng các gợi ý cải thiện — giúp bạn
                  hình dung bài viết hoàn chỉnh hơn.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5"
                  onClick={async () => {
                    await navigator.clipboard.writeText(data.sampleWriting!);
                    toast.success("Đã sao chép bài mẫu");
                  }}
                >
                  <Copy className="h-4 w-4" />
                  Sao chép
                </Button>
                {writingId && (
                  <Link
                    href={ROUTES.writingRevise(writingId, analysisId)}
                  >
                    <Button size="sm" className="gap-1.5 btn-glow-solid">
                      <PenLine className="h-4 w-4" />
                      Chữa bài với bài mẫu
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            <div className="bg-primary-soft/50 border border-primary/10 rounded-lg p-5">
              <div className="prose-content whitespace-pre-wrap">
                {data.sampleWriting}
              </div>
            </div>
          </div>
        </TabsContent>
      )}
    </Tabs>
  );
}
