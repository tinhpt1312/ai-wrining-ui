"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  useWriting,
  useAnalysesByWriting,
  useCreateAiAnalytics,
} from "@/hooks/useApi";
import { Loading, Error, Alert, EmptyState } from "@/components/ui/States";
import { Button } from "@/components/ui/Button";
import {
  formatDateTime,
  wordCount,
  estimateReadingTime,
} from "@/utils/helpers";

interface WritingViewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function WritingViewPage({ params }: WritingViewPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { data: writing, isLoading, error } = useWriting(id);
  const { data: analysesData, isLoading: analysesLoading } =
    useAnalysesByWriting(id);
  const createAiAnalytics = useCreateAiAnalytics();
  const [aiError, setAiError] = useState<string | null>(null);

  const handleGenerateAiAnalytics = async () => {
    if (!writing) return;

    try {
      setAiError(null);
      await createAiAnalytics.mutateAsync({
        writingId: id,
        writingType: writing.type,
        triggerAi: true,
      });
    } catch (err) {
      setAiError("Failed to generate AI analysis");
    }
  };

  if (isLoading) {
    return <Loading fullScreen text="Loading writing..." />;
  }

  if (error) {
    return (
      <Error
        title="Failed to Load Writing"
        message="Could not fetch this writing. Please try again."
        retry={() => router.back()}
      />
    );
  }

  if (!writing) {
    return (
      <EmptyState
        title="Writing Not Found"
        description="The writing you're looking for doesn't exist."
        action={{
          label: "Back to Writings",
          onClick: () => router.push("/writings"),
        }}
      />
    );
  }

  const analyses = analysesData?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-fg tracking-tight">
            {writing.title}
          </h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-muted">
            <span>
              <span className="text-subtle">Type:</span>{" "}
              {writing.type.replace("_", " ")}
            </span>
            <span>
              <span className="text-subtle">Status:</span>{" "}
              {writing.status.replace("_", " ")}
            </span>
            <span>
              <span className="text-subtle">Words:</span>{" "}
              {wordCount(writing.content)}
            </span>
            <span>{estimateReadingTime(writing.content)}</span>
            <span>
              <span className="text-subtle">Updated:</span>{" "}
              {formatDateTime(writing.updatedAt)}
            </span>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap flex-shrink-0">
          <Link href={`/writings/${id}/edit`}>
            <Button>Edit Writing</Button>
          </Link>
          <Link href={`/writings/${id}/suggestions`}>
            <Button variant="secondary">Suggestions</Button>
          </Link>
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
        </div>
      </div>

      {/* Writing Content */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h2 className="text-sm font-semibold text-fg mb-4">Content</h2>
        <div className="whitespace-pre-wrap text-fg/90 leading-relaxed text-base">
          {writing.content}
        </div>
      </div>

      {/* Analyses Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-fg tracking-tight">
            AI Analytics
          </h2>
          <Button
            onClick={handleGenerateAiAnalytics}
            isLoading={createAiAnalytics.isPending}
            disabled={createAiAnalytics.isPending}
          >
            {createAiAnalytics.isPending
              ? "Generating..."
              : "Generate AI Analytics"}
          </Button>
        </div>

        {aiError && (
          <Alert
            type="error"
            title="Error"
            message={aiError}
            onClose={() => setAiError(null)}
          />
        )}

        {analysesLoading ? (
          <Loading text="Loading analyses..." />
        ) : analyses.length === 0 ? (
          <div className="bg-surface border border-border rounded-xl p-12 text-center">
            <div className="text-4xl mb-3 opacity-60">📊</div>
            <h3 className="text-lg font-semibold text-fg mb-1.5">
              No analyses yet
            </h3>
            <p className="text-sm text-muted mb-6">
              Generate an AI analysis to get feedback on your writing.
            </p>
            <div className="flex justify-center">
              <Button
                onClick={handleGenerateAiAnalytics}
                disabled={createAiAnalytics.isPending}
              >
                Generate First Analytics
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {analyses.map((analysis) => (
              <div
                key={analysis.id}
                className="bg-surface border border-border rounded-xl p-6 flex flex-col gap-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-fg">
                      Analytics Report
                    </p>
                    <p className="text-xs text-subtle mt-1">
                      Generated {formatDateTime(analysis.createdAt)}
                    </p>
                  </div>
                  <Link href={`/analysis/${analysis.id}`}>
                    <Button size="sm">View Details</Button>
                  </Link>
                </div>

                {analysis.feedbackJson && (
                  <div className="max-h-96 overflow-y-auto">
                    <pre className="bg-surface-2 rounded-lg border border-border p-4 text-sm text-muted whitespace-pre-wrap break-words font-mono leading-relaxed">
                      {JSON.stringify(analysis.feedbackJson, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
