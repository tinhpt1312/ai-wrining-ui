"use client";

import React, { useState } from "react";
import { useFeedbackCategories } from "@/hooks/useApi";

interface LearningPath {
  category: {
    id: string;
    key: string;
    name: string;
    description: string;
    iconEmoji?: string;
  };
  tips: string[];
  exercises: Array<{
    title: string;
    description: string;
  }>;
}

export default function LearningHub() {
  // Fetch feedback categories
  const {
    data: categoriesData,
    isLoading,
    error,
  } = useFeedbackCategories();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const categories = categoriesData?.data || [];

  // Set first category as selected when data loads
  React.useEffect(() => {
    if (categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  const selectedCategory = categories.find(
    (cat) => cat.id === selectedCategoryId,
  );

  const selectedPath: LearningPath | null = selectedCategory
    ? {
        category: {
          id: selectedCategory.id,
          key: selectedCategory.key,
          name: selectedCategory.name,
          description: selectedCategory.description,
          iconEmoji: selectedCategory.iconEmoji,
        },
        tips: selectedCategory.learningResources?.tips || [],
        exercises: selectedCategory.learningResources?.exercises || [],
      }
    : null;

  const getProgressColor = (index: number) => {
    const colors = ["bg-red-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];
    return colors[Math.min(index, colors.length - 1)];
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse bg-white rounded-lg shadow p-6 h-96"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Error Loading Learning Hub</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Learning Categories List */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">🎓 Learning Topics</h2>
          <div className="space-y-2">
            {categories.length === 0 ? (
              <p className="text-gray-500">No learning topics available</p>
            ) : (
              categories.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategoryId(category.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedCategoryId === category.id
                      ? "bg-blue-100 border-2 border-blue-500"
                      : "bg-gray-50 border-2 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {category.iconEmoji || "📚"}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{category.name}</p>
                      <p className="text-xs text-gray-600">{category.key}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-300 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${getProgressColor(index)}`}
                        style={{
                          width: `${((index + 1) / categories.length) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Learning Topic Details */}
      {selectedPath && (
        <div className="lg:col-span-2 space-y-6">
          {/* Category Header */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start gap-4">
              <div className="text-6xl">
                {selectedPath.category.iconEmoji || "📚"}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">
                  {selectedPath.category.name}
                </h1>
                <p className="text-gray-600 mt-2">
                  {selectedPath.category.description}
                </p>
                <div className="mt-4 inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {selectedPath.category.key}
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          {selectedPath.tips && selectedPath.tips.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-4">💡 Tips & Guidelines</h3>
              <div className="space-y-3">
                {selectedPath.tips.map((tip, idx) => (
                  <div key={idx} className="flex gap-3 p-3 bg-blue-50 rounded">
                    <span className="text-blue-600 font-bold flex-shrink-0">
                      ✓
                    </span>
                    <p className="text-gray-700">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exercises */}
          {selectedPath.exercises && selectedPath.exercises.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-4">📋 Practice Exercises</h3>
              <div className="space-y-3">
                {selectedPath.exercises.map((exercise, idx) => (
                  <div
                    key={idx}
                    className="border-l-4 border-blue-500 pl-4 py-2"
                  >
                    <h4 className="font-semibold">{exercise.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {exercise.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {(!selectedPath.tips || selectedPath.tips.length === 0) &&
            (!selectedPath.exercises || selectedPath.exercises.length === 0) && (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500">
                  No learning resources available for this topic yet.
                </p>
              </div>
            )}

          {/* Info Card */}
          <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
            <h3 className="font-semibold text-blue-900 mb-2">💬 Tip</h3>
            <p className="text-blue-800 text-sm">
              Practice regularly and apply these tips to your writings to see
              improvement in this area. Each practice exercise reinforces
              important concepts.
            </p>
          </div>
        </div>
      )}

      {/* No category selected */}
      {!selectedPath && categories.length > 0 && (
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">
              Select a topic from the left to view learning resources
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
