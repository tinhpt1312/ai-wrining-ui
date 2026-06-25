"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FileText, Plus } from "lucide-react";
import {
  useWritings,
  useDeleteWriting,
  WritingsFilterTabs,
  WritingCardGrid,
} from "@/features/writings";
import { Loading } from "@/components/loading";
import { Error } from "@/components/error-state";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/button";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { useConfirmDialog } from "@/components/confirm-dialog";
import { toast } from "@/lib/toast";
import { ROUTES } from "@/constants/routes.constants";
import * as types from "@/types/api";

export default function WritingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [typeFilter, setTypeFilter] = useState<string>(
    searchParams.get("type") || "",
  );
  const [statusFilter, setStatusFilter] = useState<string>(
    searchParams.get("status") || "",
  );
  const [offset, setOffset] = useState(0);

  const limit = 10;
  const params: types.QueryWritingParams = {
    limit,
    offset,
    ...(typeFilter && { type: typeFilter as types.WritingType }),
    ...(statusFilter && { status: statusFilter as types.WritingStatus }),
  };

  const { data, isLoading, error } = useWritings(params);
  const deleteWriting = useDeleteWriting();
  const { confirm, ConfirmDialog } = useConfirmDialog();

  const handleDeleteClick = async (id: string) => {
    const ok = await confirm({
      title: "Xóa bài viết",
      description:
        "Bạn có chắc muốn xóa bài viết này? Hành động này không thể hoàn tác.",
      confirmLabel: "Xóa bài viết",
      cancelLabel: "Hủy",
      variant: "destructive",
    });
    if (!ok) return;

    try {
      await deleteWriting.mutateAsync(id);
      toast.success("Đã xóa bài viết");
    } catch {
      toast.error("Không thể xóa bài viết");
    }
  };

  const handleFilterChange = (filterType: "type" | "status", value: string) => {
    if (filterType === "type") {
      setTypeFilter(value);
    } else {
      setStatusFilter(value);
    }
    setOffset(0);
  };

  if (isLoading) {
    return <Loading fullScreen text="Đang tải danh sách bài viết..." />;
  }

  if (error) {
    return (
      <Error
        title="Không tải được danh sách"
        message="Không thể lấy danh sách bài viết. Vui lòng thử lại."
        retry={() => window.location.reload()}
      />
    );
  }

  const writings = data?.data || [];
  const totalWritings = data?.total || 0;
  const hasMore = offset + limit < totalWritings;
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(totalWritings / limit);

  return (
    <>
      <ConfirmDialog />
      <div className="space-y-8">
      <PageHeader
        variant="glass"
        title="Bài viết của tôi"
        description={`${totalWritings} bài viết trong thư viện`}
        actions={
          <Link href={ROUTES.WRITING_NEW}>
            <Button className="gap-1.5 btn-glow-solid">
              <Plus className="h-4 w-4" />
              Viết bài mới
            </Button>
          </Link>
        }
      />

      <Section title="Bộ lọc">
        <WritingsFilterTabs
          typeValue={typeFilter}
          statusValue={statusFilter}
          onTypeChange={(value) => handleFilterChange("type", value)}
          onStatusChange={(value) => handleFilterChange("status", value)}
        />
      </Section>

      {writings.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-10 w-10" />}
          title="Chưa có bài viết"
          description="Hãy tạo bài viết đầu tiên để bắt đầu hành trình viết văn của bạn."
          action={{
            label: "Viết bài mới",
            onClick: () => router.push(ROUTES.WRITING_NEW),
          }}
        />
      ) : (
        <WritingCardGrid
          writings={writings}
          onDelete={handleDeleteClick}
          isDeleting={deleteWriting.isPending}
        />
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => setOffset(Math.max(0, offset - limit))}
            disabled={offset === 0}
          >
            Trước
          </Button>
          <span className="text-sm text-muted">
            Trang {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setOffset(offset + limit)}
            disabled={!hasMore}
          >
            Sau
          </Button>
        </div>
      )}
      </div>
    </>
  );
}
