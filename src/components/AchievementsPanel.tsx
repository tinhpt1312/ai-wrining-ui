"use client";

import React from "react";
import { useUserAchievements, useUserAchievementsStats } from "@/hooks/useApi";

export default function AchievementsPanel() {
  // Fetch user achievements
  const {
    data: achievementsData,
    isLoading: isAchievementsLoading,
    error: achievementsError,
  } = useUserAchievements();

  // Fetch user stats
  const {
    data: stats,
    isLoading: isStatsLoading,
    error: statsError,
  } = useUserAchievementsStats();

  const achievements = achievementsData?.data || [];
  const loading = isAchievementsLoading || isStatsLoading;

  const getProgressPercentage = (progress: number, requirement: number) => {
    return Math.min((progress / requirement) * 100, 100);
  };

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;

  if (loading) {
    return (
      <div className="animate-pulse bg-white rounded-lg shadow p-6 h-64"></div>
    );
  }

  if (achievementsError || statsError) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">🏆 Achievements & Stats</h2>
        <p className="text-red-500">
          {achievementsError
            ? "Failed to load achievements"
            : "Failed to load stats"}
        </p>
      </div>
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
              {achievements.length > 0 ? unlockedCount : 0}
            </div>
            <div className="text-sm text-gray-600 mt-1">Unlocked</div>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {achievements.length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Total</div>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Achievements</h3>
        {achievements.length === 0 ? (
          <p className="text-gray-500">No achievements yet. Keep writing!</p>
        ) : (
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
                    <span className="text-3xl">
                      {ach.achievement.iconEmoji || "🏅"}
                    </span>
                    <div>
                      <h4 className="font-semibold">{ach.achievement.name}</h4>
                      <p className="text-sm text-gray-600">
                        {ach.achievement.description}
                      </p>
                    </div>
                  </div>
                  {ach.isUnlocked && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2">
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
                      {Math.round(
                        getProgressPercentage(
                          ach.progress,
                          ach.achievement.requirementValue,
                        ),
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        ach.isUnlocked ? "bg-green-500" : "bg-blue-500"
                      }`}
                      style={{
                        width: `${getProgressPercentage(
                          ach.progress,
                          ach.achievement.requirementValue,
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
