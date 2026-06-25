"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Globe,
  PenLine,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/button";
import { ROUTES } from "@/constants/routes.constants";

export function LandingHero({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <section className="relative mx-auto max-w-7xl px-4 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-24 lg:px-8 lg:pt-20">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Nền tảng luyện viết &amp; chấm bài bằng AI
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-fg sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
              Viết hay hơn.
              <span className="block text-primary">Chấm thông minh.</span>
              Tiến bộ từng ngày.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              Soạn bài luận, truyện ngắn hoặc bài báo — nhận phản hồi chi tiết
              từ AI, chữa bài theo gợi ý và theo dõi điểm số qua từng lần chỉnh
              sửa.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {isAuthenticated ? (
              <>
                <Link href={ROUTES.WRITING_NEW}>
                  <Button size="lg" className="w-full gap-2 btn-glow-solid sm:w-auto">
                    <PenLine className="h-4 w-4" />
                    Viết bài mới
                  </Button>
                </Link>
                <Link href={ROUTES.DASHBOARD}>
                  <Button size="lg" variant="secondary" className="w-full gap-2 sm:w-auto">
                    Tổng quan
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href={ROUTES.REGISTER}>
                  <Button size="lg" className="w-full gap-2 btn-glow-solid sm:w-auto">
                    Bắt đầu miễn phí
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={ROUTES.LOGIN}>
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Đăng nhập
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-6 pt-2 text-sm text-muted">
            <span className="inline-flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Theo dõi tiến bộ điểm số
            </span>
            <span className="inline-flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              Chia sẻ bài công khai
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-4 rounded-3xl bg-primary/10 blur-3xl"
          />
          <div className="panel-glass relative space-y-4 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted">
                  Bài luận xã hội
                </p>
                <p className="mt-1 font-semibold text-fg">
                  Trách nhiệm công dân trong thời đại số
                </p>
              </div>
              <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl border-2 border-success/40 bg-surface-2/80 shadow-[0_0_20px_var(--glow-primary)]">
                <span className="stat-value text-lg font-bold text-success">8.5</span>
                <span className="text-[10px] text-subtle">/10</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Bố cục", score: 9 },
                { label: "Rõ ràng", score: 8 },
                { label: "Giọng điệu", score: 8 },
                { label: "Liên kết", score: 9 },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-border/60 bg-surface-2/50 px-3 py-2.5"
                >
                  <p className="text-xs text-muted">{item.label}</p>
                  <p className="stat-value mt-0.5 text-sm font-bold text-fg">
                    {item.score}/10
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-xs font-medium text-primary">Gợi ý từ AI</p>
              <p className="mt-1.5 text-sm leading-relaxed text-fg">
                Mở đoạn kết luận bằng câu khẳng định rõ quan điểm, sau đó liên
                hệ trực tiếp với trách nhiệm cá nhân.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
