"use client";

import React, { useState, useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import Link from "next/link";

interface LearningPath {
  category: {
    id: string;
    key: string;
    name: string;
    description: string;
    iconEmoji: string;
  };
  mistakeCount: number;
  progress: number;
  tips: string[];
  exercises: { title: string; description: string }[];
  nextSteps: string[];
}

export default function LearningHub() {
  const api = useApi();
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLearningPaths();
  }, []);

  const fetchLearningPaths = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/feedback-categories/learning-paths");
      const paths = response.data || [];
      setLearningPaths(paths);
      if (paths.length > 0) {
        setSelectedPath(paths[0]);
      }
    } catch (error) {
      console.error("Failed to fetch learning paths:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 20) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse bg-white rounded-lg shadow p-6 h-96"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Learning Paths List */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">🎓 Learning Paths</h2>
          <div className="space-y-2">
            {learningPaths.map((path) => (
              <button
                key={path.category.id}
                onClick={() => setSelectedPath(path)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedPath?.category.id === path.category.id
                    ? "bg-blue-100 border-2 border-blue-500"
                    : "bg-gray-50 border-2 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{path.category.iconEmoji}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">
                      {path.category.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {path.mistakeCount} issues
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-300 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${getProgressColor(
                        path.progress,
                      )}`}
                      style={{ width: `${path.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {Math.round(path.progress)}% complete
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Path Details */}
      {selectedPath && (
        <div className="lg:col-span-2 space-y-6">
          {/* Category Header */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start gap-4">
              <div className="text-6xl">{selectedPath.category.iconEmoji}</div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">
                  {selectedPath.category.name}
                </h1>
                <p className="text-gray-600 mt-2">
                  {selectedPath.category.description}
                </p>

                <div className="mt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold">Your Progress</span>
                    <span className="text-sm font-semibold">
                      {Math.round(selectedPath.progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${getProgressColor(
                        selectedPath.progress,
                      )}`}
                      style={{ width: `${selectedPath.progress}%` }}
                    ></div>
                  </div>
                </div>

                {selectedPath.mistakeCount > 0 && (
                  <p className="mt-3 text-sm text-orange-600 font-semibold">
                    📌 {selectedPath.mistakeCount} recent issues found
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Tips */}
          {selectedPath.tips.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-4">💡 Quick Tips</h3>
              <div className="space-y-2">
                {selectedPath.tips.map((tip, idx) => (
                  <div key={idx} className="flex gap-3 p-3 bg-blue-50 rounded">
                    <span className="text-blue-600 font-bold">✓</span>
                    <p className="text-gray-700">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exercises */}
          {selectedPath.exercises.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-4">📋 Practice Exercises</h3>
              <div className="space-y-3">
                {selectedPath.exercises.map((exercise, idx) => (
                  <div
                    key={idx}
                    className="border-l-4 border-blue-500 pl-4 py-2"
                  >
                    <h4 className="font-semibold">{exercise.title}</h4>
                    <p className="text-sm text-gray-600">
                      {exercise.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Steps */}
          {selectedPath.nextSteps.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-4">🎯 Next Steps</h3>
              <ol className="space-y-2">
                {selectedPath.nextSteps.map((step, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="font-bold text-blue-600 flex-shrink-0">
                      {idx + 1}.
                    </span>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
