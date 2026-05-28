"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAnalytics, useUpdateAnalytics } from "@/hooks/useApi";
import { Loading, Error as ErrorState } from "@/components/ui/States";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { formatDateTime } from "@/utils/helpers";

interface AnalyticsEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function AnalyticsEditPage({ params }: AnalyticsEditPageProps) {
  const router = useRouter();
  const { id } = use(params);

  const { data: analysis, isLoading, error } = useAnalytics(id);
  const { mutate: updateAnalytics, isPending: isUpdating } =
    useUpdateAnalytics();

  const [feedbackJson, setFeedbackJson] = useState<string>("");
  const [editedFeedback, setEditedFeedback] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form when analysis loads
  useEffect(() => {
    if (analysis?.feedbackJson) {
      const jsonString = JSON.stringify(analysis.feedbackJson, null, 2);
      setFeedbackJson(jsonString);
      setEditedFeedback(jsonString);
    } else {
      setFeedbackJson("{}");
      setEditedFeedback("{}");
    }
  }, [analysis]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      let parsedFeedback: Record<string, any>;

      try {
        parsedFeedback = JSON.parse(editedFeedback);
      } catch {
        alert("Invalid JSON format. Please check your feedback.");
        setIsSaving(false);
        return;
      }

      updateAnalytics(
        {
          id,
          payload: {
            feedbackJson: parsedFeedback,
          },
        },
        {
          onSuccess: () => {
            alert("Analytics updated successfully!");
            router.push(`/analysis/${id}`);
          },
          onError: (err) => {
            alert(
              `Failed to update: ${err instanceof Error ? err.message : "Unknown error"}`,
            );
            setIsSaving(false);
          },
        },
      );
    } catch (err) {
      console.error("Error saving analysis:", err);
      alert("An error occurred while saving");
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Loading text="Loading analysis..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to Load Analytics"
        message="Could not fetch this analysis for editing."
      />
    );
  }

  if (!analysis) {
    return null;
  }

  const hasChanges = editedFeedback !== feedbackJson;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-4 mb-4">
          <Link href={`/analysis/${id}`}>
            <Button variant="secondary">Back</Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Edit Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Update the feedback for this analysis
        </p>
      </div>

      {/* Analytics Info */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-black dark:text-white mb-4">
          Analytics Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Analytics ID
            </p>
            <p className="text-black dark:text-white font-mono text-sm mt-2 break-all">
              {analysis.id}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Created</p>
            <p className="text-black dark:text-white mt-2">
              {formatDateTime(analysis.createdAt)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Writing ID
            </p>
            <p className="text-black dark:text-white font-mono text-sm mt-2 break-all">
              {analysis.writingId}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last Updated
            </p>
            <p className="text-black dark:text-white mt-2">
              {formatDateTime(analysis.updatedAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Feedback Editor */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-black dark:text-white mb-4">
          Feedback (JSON)
        </h2>
        <Textarea
          value={editedFeedback}
          onChange={(e) => setEditedFeedback(e.target.value)}
          placeholder="Enter JSON feedback..."
          className="font-mono text-sm mb-4 min-h-96 w-full bg-gray-50 dark:bg-gray-950 text-black dark:text-white border border-gray-200 dark:border-gray-800 p-4 rounded"
        />

        {/* Help text */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-4 mb-6">
          <p className="text-sm text-blue-900 dark:text-blue-300">
            💡 <strong>Tip:</strong> Enter valid JSON format for the feedback.
            Use objects and arrays to structure your analysis.
          </p>
        </div>

        {/* Error validation */}
        {editedFeedback &&
          editedFeedback !== "{}" &&
          (() => {
            try {
              JSON.parse(editedFeedback);
              return null;
            } catch (e) {
              return (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-4 mb-6">
                  <p className="text-sm text-red-900 dark:text-red-300">
                    ⚠️ <strong>Invalid JSON:</strong>{" "}
                    {e instanceof Error ? e.message : "Check JSON format"}
                  </p>
                </div>
              );
            }
          })()}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isUpdating || isSaving}
            className="flex-1"
          >
            {isSaving || isUpdating ? "Saving..." : "Save Changes"}
          </Button>
          <Link href={`/analysis/${id}`} className="flex-1">
            <Button variant="secondary" className="w-full">
              Cancel
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
