"use client";

import { useMemo } from "react";
import Link from "next/link";
import { FileText, AlignLeft, Sparkles, Zap } from "lucide-react";
import {
  useWritingStats,
  useAnalyticsStats,
  useTokenUsage,
  useWritings,
} from "@/features/dashboard";
import { Loading } from "@/components";
import { Button } from "@/components/button";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/features/dashboard";
import { ROUTES } from "@/constants/routes.constants";

export default function Dashboard() {
  const { data: writingStats, isLoading: writingStatsLoading } =
    useWritingStats();
  const { data: analysisStats, isLoading: analysisStatsLoading } =
    useAnalyticsStats();
  const { data: tokenUsage, isLoading: tokenUsageLoading } = useTokenUsage();
  const { data: writings, isLoading: writingsLoading } = useWritings({
    limit: 5,
  });

  const isLoading =
    writingStatsLoading ||
    analysisStatsLoading ||
    tokenUsageLoading ||
    writingsLoading;

  const tokenPercentage = useMemo(() => {
    if (!tokenUsage) return 0;
    return Math.round((tokenUsage.used / tokenUsage.limit) * 100);
  }, [tokenUsage]);

  const recentWritings = useMemo(() => {
    return writings?.data || [];
  }, [writings]);

  if (isLoading) {
    return <Loading text="Đang tải tổng quan..." />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Tổng quan"
        description="Chào mừng bạn quay lại! Đây là tóm tắt hoạt động viết của bạn."
        actions={
          <Link href={ROUTES.WRITING_NEW}>
            <Button>Viết bài mới</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Tổng bài viết"
          value={writingStats?.totalWritings || 0}
          icon={FileText}
          tone="primary"
        />
        <StatCard
          label="Tổng số chữ"
          value={writingStats?.totalWords || 0}
          icon={AlignLeft}
          tone="info"
        />
        <StatCard
          label="Lần chấm bài"
          value={analysisStats?.totalAnalyses || 0}
          icon={Sparkles}
          tone="success"
        />
        <StatCard
          label="Token đã dùng"
          value={`${tokenPercentage}%`}
          icon={Zap}
          tone="warning"
          hint={
            tokenUsage
              ? `${tokenUsage.used.toLocaleString("vi-VN")} / ${tokenUsage.limit.toLocaleString("vi-VN")}`
              : undefined
          }
        />
      </div>

      {tokenUsage && (
        <div className="card-elevated p-5">
          <h2 className="text-sm font-semibold text-fg mb-3">
            Hạn mức token hôm nay
          </h2>
          <div className="w-full bg-surface-2 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                tokenPercentage > 80
                  ? "bg-error"
                  : tokenPercentage > 50
                    ? "bg-warning"
                    : "bg-success"
              }`}
              style={{ width: `${Math.min(tokenPercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted">
            <span>Đã dùng: {tokenUsage.used.toLocaleString("vi-VN")} token</span>
            <span>
              Làm mới:{" "}
              {new Date(tokenUsage.resetAt).toLocaleDateString("vi-VN", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-elevated p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-fg">Bài viết gần đây</h2>
            <Link
              href={ROUTES.WRITINGS}
              className="text-sm text-primary font-medium hover:underline"
            >
              Xem tất cả
            </Link>
          </div>
          {recentWritings.length > 0 ? (
            <div className="space-y-1.5">
              {recentWritings.map((writing) => (
                <Link
                  key={writing.id}
                  href={ROUTES.writing(writing.id)}
                  className="block px-3 py-2.5 rounded-lg hover:bg-surface-2 transition-colors"
                >
                  <p className="font-medium text-fg truncate text-sm">
                    {writing.title}
                  </p>
                  <p className="text-xs text-subtle mt-0.5">
                    {new Date(writing.createdAt).toLocaleDateString("vi-VN", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted text-sm py-4">Chưa có bài viết nào</p>
          )}
        </div>

        <div className="card-elevated p-5">
          <h2 className="text-sm font-semibold text-fg mb-4">Thao tác nhanh</h2>
          <div className="space-y-2.5">
            <Link href={ROUTES.WRITING_NEW} className="block">
              <Button className="w-full">Viết bài mới</Button>
            </Link>
            <Link href={ROUTES.ANALYSIS} className="block">
              <Button className="w-full" variant="secondary">
                Xem kết quả chấm
              </Button>
            </Link>
            <Link href={ROUTES.WRITINGS} className="block">
              <Button className="w-full" variant="secondary">
                Danh sách bài viết
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
