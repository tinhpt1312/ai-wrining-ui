"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import {
  useAnalyses,
  useDeleteAnalytics,
  AnalysisResultGrid,
} from "@/features/analysis";
import { Loading } from "@/components/loading";
import { Error } from "@/components/error-state";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/button";
import { PageHeader } from "@/components/page-header";
import { useConfirmDialog } from "@/components/confirm-dialog";
import { toast } from "@/lib/toast";
import { ROUTES } from "@/constants/routes.constants";
import { analysisMessages } from "@/messages/analysis";
import { commonMessages } from "@/messages/common";
import { msg } from "@/messages/format";

export function AnalysisListView() {
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
      title: analysisMessages.delete.title,
      description: analysisMessages.delete.description,
      confirmLabel: analysisMessages.delete.confirm,
      cancelLabel: commonMessages.cancel,
      variant: "destructive",
    });
    if (!ok) return;

    deleteAnalytics(id, {
      onSuccess: () => toast.success(analysisMessages.delete.success),
      onError: () => toast.error(analysisMessages.delete.failed),
    });
  };

  if (isLoading) {
    return <Loading text={analysisMessages.loading} />;
  }

  if (isError) {
    return (
      <Error
        title={commonMessages.error.title}
        message={error?.message || analysisMessages.error.loadList}
      />
    );
  }

  const totalPages = Math.ceil((analyses?.total || 0) / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  return (
    <>
      <ConfirmDialog />
      <div className="space-y-6">
        <PageHeader
          variant="glass"
          title={analysisMessages.list.title}
          description={msg(analysisMessages.list.description, {
            count: analyses?.total || 0,
          })}
          actions={
            <Link href={ROUTES.WRITINGS}>
              <Button variant="secondary">
                {analysisMessages.list.goToWritings}
              </Button>
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
            title={analysisMessages.empty.noResults}
            description={analysisMessages.empty.noResultsDescription}
            action={{
              label: analysisMessages.empty.goToWritings,
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
              {commonMessages.pagination.prev}
            </Button>
            <span className="text-muted text-sm font-mono tabular-nums">
              {msg(commonMessages.pagination.page, {
                current: currentPage,
                total: totalPages,
              })}
            </span>
            <Button
              variant="outline"
              onClick={() =>
                setOffset(Math.min(offset + limit, (totalPages - 1) * limit))
              }
              disabled={currentPage === totalPages}
            >
              {commonMessages.pagination.next}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
