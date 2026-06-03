"use client";

import React, { useState } from "react";
import {
  useTodayTip,
  useUnreadTipsCount,
  useUpdateDailyTip,
  useGenerateDailyTip,
} from "@/hooks/useApi";

export default function DailyTipsCard() {
  const [showExample, setShowExample] = useState(false);

  // Fetch today's tip
  const {
    data: tip,
    isLoading: isTipLoading,
    error: tipError,
    refetch: refetchTip,
  } = useTodayTip();

  // Fetch unread count
  const {
    data: unreadData,
    error: unreadError,
    refetch: refetchUnreadCount,
  } = useUnreadTipsCount();

  // Mark tip as read mutation
  const { mutate: markAsRead, isPending: isMarkingAsRead } =
    useUpdateDailyTip();

  // Generate new tip mutation
  const { mutate: generateNewTip, isPending: isGenerating } =
    useGenerateDailyTip();

  const unreadCount = unreadData?.count || 0;

  const handleMarkAsRead = () => {
    if (!tip?.id) return;
    markAsRead(
      { id: tip.id, payload: { isRead: true } },
      {
        onSuccess: () => {
          refetchUnreadCount();
        },
      },
    );
  };

  const handleGenerateNewTip = () => {
    generateNewTip(undefined, {
      onSuccess: () => {
        refetchUnreadCount();
      },
    });
  };

  if (isTipLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-100 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (tipError || !tip) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">📚 Daily Tip</h2>
        <p className="text-gray-600 mb-4">
          {tipError ? "Failed to load today's tip" : "No tip available today"}
        </p>
        <button
          onClick={handleGenerateNewTip}
          disabled={isGenerating}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isGenerating ? "Generating..." : "Generate Tip"}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">{tip.title}</h2>
          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
            {tip.category}
          </span>
          {unreadCount > 0 && (
            <span className="ml-2 inline-block bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
              {unreadCount} unread
            </span>
          )}
          {unreadError && (
            <span className="ml-2 text-red-500 text-xs">
              (Error loading unread count)
            </span>
          )}
        </div>
      </div>

      <p className="text-gray-700 mb-4">{tip.content}</p>

      {tip.exampleBefore && tip.exampleAfter && (
        <div className="bg-gray-50 rounded p-4 mb-4">
          <button
            onClick={() => setShowExample(!showExample)}
            className="text-blue-600 font-semibold mb-2 hover:underline"
          >
            {showExample ? "▼" : "▶"} View Examples
          </button>

          {showExample && (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-red-600 mb-1">
                  Before:
                </p>
                <p className="text-sm bg-red-50 p-2 rounded italic">
                  "{tip.exampleBefore}"
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-green-600 mb-1">
                  After:
                </p>
                <p className="text-sm bg-green-50 p-2 rounded italic">
                  "{tip.exampleAfter}"
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2">
        {!tip.isRead && (
          <button
            onClick={handleMarkAsRead}
            disabled={isMarkingAsRead}
            className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {isMarkingAsRead ? "Marking..." : "Mark as Read"}
          </button>
        )}
        <button
          onClick={handleGenerateNewTip}
          disabled={isGenerating}
          className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 disabled:bg-gray-300"
        >
          {isGenerating ? "Generating..." : "Next Tip"}
        </button>
      </div>
    </div>
  );
}
