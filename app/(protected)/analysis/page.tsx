"use client";

import { useState } from "react";
import Link from "next/link";
import { useAnalyses, useDeleteAnalytics } from "@/hooks/useApi";
import {
  Loading,
  Error as ErrorState,
  EmptyState,
} from "@/components/ui/States";
import { Button } from "@/components/ui/Button";

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

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this analysis?")) {
      deleteAnalytics(id);
    }
  };

  if (isLoading) {
    return <Loading text="Loading analyses..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Error"
        message={error?.message || "Failed to load analyses"}
      />
    );
  }

  const totalPages = Math.ceil((analyses?.total || 0) / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-fg tracking-tight">Analyses</h1>
          <p className="text-sm text-muted mt-1">
            Total: {analyses?.total || 0} analyses
          </p>
        </div>
        <Link href="/writings">
          <Button variant="secondary">Back to Writings</Button>
        </Link>
      </div>

      {/* Analyses List */}
      <div className="space-y-4">
        {analyses?.data && analyses.data.length > 0 ? (
          analyses.data.map((analysis) => (
            <div
              key={analysis.id}
              className="bg-surface rounded-xl border border-border p-5 hover:border-border-strong transition-colors"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <Link href={`/analysis/${analysis.id}`}>
                    <h3 className="text-base font-semibold text-fg hover:text-primary break-all transition-colors">
                      Writing ID: {analysis.writingId.slice(0, 8)}...
                    </h3>
                  </Link>
                  {analysis.feedbackJson && (
                    <div className="mt-3 p-3 bg-surface-2 rounded-lg text-sm text-muted">
                      <p className="font-medium mb-2 text-fg">Feedback:</p>
                      <pre className="whitespace-pre-wrap break-words text-xs overflow-hidden max-h-24 font-mono">
                        {JSON.stringify(analysis.feedbackJson, null, 2).slice(
                          0,
                          200,
                        )}
                        ...
                      </pre>
                    </div>
                  )}
                  <p className="text-xs text-subtle mt-2">
                    Created:{" "}
                    {new Date(analysis.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Link href={`/analysis/${analysis.id}/edit`}>
                    <Button size="sm" variant="secondary">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(analysis.id)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "..." : "Delete"}
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            icon="📊"
            title="No analyses yet"
            description="Create an analysis from your writings to get started."
            action={{
              label: "Go to Writings",
              onClick: () => (window.location.href = "/writings"),
            }}
          />
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setOffset(Math.max(0, offset - limit))}
            disabled={offset === 0}
          >
            Previous
          </Button>
          <span className="text-muted text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() =>
              setOffset(Math.min(offset + limit, (totalPages - 1) * limit))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
