"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useWritings, useDeleteWriting } from "@/hooks/useApi";
import {
  Card,
  Loading,
  Error,
  EmptyState,
  Alert,
} from "@/components/ui/States";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import {
  writingTypeOptions,
  writingStatusOptions,
  formatDate,
  truncateText,
  wordCount,
} from "@/utils/helpers";
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
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletedId, setDeletedId] = useState<string | null>(null);

  const limit = 10;
  const params: types.QueryWritingParams = {
    limit,
    offset,
    ...(typeFilter && { type: typeFilter as types.WritingType }),
    ...(statusFilter && { status: statusFilter as types.WritingStatus }),
  };

  const { data, isLoading, error } = useWritings(params);
  const deleteWriting = useDeleteWriting();

  const handleDeleteClick = async (id: string) => {
    if (!confirm("Are you sure you want to delete this writing?")) {
      return;
    }

    try {
      await deleteWriting.mutateAsync(id);
      setDeletedId(id);
      setTimeout(() => setDeletedId(null), 3000);
    } catch (err) {
      setDeleteError("Failed to delete writing");
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
    return <Loading fullScreen text="Loading writings..." />;
  }

  if (error) {
    return (
      <Error
        title="Failed to Load Writings"
        message="Could not fetch your writings. Please try again."
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-fg tracking-tight">
            My Writings
          </h1>
          <p className="text-sm text-muted mt-1">
            {totalWritings} {totalWritings === 1 ? "writing" : "writings"} found
          </p>
        </div>
        <Link href="/writings/new">
          <Button>Create New Writing</Button>
        </Link>
      </div>

      {/* Alerts */}
      {deleteError && (
        <Alert
          type="error"
          title="Error"
          message={deleteError}
          onClose={() => setDeleteError(null)}
        />
      )}
      {deletedId && (
        <Alert
          type="success"
          title="Success"
          message="Writing deleted successfully"
        />
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Filter by Type"
          value={typeFilter}
          onChange={(e) => handleFilterChange("type", e.target.value)}
          options={[{ value: "", label: "All Types" }, ...writingTypeOptions]}
        />
        <Select
          label="Filter by Status"
          value={statusFilter}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          options={[
            { value: "", label: "All Status" },
            ...writingStatusOptions,
          ]}
        />
      </div>

      {/* Writings List */}
      {writings.length === 0 ? (
        <EmptyState
          icon="📝"
          title="No writings yet"
          description="Start creating your first writing to see it here."
          action={{
            label: "Create Writing",
            onClick: () => router.push("/writings/new"),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {writings.map((writing) => (
            <Card key={writing.id} className="flex flex-col gap-4 hover:border-border-strong">
              <div className="flex flex-col gap-2">
                <Link href={`/writings/${writing.id}`}>
                  <h3 className="text-lg font-semibold text-fg hover:text-primary transition-colors line-clamp-2">
                    {writing.title}
                  </h3>
                </Link>
                <p className="text-sm text-muted line-clamp-2">
                  {truncateText(writing.content, 150)}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="inline-block px-2.5 py-0.5 bg-surface-2 text-muted text-xs font-medium rounded-full capitalize">
                  {writing.type.replace("_", " ")}
                </span>
                <span
                  className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full capitalize ${
                    writing.status === "public"
                      ? "bg-success-soft text-success"
                      : "bg-warning-soft text-warning"
                  }`}
                >
                  {writing.status.replace("_", " ")}
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-4 text-xs text-subtle">
                  <span>{wordCount(writing.content)} words</span>
                  <span>{formatDate(writing.updatedAt)}</span>
                </div>

                <div className="flex gap-2">
                  <Link href={`/writings/${writing.id}`}>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>
                  <Link href={`/writings/${writing.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(writing.id)}
                    disabled={deleteWriting.isPending}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setOffset(Math.max(0, offset - limit))}
            disabled={offset === 0}
          >
            Previous
          </Button>
          <div className="text-sm text-muted">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            onClick={() => setOffset(offset + limit)}
            disabled={!hasMore}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
