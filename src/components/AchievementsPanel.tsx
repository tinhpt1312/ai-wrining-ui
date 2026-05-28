"use client";

import React, { useState, useEffect } from "react";
import { useApi } from "@/hooks/useApi";

interface Achievement {
  achievement: {
    id: string;
    name: string;
    description: string;
    iconEmoji: string;
    pointsReward: number;
    requirementType: string;
    requirementValue: number;
  };
  progress: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export default function AchievementsPanel() {
  const api = useApi();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
    fetchUserStats();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await api.get("/api/achievements/my");
      setAchievements(response.data || []);
    } catch (error) {
      console.error("Failed to fetch achievements:", error);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await api.get("/api/achievements/stats/my");
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = (achievement: Achievement) => {
    const max = achievement.achievement.requirementValue;
    const progress = achievement.progress;
    return Math.min((progress / max) * 100, 100);
  };

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;

  if (loading) {
    return (
      <div className="animate-pulse bg-white rounded-lg shadow p-6 h-64"></div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">🏆 Achievements & Stats</h2>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {stats.totalPoints}
            </div>
            <div className="text-sm text-gray-600 mt-1">Points</div>
          </div>
          <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {stats.level}
            </div>
            <div className="text-sm text-gray-600 mt-1">Level</div>
          </div>
          <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-red-600">
              {stats.currentStreak}
            </div>
            <div className="text-sm text-gray-600 mt-1">Streak</div>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {unlockedCount}
            </div>
            <div className="text-sm text-gray-600 mt-1">Unlocked</div>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Achievements</h3>
        <div className="space-y-3">
          {achievements.slice(0, 5).map((ach) => (
            <div
              key={ach.achievement.id}
              className={`p-4 rounded-lg border-2 ${
                ach.isUnlocked
                  ? `border-yellow-300 bg-yellow-50`
                  : `border-gray-200 bg-gray-50`
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{ach.achievement.iconEmoji}</span>
                  <div>
                    <h4 className="font-semibold">{ach.achievement.name}</h4>
                    <p className="text-sm text-gray-600">
                      {ach.achievement.description}
                    </p>
                  </div>
                </div>
                {ach.isUnlocked && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                    +{ach.achievement.pointsReward}pts
                  </span>
                )}
              </div>

              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">
                    Progress: {ach.progress} /{" "}
                    {ach.achievement.requirementValue}
                  </span>
                  <span className="font-semibold">
                    {Math.round(getProgressPercentage(ach))}%
                  </span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      ach.isUnlocked ? "bg-green-500" : "bg-blue-500"
                    }`}
                    style={{ width: `${getProgressPercentage(ach)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
