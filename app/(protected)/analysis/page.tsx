"use client";

import { useState } from "react";
import Link from "next/link";
import { useAnalyses, useDeleteAnalysis } from "@/hooks/useApi";
import { Loading, Error as ErrorState, EmptyState } from "@/components/ui/States";
import { Button } from "@/components/ui/Button";

export default function AnalysisPage() {
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

  const { mutate: deleteAnalysis, isPending: isDeleting } = useDeleteAnalysis();

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this analysis?")) {
      deleteAnalysis(id);
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
          <h1 className="text-3xl font-bold text-black dark:text-white">Analyses</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Total: {analyses?.total || 0} analyses
          </p>
        </div>
        <Link href="/writings">
          <Button>Back to Writings</Button>
        </Link>
      </div>

      {/* Analyses List */}
      <div className="space-y-4">
        {analyses?.data && analyses.data.length > 0 ? (
          analyses.data.map((analysis) => (
            <div
              key={analysis.id}
              className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <Link href={`/analysis/${analysis.id}`}>
                    <h3 className="text-lg font-semibold text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-400 break-all">
                      Writing ID: {analysis.writingId.slice(0, 8)}...
                    </h3>
                  </Link>
                  {analysis.feedbackJson && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded text-sm text-gray-700 dark:text-gray-300">
                      <p className="font-medium mb-2">Feedback:</p>
                      <pre className="whitespace-pre-wrap break-words text-xs overflow-hidden max-h-24">
                        {JSON.stringify(analysis.feedbackJson, null, 2).slice(
                          0,
                          200,
                        )}
                        ...
                      </pre>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    Created:{" "}
                    {new Date(analysis.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Link href={`/analysis/${analysis.id}/edit`}>
                    <Button size="sm" variant="secondary">
                      Edit
                    </Button>
                  </Link>
                  <button
                    onClick={() => handleDelete(analysis.id)}
                    disabled={isDeleting}
                    className="px-3 py-1 text-sm font-medium text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 rounded hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 transition-colors"
                  >
                    {isDeleting ? "..." : "Delete"}
                  </button>
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
              onClick: () => window.location.href = "/writings",
            }}
          />
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={() => setOffset(Math.max(0, offset - limit))}
            disabled={offset === 0}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-black dark:text-white"
          >
            Previous
          </button>
          <span className="text-gray-600 dark:text-gray-400 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setOffset(Math.min(offset + limit, (totalPages - 1) * limit))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-black dark:text-white"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
