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
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Analysis Report
          </h1>
          <div className="flex gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Created: {formatDateTime(analysis.createdAt)}</span>
            {writing && (
              <span>
                Writing: <span className="font-medium">{writing.title}</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
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
            className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded hover:bg-red-50 disabled:opacity-50"
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
        <Card className="space-y-4">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            AI Feedback
          </h2>
          <div className="prose prose-invert max-w-none dark:prose-invert">
            <pre className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-words overflow-auto max-h-96 bg-gray-50 dark:bg-gray-900 p-4 rounded">
              {JSON.stringify(analysis.feedbackJson, null, 2)}
            </pre>
          </div>
        </Card>
      ) : (
        <Card className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            No feedback available for this analysis yet.
          </p>
        </Card>
      )}
    </div>
  );
}
