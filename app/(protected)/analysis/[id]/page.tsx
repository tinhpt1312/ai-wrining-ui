"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAnalysis, useWriting, useDeleteAnalysis } from "@/hooks/useApi";
import { Loading, Error, Card } from "@/components/ui/States";
import { Button } from "@/components/ui/Button";
import { formatDateTime } from "@/utils/helpers";

interface AnalysisViewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function AnalysisViewPage({ params }: AnalysisViewPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { data: analysis, isLoading, error } = useAnalysis(id);
  const { data: writing } = useWriting(analysis?.writingId || "");
  const { mutate: deleteAnalysis, isPending: isDeleting } = useDeleteAnalysis();

  if (isLoading) {
    return <Loading fullScreen text="Loading analysis..." />;
  }

  if (error) {
    return (
      <Error
        title="Failed to Load Analysis"
        message="Could not fetch this analysis. Please try again."
        retry={() => router.back()}
      />
    );
  }

  if (!analysis) {
    return null;
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this analysis?")) {
      deleteAnalysis(id, {
        onSuccess: () => {
          router.push("/analysis");
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Analysis Report
          </h1>
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Created: {formatDateTime(analysis.createdAt)}</span>
            {writing && (
              <span>
                Writing:{" "}
                <span className="font-medium text-black dark:text-white">
                  {writing.title}
                </span>
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap flex-shrink-0">
          <Link href={`/analysis/${id}/edit`}>
            <Button variant="secondary">Edit</Button>
          </Link>
          {writing && (
            <Link href={`/writings/${analysis.writingId}`}>
              <Button variant="outline">View Writing</Button>
            </Link>
          )}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 rounded hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 transition-colors"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
        </div>
      </div>

      {/* Feedback Content */}
      {analysis.feedbackJson ? (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-6">
            AI Feedback
          </h2>
          <div className="w-full overflow-x-auto">
            <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words bg-gray-50 dark:bg-gray-950 p-6 rounded-lg border border-gray-200 dark:border-gray-800 font-mono leading-relaxed">
              {JSON.stringify(analysis.feedbackJson, null, 2)}
            </pre>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            No feedback available for this analysis yet.
          </p>
        </div>
      )}
    </div>
  );
}
