"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import {
  useAnalytics,
  useDeleteAnalytics,
  AnalysisFeedback,
  AnalysisDetailHeader,
} from "@/features/analysis";
import { useWriting } from "@/features/writings";
import { Loading, Error } from "@/components";
import { toast } from "@/lib/toast";
import { ROUTES } from "@/constants/routes.constants";
import { useConfirmDialog } from "@/components/confirm-dialog";

interface AnalyticsViewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function AnalyticsViewPage({ params }: AnalyticsViewPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { data: analysis, isLoading, error } = useAnalytics(id);
  const { data: writing } = useWriting(analysis?.writingId || "");
  const { mutate: deleteAnalytics, isPending: isDeleting } =
    useDeleteAnalytics();
  const { confirm, ConfirmDialog } = useConfirmDialog();

  if (isLoading) {
    return <Loading fullScreen text="Đang tải kết quả chấm bài..." />;
  }

  if (error) {
    return (
      <Error
        title="Không tải được kết quả"
        message="Không thể lấy dữ liệu chấm bài. Vui lòng thử lại."
        retry={() => router.back()}
      />
    );
  }

  if (!analysis) {
    return null;
  }

  const handleDelete = async () => {
    const ok = await confirm({
      title: "Xóa kết quả chấm bài",
      description:
        "Bạn có chắc muốn xóa kết quả chấm bài này? Hành động này không thể hoàn tác.",
      confirmLabel: "Xóa",
      cancelLabel: "Hủy",
      variant: "destructive",
    });
    if (!ok) return;

    deleteAnalytics(id, {
      onSuccess: () => {
        toast.success("Đã xóa kết quả chấm bài");
        router.push(ROUTES.ANALYSIS);
      },
      onError: () => toast.error("Không thể xóa kết quả chấm bài"),
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

      {analysis.feedbackJson ? (
        <AnalysisFeedback feedback={analysis.feedbackJson} />
      ) : (
        <div className="card-elevated p-12 text-center">
          <p className="text-muted text-sm">
            Chưa có phản hồi cho lần chấm bài này.
          </p>
        </div>
      )}
      </div>
    </>
  );
}
