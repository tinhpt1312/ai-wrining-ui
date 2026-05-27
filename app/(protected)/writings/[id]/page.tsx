"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  useWriting,
  useAnalysesByWriting,
  useCreateAiAnalysis,
} from "@/hooks/useApi";
import {
  Card,
  Loading,
  Error,
  EmptyState,
  Alert,
} from "@/components/ui/States";
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
  const createAiAnalysis = useCreateAiAnalysis();
  const [aiError, setAiError] = useState<string | null>(null);

  const handleGenerateAiAnalysis = async () => {
    if (!writing) return;

    try {
      setAiError(null);
      await createAiAnalysis.mutateAsync({
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
    <div className="max-w-4xl mx-auto space-y-6">
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

        <div className="flex gap-2 flex-wrap">
          <Link href={`/writings/${id}/edit`}>
            <Button>Edit</Button>
          </Link>
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
        </div>
      </div>

      {/* Content */}
      <Card className="prose prose-invert max-w-none dark:prose-invert">
        <div className="whitespace-pre-wrap text-black dark:text-white">
          {writing.content}
        </div>
      </Card>

      {/* Analyses Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            Analyses
          </h2>
          <Button
            onClick={handleGenerateAiAnalysis}
            isLoading={createAiAnalysis.isPending}
            disabled={createAiAnalysis.isPending}
          >
            Generate AI Analysis
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
          <EmptyState
            icon="📊"
            title="No analyses yet"
            description="Generate an AI analysis to get feedback on your writing."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {analyses.map((analysis) => (
              <Card key={analysis.id} className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Analysis created {formatDateTime(analysis.createdAt)}
                    </p>
                  </div>
                  <Link href={`/analysis/${analysis.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>

                {analysis.feedbackJson && (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    <pre className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-words">
                      {JSON.stringify(analysis.feedbackJson, null, 2)}
                    </pre>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
