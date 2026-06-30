"use client";

import { useRouter } from "next/navigation";
import {
  useAnalytics,
  useDeleteAnalytics,
  AnalysisFeedback,
  AnalysisDetailHeader,
  AnalysisScoreCompare,
} from "@/features/analysis";
import { useWriting } from "@/features/writings";
import { Loading } from "@/components/loading";
import { Error } from "@/components/error-state";
import { toast } from "@/lib/toast";
import { ROUTES } from "@/constants/routes.constants";
import { useConfirmDialog } from "@/components/confirm-dialog";
import { getOverallAnalysisScore } from "@/features/analysis/utils/score.utils";
import { analysisMessages } from "@/messages/analysis";
import { commonMessages } from "@/messages/common";

interface AnalysisDetailViewProps {
  id: string;
}

export function AnalysisDetailView({ id }: AnalysisDetailViewProps) {
  const router = useRouter();
  const { data: analysis, isLoading, error } = useAnalytics(id);
  const { data: writing } = useWriting(analysis?.writingId || "");
  const { mutate: deleteAnalytics, isPending: isDeleting } =
    useDeleteAnalytics();
  const { confirm, ConfirmDialog } = useConfirmDialog();

  if (isLoading) {
    return <Loading fullScreen text={analysisMessages.loading} />;
  }

  if (error) {
    return (
      <Error
        title={analysisMessages.error.loadDetailTitle}
        message={analysisMessages.error.loadDetailMessage}
        retry={() => router.back()}
      />
    );
  }

  if (!analysis) {
    return null;
  }

  const score = getOverallAnalysisScore(analysis.feedbackJson);
  const meta = analysis.feedbackJson as {
    previousScore?: number | null;
    previousAnalysisId?: string | null;
    revisionNumber?: number | null;
  } | undefined;

  const handleDelete = async () => {
    const ok = await confirm({
      title: analysisMessages.delete.title,
      description: analysisMessages.delete.description,
      confirmLabel: analysisMessages.delete.confirm,
      cancelLabel: commonMessages.cancel,
      variant: "destructive",
    });
    if (!ok) return;

    deleteAnalytics(id, {
      onSuccess: () => {
        toast.success(analysisMessages.delete.success);
        router.push(ROUTES.ANALYSIS);
      },
      onError: () => toast.error(analysisMessages.delete.failed),
    });
  };

  return (
    <>
      <ConfirmDialog />
      <div className="space-y-8">
        <AnalysisDetailHeader
          analysis={analysis}
          writing={writing}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />

        {score != null && meta?.previousScore != null && (
          <AnalysisScoreCompare
            currentScore={score}
            previousScore={meta.previousScore}
            previousAnalysisId={meta.previousAnalysisId}
            revisionNumber={meta.revisionNumber}
          />
        )}

        {analysis.feedbackJson ? (
          <AnalysisFeedback
            feedback={analysis.feedbackJson}
            writingId={analysis.writingId}
            analysisId={analysis.id}
            writingContent={writing?.content}
          />
        ) : (
          <div className="panel-glass p-12 text-center">
            <p className="text-muted text-sm">
              {analysisMessages.empty.noFeedback}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
