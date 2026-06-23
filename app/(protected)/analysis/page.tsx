"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import {
  useAnalyses,
  useDeleteAnalytics,
  AnalysisResultGrid,
} from "@/features/analysis";
import {
  Loading,
  Error as ErrorState,
  EmptyState,
} from "@/components";
import { Button } from "@/components/button";
import { PageHeader } from "@/components/page-header";
import { useConfirmDialog } from "@/components/confirm-dialog";
import { toast } from "@/lib/toast";
import { ROUTES } from "@/constants/routes.constants";

export default function AnalyticsPage() {
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);

  const {
    data: analyses,
    isLoading,
    isError,
    error,
  } = useAnalyses({
    limit,
    offset,
  });

  const { mutate: deleteAnalytics, isPending: isDeleting } =
    useDeleteAnalytics();
  const { confirm, ConfirmDialog } = useConfirmDialog();

  const handleDelete = async (id: string) => {
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
      onSuccess: () => toast.success("Đã xóa kết quả chấm bài"),
      onError: () => toast.error("Không thể xóa kết quả chấm bài"),
    });
  };

  if (isLoading) {
    return <Loading text="Đang tải kết quả chấm bài..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Lỗi"
        message={error?.message || "Không thể tải danh sách chấm bài"}
      />
    );
  }

  const totalPages = Math.ceil((analyses?.total || 0) / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  return (
    <>
      <ConfirmDialog />
      <div className="space-y-8">
      <PageHeader
        title="Kết quả chấm bài"
        description={`${analyses?.total || 0} lần chấm đã lưu`}
        actions={
          <Link href={ROUTES.WRITINGS}>
            <Button variant="secondary">Đến bài viết</Button>
          </Link>
        }
      />

      {analyses?.data && analyses.data.length > 0 ? (
        <AnalysisResultGrid
          analyses={analyses.data}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
      ) : (
        <EmptyState
          icon={<Sparkles className="h-10 w-10" />}
          title="Chưa có kết quả chấm bài"
          description="Hãy chấm một bài viết để xem phản hồi AI tại đây."
          action={{
            label: "Đến danh sách bài viết",
            onClick: () => (window.location.href = ROUTES.WRITINGS),
          }}
        />
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => setOffset(Math.max(0, offset - limit))}
            disabled={offset === 0}
          >
            Trước
          </Button>
          <span className="text-muted text-sm">
            Trang {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() =>
              setOffset(Math.min(offset + limit, (totalPages - 1) * limit))
            }
            disabled={currentPage === totalPages}
          >
            Sau
          </Button>
        </div>
      )}
      </div>
    </>
  );
}
