"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAnalytics, useWriting, useDeleteAnalytics } from "@/hooks/useApi";
import { Loading, Error } from "@/components/ui/States";
import { Button } from "@/components/ui/Button";
import { formatDateTime } from "@/utils/helpers";

interface AnalyticsViewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function AnalyticsViewPage({ params }: AnalyticsViewPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { data: analysis, isLoading, error } = useAnalytics(id);
  const { data: writing } = useWriting(analysis?.writingId || "");
  const { mutate: deleteAnalytics, isPending: isDeleting } =
    useDeleteAnalytics();

  if (isLoading) {
    return <Loading fullScreen text="Loading analysis..." />;
  }

  if (error) {
    return (
      <Error
        title="Failed to Load Analytics"
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
      deleteAnalytics(id, {
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
          <h1 className="text-2xl font-bold text-fg tracking-tight">
            Analytics Report
          </h1>
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted">
            <span>Created: {formatDateTime(analysis.createdAt)}</span>
            {writing && (
              <span>
                Writing:{" "}
                <span className="font-medium text-fg">{writing.title}</span>
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
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
        </div>
      </div>

      {/* Feedback Content */}
      {analysis.feedbackJson ? (
        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-sm font-semibold text-fg mb-4">AI Feedback</h2>
          <div className="w-full overflow-x-auto">
            <pre className="text-sm text-muted whitespace-pre-wrap break-words bg-surface-2 p-5 rounded-lg border border-border font-mono leading-relaxed">
              {JSON.stringify(analysis.feedbackJson, null, 2)}
            </pre>
          </div>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl p-12 text-center">
          <p className="text-muted text-sm">
            No feedback available for this analysis yet.
          </p>
        </div>
      )}
    </div>
  );
}
