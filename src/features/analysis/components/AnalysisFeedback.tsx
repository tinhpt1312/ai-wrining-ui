"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Copy, PenLine } from "lucide-react";
import type { AnalysisFeedback, FeedbackCriterion } from "@/types/api";
import { extractAnalysisFeedback } from "@/features/analysis/utils/feedback.utils";
import { SelfEditGate } from "@/features/revision/components/SelfEditGate";
import { useSelfEditUnlock } from "@/features/revision/hooks/useSelfEditUnlock";
import { Button } from "@/components/button";
import { ROUTES } from "@/constants/routes.constants";
import { toast } from "@/lib/toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";
import { isCriterion } from "../utils/score.utils";
import { CriterionCard } from "./feedback/CriterionCard";
import { FeedbackListCard } from "./feedback/FeedbackListCard";
import { SampleComparisonView } from "./SampleComparisonView";

const CRITERIA: { key: keyof AnalysisFeedback; label: string }[] = [
  { key: "structure", label: "Bố cục & Tổ chức" },
  { key: "clarity", label: "Rõ ràng & Diễn đạt" },
  { key: "tone", label: "Giọng điệu & Phong cách" },
  { key: "coherence", label: "Sự liên kết" },
];

export default function AnalysisFeedbackView({
  feedback,
  writingId,
  analysisId,
  writingContent,
}: {
  feedback: Record<string, unknown> | null | undefined;
  writingId?: string;
  analysisId?: string;
  writingContent?: string;
}) {
  const data = useMemo(() => extractAnalysisFeedback(feedback), [feedback]);
  const selfEditUnlocked = useSelfEditUnlock(writingId, analysisId);

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
        {data.sampleWriting && writingContent && (
          <TabsTrigger value="compare">So sánh</TabsTrigger>
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
            <FeedbackListCard
              title="Điểm mạnh"
              items={data.strengths || []}
              marker="✓"
              markerClass="text-success"
            />
            <FeedbackListCard
              title="Cần cải thiện"
              items={data.areasForImprovement || []}
              marker="!"
              markerClass="text-warning"
            />
          </div>

          <FeedbackListCard
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
          <SelfEditGate
            unlocked={selfEditUnlocked}
            baseline=""
            current=""
            writingId={writingId}
            analysisId={analysisId}
            title="Tự sửa trước khi xem bài mẫu"
            description="Vào không gian chữa bài và tự chỉnh sửa ít nhất 50 ký tự trước khi xem bài mẫu — giúp bạn chủ động học hơn."
          >
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
                  <Link href={ROUTES.writingRevise(writingId, analysisId)}>
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
          </SelfEditGate>
        </TabsContent>
      )}

      {data.sampleWriting && writingContent && (
        <TabsContent value="compare" className="mt-2">
          <SelfEditGate
            unlocked={selfEditUnlocked}
            baseline=""
            current=""
            writingId={writingId}
            analysisId={analysisId}
            title="Tự sửa trước khi so sánh với bài mẫu"
            description="Vào không gian chữa bài và tự chỉnh sửa ít nhất 50 ký tự trước khi xem so sánh chi tiết."
          >
            <SampleComparisonView
              userContent={writingContent}
              sampleWriting={data.sampleWriting}
              feedback={data}
            />
          </SelfEditGate>
        </TabsContent>
      )}
    </Tabs>
  );
}
