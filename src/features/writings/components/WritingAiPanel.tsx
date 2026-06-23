"use client";

import Link from "next/link";
import { AnalysisResultCard } from "@/features/analysis";
import { Loading } from "@/components";
import { Button } from "@/components/button";
import { ROUTES } from "@/constants/routes.constants";
import { toast } from "@/lib/toast";
import type { Analytics } from "@/types/api";
import { Sparkles } from "lucide-react";
import { WritingAiSectionHeader } from "./WritingDetailHeader";

export function WritingAiPanel({
  analyses,
  isLoading,
  isAnalyzing,
  isPublic = false,
  onAnalyze,
  onDeleteAnalysis,
  isDeletingAnalysis,
}: {
  analyses: Analytics[];
  isLoading?: boolean;
  isAnalyzing?: boolean;
  isPublic?: boolean;
  onAnalyze: () => void | Promise<void>;
  onDeleteAnalysis: (id: string) => void;
  isDeletingAnalysis?: boolean;
}) {
  const handleAnalyze = async () => {
    try {
      await onAnalyze();
      toast.success("Đã chấm bài bằng AI");
    } catch {
      toast.error("Không thể chấm bài. Vui lòng thử lại.");
    }
  };

  return (
    <section className="space-y-5">
      <WritingAiSectionHeader
        onAnalyze={handleAnalyze}
        isLoading={isAnalyzing}
      />

      {isLoading ? (
        <Loading text="Đang tải kết quả chấm bài..." />
      ) : analyses.length === 0 ? (
        <div className="card-elevated p-8 sm:p-12 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary mb-4">
            <Sparkles className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-semibold text-fg mb-1.5">
            Chưa có kết quả chấm bài
          </h3>
          <p className="text-sm text-muted mb-6 max-w-md mx-auto leading-relaxed">
            Chấm bài bằng AI để nhận phản hồi chi tiết theo từng tiêu chí và
            bài viết mẫu tham khảo.
          </p>
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            isLoading={isAnalyzing}
            className="gap-1.5"
          >
            <Sparkles className="h-4 w-4" />
            Chấm bài lần đầu
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {analyses.map((analysis) => (
            <AnalysisResultCard
              key={analysis.id}
              analysis={analysis}
              onDelete={onDeleteAnalysis}
              isDeleting={isDeletingAnalysis}
              isPublic={isPublic}
            />
          ))}
        </div>
      )}

      {analyses.length > 0 && (
        <div className="text-center">
          <Link href={ROUTES.ANALYSIS}>
            <Button variant="outline" size="sm">
              Xem tất cả kết quả chấm bài
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
}
