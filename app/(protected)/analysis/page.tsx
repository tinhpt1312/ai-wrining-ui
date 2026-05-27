"use client";

import { useState } from "react";
import Link from "next/link";
import { useAnalyses, useDeleteAnalysis } from "@/hooks/useApi";
import { Loading, Error as ErrorState } from "@/components/ui/States";
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analyses</h1>
            <p className="text-gray-600 mt-2">
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
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Link href={`/analysis/${analysis.id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                        Writing ID: {analysis.writingId.slice(0, 8)}...
                      </h3>
                    </Link>
                    {analysis.feedbackJson && (
                      <div className="mt-3 p-3 bg-gray-50 rounded text-sm text-gray-700">
                        <p className="font-medium mb-2">Feedback:</p>
                        <pre className="whitespace-pre-wrap break-words text-xs">
                          {JSON.stringify(analysis.feedbackJson, null, 2).slice(
                            0,
                            200,
                          )}
                          ...
                        </pre>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
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
                  <div className="flex gap-2 ml-4">
                    <Link href={`/analysis/${analysis.id}/edit`}>
                      <Button size="sm" variant="secondary">
                        Edit
                      </Button>
                    </Link>
                    <button
                      onClick={() => handleDelete(analysis.id)}
                      disabled={isDeleting}
                      className="px-3 py-1 text-sm font-medium text-red-600 border border-red-300 rounded hover:bg-red-50 disabled:opacity-50"
                    >
                      {isDeleting ? "..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">No analyses found</p>
              <Link href="/writings">
                <Button className="mt-4">Create Your First Analysis</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-4">
            <button
              onClick={() => setOffset(Math.max(0, offset - limit))}
              disabled={offset === 0}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setOffset(Math.min(offset + limit, (totalPages - 1) * limit))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
