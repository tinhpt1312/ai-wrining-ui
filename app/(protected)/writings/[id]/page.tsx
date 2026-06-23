"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth";
import {
  useWriting,
  WritingDetailHeader,
  WritingContentPanel,
  WritingAiPanel,
} from "@/features/writings";
import {
  useAnalysesByWriting,
  useCreateAiAnalytics,
  useDeleteAnalytics,
} from "@/features/analysis";
import { Loading, Error, EmptyState } from "@/components";
import { PublicReadBanner } from "@/features/explore";
import { ROUTES } from "@/constants/routes.constants";
import { toast } from "@/lib/toast";
import { useConfirmDialog } from "@/components/confirm-dialog";

interface WritingViewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function WritingViewPage({ params }: WritingViewPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { user } = useAuth();
  const { data: writing, isLoading, error } = useWriting(id);
  const createAiAnalytics = useCreateAiAnalytics();
  const deleteAnalytics = useDeleteAnalytics();
  const { confirm, ConfirmDialog } = useConfirmDialog();
  const isOwner = !!user?.id && !!writing && writing.userId === user.id;
  const { data: analysesData, isLoading: analysesLoading } =
    useAnalysesByWriting(id, isOwner);

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
      title: "Xóa kết quả chấm bài",
      description:
        "Bạn có chắc muốn xóa kết quả chấm bài này? Hành động này không thể hoàn tác.",
      confirmLabel: "Xóa",
      cancelLabel: "Hủy",
      variant: "destructive",
    });
    if (!ok) return;

    deleteAnalytics.mutate(analysisId, {
      onSuccess: () => toast.success("Đã xóa kết quả chấm bài"),
      onError: () => toast.error("Không thể xóa kết quả chấm bài"),
    });
  };

  if (isLoading) {
    return <Loading fullScreen text="Đang tải bài viết..." />;
  }

  if (error) {
    return (
      <Error
        title="Không tải được bài viết"
        message="Không thể lấy nội dung bài viết. Bài có thể là bản nháp hoặc không tồn tại."
        retry={() => router.back()}
      />
    );
  }

  if (!writing) {
    return (
      <EmptyState
        title="Không tìm thấy bài viết"
        description="Bài viết bạn tìm không tồn tại."
        action={{
          label: "Về danh sách bài viết",
          onClick: () => router.push(ROUTES.WRITINGS),
        }}
      />
    );
  }

  const analyses = isOwner ? analysesData?.data || [] : [];

  return (
    <>
      <ConfirmDialog />
      <div className="space-y-8">
      {!isOwner && writing.author && (
        <PublicReadBanner author={writing.author} />
      )}

      <WritingDetailHeader writing={writing} isOwner={isOwner} />

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
