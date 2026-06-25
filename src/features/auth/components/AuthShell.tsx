"use client";

import Link from "next/link";
import {
  PenLine,
  Sparkles,
  Lightbulb,
  FileEdit,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { GridBackground } from "@/components/ui/grid-background";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes.constants";

const FEATURES = [
  {
    icon: FileEdit,
    title: "Viết & quản lý bài",
    description: "Soạn, lưu và chỉnh sửa bài luận, truyện ngắn, bài báo.",
  },
  {
    icon: Sparkles,
    title: "Chấm bài bằng AI",
    description: "Nhận phản hồi chi tiết và bài viết mẫu tham khảo.",
  },
  {
    icon: Lightbulb,
    title: "Gợi ý sửa từng câu",
    description: "AI gợi ý chỉnh ngữ pháp, văn phong và cấu trúc.",
  },
];

export function AuthHero({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative hidden lg:flex flex-col justify-between overflow-hidden min-h-full p-12 text-white",
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-primary via-[#4338ca] to-[#0f0a2e]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-indigo-300/25 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-primary/30 blur-[120px]"
      />

      <div className="relative">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm ring-1 ring-white/25 shadow-[0_0_32px_rgba(255,255,255,0.15)]">
          <PenLine className="h-5 w-5" />
        </div>
        <h1 className="mt-8 text-4xl font-bold tracking-tight">
          Viết & Chấm Văn
        </h1>
        <p className="mt-3 max-w-md text-base leading-relaxed text-indigo-100/90">
          Nền tảng viết văn thông minh — luyện viết, nhận phản hồi AI và cải
          thiện từng bài một cách có hệ thống.
        </p>
      </div>

      <ul className="relative mt-12 space-y-3">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <li
              key={feature.title}
              className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10 hover:shadow-[0_0_24px_rgba(99,102,241,0.2)]"
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/10">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">{feature.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-indigo-100/80">
                  {feature.description}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="relative text-sm text-indigo-200/70">
        Miễn phí cho mục đích học tập và luyện viết cá nhân.
      </p>
    </div>
  );
}

interface AuthFormPanelProps {
  mode: "login" | "register";
  children: React.ReactNode;
}

export function AuthFormPanel({ mode, children }: AuthFormPanelProps) {
  const isLogin = mode === "login";

  return (
    <div className="relative flex min-h-full flex-col justify-center px-6 py-10 sm:px-10 lg:px-16">
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6 z-10">
        <ThemeToggle />
      </div>

      <div className="mx-auto w-full max-w-md relative z-10">
        <div className="mb-8 lg:hidden">
          <Link
            href={ROUTES.HOME}
            className="inline-flex items-center gap-2.5 text-lg font-bold text-fg"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30 shadow-[0_0_20px_var(--glow-primary)]">
              <PenLine className="h-4 w-4" />
            </span>
            Viết & Chấm Văn
          </Link>
        </div>

        <div className="mb-8">
          <p className="text-sm font-medium text-primary">
            {isLogin ? "Chào mừng trở lại" : "Bắt đầu hành trình viết"}
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-fg sm:text-3xl">
            {isLogin ? "Đăng nhập tài khoản" : "Tạo tài khoản mới"}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {isLogin
              ? "Nhập thông tin để tiếp tục viết và chấm bài của bạn."
              : "Đăng ký miễn phí để lưu bài viết và nhận phản hồi AI."}
          </p>
        </div>

        <div className="glass-card p-6 sm:p-8 shadow-[0_0_32px_var(--glow-primary)]">
          {children}
        </div>
      </div>
    </div>
  );
}

export function AuthShell({
  mode,
  children,
}: {
  mode: "login" | "register";
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col app-bg">
      <GridBackground />
      <div className="flex flex-1 flex-col lg:grid lg:grid-cols-2 min-h-0">
        <AuthHero />
        <AuthFormPanel mode={mode}>{children}</AuthFormPanel>
      </div>
      <footer className="relative z-10 border-t border-border/60 py-4 text-center text-xs text-subtle">
        © {new Date().getFullYear()} Viết & Chấm Văn — Luyện viết & phản hồi AI
      </footer>
    </div>
  );
}
