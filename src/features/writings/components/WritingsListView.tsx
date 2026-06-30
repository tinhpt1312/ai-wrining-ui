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
import { Pagination } from "@/components/pagination";
import { useConfirmDialog } from "@/components/confirm-dialog";
import { usePagination } from "@/hooks/usePagination";
import { toast } from "@/lib/toast";
import { msg } from "@/messages/format";
import { commonMessages } from "@/messages/common";
import { writingsMessages } from "@/messages/writings";
import { ROUTES } from "@/constants/routes.constants";
import * as types from "@/types/api";

export function WritingsListView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [typeFilter, setTypeFilter] = useState<string>(
    searchParams.get("type") || "",
  );
  const [statusFilter, setStatusFilter] = useState<string>(
    searchParams.get("status") || "",
  );
  const { offset, limit, currentPage, reset, getTotalPages, paginationProps } =
    usePagination({ limit: 10 });

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
      title: writingsMessages.list.deleteConfirmTitle,
      description: writingsMessages.list.deleteConfirmDescription,
      confirmLabel: writingsMessages.list.deleteConfirmLabel,
      cancelLabel: commonMessages.cancel,
      variant: "destructive",
    });
    if (!ok) return;

    try {
      await deleteWriting.mutateAsync(id);
      toast.success(writingsMessages.list.deleteSuccess);
    } catch {
      toast.error(writingsMessages.list.deleteError);
    }
  };

  const handleFilterChange = (filterType: "type" | "status", value: string) => {
    if (filterType === "type") {
      setTypeFilter(value);
    } else {
      setStatusFilter(value);
    }
    reset();
  };

  if (isLoading) {
    return <Loading fullScreen text={writingsMessages.list.loading} />;
  }

  if (error) {
    return (
      <Error
        title={writingsMessages.list.errorTitle}
        message={writingsMessages.list.errorMessage}
        retry={() => window.location.reload()}
      />
    );
  }

  const writings = data?.data || [];
  const totalWritings = data?.total || 0;
  const totalPages = getTotalPages(totalWritings);

  return (
    <>
      <ConfirmDialog />
      <div className="space-y-8">
        <PageHeader
          variant="glass"
          title={writingsMessages.list.title}
          description={msg(writingsMessages.list.description, {
            count: totalWritings,
          })}
          actions={
            <Link href={ROUTES.WRITING_NEW}>
              <Button className="gap-1.5 btn-glow-solid">
                <Plus className="h-4 w-4" />
                {writingsMessages.list.newButton}
              </Button>
            </Link>
          }
        />

        <Section title={writingsMessages.list.filterSection}>
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
            title={writingsMessages.list.emptyTitle}
            description={writingsMessages.list.emptyDescription}
            action={{
              label: writingsMessages.list.emptyPromptAction,
              onClick: () => router.push(`${ROUTES.WRITING_NEW}?tab=prompts`),
            }}
            secondaryAction={{
              label: writingsMessages.list.emptyFreeAction,
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

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevious={paginationProps.onPrevious}
          onNext={paginationProps.onNext}
        />
      </div>
    </>
  );
}
