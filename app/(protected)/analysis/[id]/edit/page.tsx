"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAnalysis, useUpdateAnalysis } from "@/hooks/useApi";
import { Loading, Error as ErrorState } from "@/components/ui/States";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { formatDateTime } from "@/utils/helpers";

interface AnalysisEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function AnalysisEditPage({ params }: AnalysisEditPageProps) {
  const router = useRouter();
  const { id } = use(params);

  const { data: analysis, isLoading, error } = useAnalysis(id);
  const { mutate: updateAnalysis, isPending: isUpdating } = useUpdateAnalysis();

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

      updateAnalysis(
        {
          id,
          payload: {
            feedbackJson: parsedFeedback,
          },
        },
        {
          onSuccess: () => {
            alert("Analysis updated successfully!");
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
        title="Failed to Load Analysis"
        message="Could not fetch this analysis for editing."
      />
    );
  }

  if (!analysis) {
    return null;
  }

  const hasChanges = editedFeedback !== feedbackJson;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href={`/analysis/${id}`}>
              <Button variant="secondary">Back</Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Analysis</h1>
          <p className="text-gray-600 mt-2">
            Update the feedback for this analysis
          </p>
        </div>

        {/* Analysis Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Analysis Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Analysis ID</p>
              <p className="text-gray-900 font-mono text-sm mt-1">
                {analysis.id}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Created</p>
              <p className="text-gray-900 mt-1">
                {formatDateTime(analysis.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Writing ID</p>
              <p className="text-gray-900 font-mono text-sm mt-1">
                {analysis.writingId}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="text-gray-900 mt-1">
                {formatDateTime(analysis.updatedAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Feedback Editor */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Feedback (JSON)
          </h2>
          <Textarea
            value={editedFeedback}
            onChange={(e) => setEditedFeedback(e.target.value)}
            placeholder="Enter JSON feedback..."
            className="font-mono text-sm mb-4 min-h-64"
          />

          {/* Help text */}
          <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-6">
            <p className="text-sm text-blue-900">
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
                  <div className="bg-red-50 border border-red-200 rounded p-3 mb-6">
                    <p className="text-sm text-red-900">
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
    </div>
  );
}
