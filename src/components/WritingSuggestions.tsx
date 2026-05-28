"use client";

import React, { useState, useEffect } from "react";
import { useApi } from "@/hooks/useApi";

interface Suggestion {
  id: string;
  type: string;
  originalText: string;
  suggestedText: string;
  explanation: string;
  confidenceScore: number;
  severity: string;
  isApplied: boolean;
}

interface WritingSuggestionsProps {
  writingId: string;
}

export default function WritingSuggestions({
  writingId,
}: WritingSuggestionsProps) {
  const api = useApi();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchSuggestions();
    fetchStats();
  }, [writingId]);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/api/writing-suggestions/writing/${writingId}`,
      );
      setSuggestions(response.data || []);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get(
        `/api/writing-suggestions/writing/${writingId}/stats`,
      );
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const generateSuggestions = async () => {
    try {
      setGenerating(true);
      await api.post("/api/writing-suggestions/generate", {
        writingId,
        focusAreas: ["grammar", "clarity", "style"],
      });
      await fetchSuggestions();
      await fetchStats();
    } catch (error) {
      console.error("Failed to generate suggestions:", error);
    } finally {
      setGenerating(false);
    }
  };

  const applySuggestion = async (suggestionId: string) => {
    try {
      await api.patch(`/api/writing-suggestions/${suggestionId}/apply`, {
        writingId,
        updateWriting: false,
      });
      await fetchSuggestions();
    } catch (error) {
      console.error("Failed to apply suggestion:", error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "suggestion":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      grammar: "📝",
      vocabulary: "📚",
      punctuation: "🎯",
      style: "✨",
      clarity: "💡",
      tone: "🎤",
    };
    return icons[type] || "💬";
  };

  if (loading && suggestions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-100 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">✏️ Writing Suggestions</h2>
        <button
          onClick={generateSuggestions}
          disabled={generating}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {generating ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">Total Issues</div>
          </div>
          <div className="bg-green-50 rounded p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.applied}
            </div>
            <div className="text-sm text-gray-600">Applied</div>
          </div>
          <div className="bg-purple-50 rounded p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {((stats.applied / Math.max(stats.total, 1)) * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-gray-600">Progress</div>
          </div>
        </div>
      )}

      {suggestions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No suggestions yet</p>
          <button
            onClick={generateSuggestions}
            disabled={generating}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {generating ? "Analyzing..." : "Generate Suggestions"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className={`border-2 rounded-lg p-4 ${getSeverityColor(
                suggestion.severity,
              )}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    {getTypeIcon(suggestion.type)}
                  </span>
                  <span className="font-semibold capitalize">
                    {suggestion.type}
                  </span>
                  <span className="text-xs px-2 py-1 rounded bg-opacity-30 bg-gray-800 capitalize">
                    {suggestion.severity}
                  </span>
                </div>
                <span className="text-xs text-gray-600">
                  Confidence: {(suggestion.confidenceScore * 100).toFixed(0)}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs font-semibold text-red-600 mb-1">
                    Original:
                  </p>
                  <p className="text-sm italic bg-red-50 p-2 rounded">
                    "{suggestion.originalText}"
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-green-600 mb-1">
                    Suggested:
                  </p>
                  <p className="text-sm italic bg-green-50 p-2 rounded">
                    "{suggestion.suggestedText}"
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-3">
                {suggestion.explanation}
              </p>

              {!suggestion.isApplied && (
                <button
                  onClick={() => applySuggestion(suggestion.id)}
                  className="bg-blue-500 text-white px-4 py-1 rounded text-sm hover:bg-blue-600"
                >
                  Apply
                </button>
              )}
              {suggestion.isApplied && (
                <span className="text-xs text-green-600 font-semibold">
                  ✓ Applied
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
