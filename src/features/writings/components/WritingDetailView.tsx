"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth";
import {
  useWriting,
  WritingDetailHeader,
  WritingContentPanel,
  WritingAiPanel,
} from "@/features/writings";
import { useRevisionTimeline } from "@/features/revision";
import {
  useAnalysesByWriting,
  useCreateAiAnalytics,
  useDeleteAnalytics,
} from "@/features/analysis";
import { Loading } from "@/components/loading";
import { Error } from "@/components/error-state";
import { EmptyState } from "@/components/empty-state";
import { PublicReadBanner } from "@/features/explore";
import { commonMessages } from "@/messages/common";
import { writingsMessages } from "@/messages/writings";
import { ROUTES } from "@/constants/routes.constants";
import { toast } from "@/lib/toast";
import { useConfirmDialog } from "@/components/confirm-dialog";

interface WritingDetailViewProps {
  id: string;
}

export function WritingDetailView({ id }: WritingDetailViewProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { data: writing, isLoading, error } = useWriting(id);
  const createAiAnalytics = useCreateAiAnalytics();
  const deleteAnalytics = useDeleteAnalytics();
  const { confirm, ConfirmDialog } = useConfirmDialog();
  const isOwner = !!user?.id && !!writing && writing.userId === user.id;
  const { data: analysesData, isLoading: analysesLoading } =
    useAnalysesByWriting(id, isOwner);
  const { data: timelineData } = useRevisionTimeline(id);

  const handleGenerateAiAnalytics = async () => {
    if (!writing || !isOwner) return;

    await createAiAnalytics.mutateAsync({
      writingId: id,
      writingType: writing.type,
      triggerAi: true,
    });
  };

  const handleDeleteAnalysis = async (analysisId: string) => {
    const ok = await confirm({
      title: writingsMessages.detail.deleteAnalysisTitle,
      description: writingsMessages.detail.deleteAnalysisDescription,
      confirmLabel: writingsMessages.detail.deleteAnalysisConfirm,
      cancelLabel: commonMessages.cancel,
      variant: "destructive",
    });
    if (!ok) return;

    deleteAnalytics.mutate(analysisId, {
      onSuccess: () => toast.success(writingsMessages.detail.deleteAnalysisSuccess),
      onError: () => toast.error(writingsMessages.detail.deleteAnalysisError),
    });
  };

  if (isLoading) {
    return <Loading fullScreen text={writingsMessages.detail.loading} />;
  }

  if (error) {
    return (
      <Error
        title={writingsMessages.detail.errorTitle}
        message={writingsMessages.detail.errorMessage}
        retry={() => router.back()}
      />
    );
  }

  if (!writing) {
    return (
      <EmptyState
        title={writingsMessages.detail.notFoundTitle}
        description={writingsMessages.detail.notFoundDescription}
        action={{
          label: writingsMessages.detail.backToList,
          onClick: () => router.push(ROUTES.WRITINGS),
        }}
      />
    );
  }

  const analyses = isOwner ? analysesData?.data || [] : [];
  const latestAnalysisId = analyses[0]?.id;
  const revisionCount = timelineData?.data?.length ?? 0;
  const showJourney =
    isOwner && (analyses.length > 0 || revisionCount > 0);

  return (
    <>
      <ConfirmDialog />
      <div className="space-y-8">
        {!isOwner && writing.author && (
          <PublicReadBanner author={writing.author} />
        )}

        <WritingDetailHeader
          writing={writing}
          isOwner={isOwner}
          latestAnalysisId={latestAnalysisId}
          showJourney={showJourney}
          revisionCount={revisionCount}
        />

        <WritingContentPanel content={writing.content} />

        {isOwner && (
          <WritingAiPanel
            analyses={analyses}
            isLoading={analysesLoading}
            isAnalyzing={createAiAnalytics.isPending}
            isPublic={writing.status === "public"}
            onAnalyze={handleGenerateAiAnalytics}
            onDeleteAnalysis={handleDeleteAnalysis}
            isDeletingAnalysis={deleteAnalytics.isPending}
          />
        )}
      </div>
    </>
  );
}
