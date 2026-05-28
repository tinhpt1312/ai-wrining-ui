"use client";

import React, { useState, useEffect } from "react";
import { useApi } from "@/hooks/useApi";

interface DailyTip {
  id: string;
  title: string;
  content: string;
  category: string;
  exampleBefore?: string;
  exampleAfter?: string;
  isRead: boolean;
  createdAt: string;
}

export default function DailyTipsCard() {
  const api = useApi();
  const [tip, setTip] = useState<DailyTip | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showExample, setShowExample] = useState(false);

  useEffect(() => {
    fetchDailyTip();
    fetchUnreadCount();
  }, []);

  const fetchDailyTip = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/daily-tips/today");
      setTip(response.data || null);
    } catch (error) {
      console.error("Failed to fetch daily tip:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get("/api/daily-tips/unread/count");
      setUnreadCount(response.count || 0);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  const markAsRead = async () => {
    if (!tip) return;
    try {
      await api.patch(`/api/daily-tips/${tip.id}/mark-as-read`, {});
      setTip({ ...tip, isRead: true });
      if (unreadCount > 0) {
        setUnreadCount(unreadCount - 1);
      }
    } catch (error) {
      console.error("Failed to mark tip as read:", error);
    }
  };

  const generateNewTip = async () => {
    try {
      setLoading(true);
      const response = await api.post("/api/daily-tips/generate", {});
      setTip(response.data);
    } catch (error) {
      console.error("Failed to generate tip:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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

  if (!tip) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">📚 Daily Tip</h2>
        <p className="text-gray-600 mb-4">No tip available today</p>
        <button
          onClick={generateNewTip}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Generate Tip
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
            onClick={markAsRead}
            className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Mark as Read
          </button>
        )}
        <button
          onClick={generateNewTip}
          className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
        >
          Next Tip
        </button>
      </div>
    </div>
  );
}
