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
          <h1 className="text-3xl font-bold text-black dark:text-white">
            {writing.title}
          </h1>
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
            <span>
              <span className="font-medium">Type:</span>{" "}
              {writing.type.replace("_", " ")}
            </span>
            <span>
              <span className="font-medium">Status:</span>{" "}
              {writing.status.replace("_", " ")}
            </span>
            <span>
              <span className="font-medium">Words:</span>{" "}
              {wordCount(writing.content)}
            </span>
            <span>{estimateReadingTime(writing.content)}</span>
            <span>
              <span className="font-medium">Updated:</span>{" "}
              {formatDateTime(writing.updatedAt)}
            </span>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap flex-shrink-0">
          <Link href={`/writings/${id}/edit`}>
            <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium">
              Edit Writing
            </Button>
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
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-black dark:text-white mb-4">
          Content
        </h2>
        <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed font-normal text-base">
          {writing.content}
        </div>
      </div>

      {/* Analyses Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            AI Analytics
          </h2>
          <Button
            onClick={handleGenerateAiAnalytics}
            isLoading={createAiAnalytics.isPending}
            disabled={createAiAnalytics.isPending}
            className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white font-medium"
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
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-12 text-center">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
              No analyses yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Generate an AI analysis to get feedback on your writing.
            </p>
            <Button
              onClick={handleGenerateAiAnalytics}
              disabled={createAiAnalytics.isPending}
              className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white font-medium mx-auto"
            >
              Generate First Analytics
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {analyses.map((analysis) => (
              <div
                key={analysis.id}
                className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 flex flex-col gap-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Analytics Report
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Generated {formatDateTime(analysis.createdAt)}
                    </p>
                  </div>
                  <Link href={`/analysis/${analysis.id}`}>
                    <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium">
                      View Details
                    </Button>
                  </Link>
                </div>

                {analysis.feedbackJson && (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    <div className="bg-gray-50 dark:bg-gray-950 rounded border border-gray-200 dark:border-gray-800 p-4">
                      <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words font-mono leading-relaxed">
                        {JSON.stringify(analysis.feedbackJson, null, 2)}
                      </pre>
                    </div>
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
