"use client";

import Link from "next/link";
import {
  PenLine,
  Sparkles,
  Lightbulb,
  FileEdit,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Footer } from "@/layouts";
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
        "relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-primary via-[#4338ca] to-[#1e1b4b] p-12 text-white min-h-full",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-indigo-300/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm ring-1 ring-white/20">
          <PenLine className="h-5 w-5" />
        </div>
        <h1 className="mt-8 text-4xl font-bold tracking-tight">
          Viết & Chấm Văn
        </h1>
        <p className="mt-3 max-w-md text-base leading-relaxed text-indigo-100">
          Nền tảng viết văn thông minh — luyện viết, nhận phản hồi AI và cải
          thiện từng bài một cách có hệ thống.
        </p>
      </div>

      <ul className="relative mt-12 space-y-4">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <li
              key={feature.title}
              className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">{feature.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-indigo-100">
                  {feature.description}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="relative text-sm text-indigo-200/80">
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
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>

      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 lg:hidden">
          <Link
            href={ROUTES.LOGIN}
            className="inline-flex items-center gap-2.5 text-lg font-bold text-fg"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary ring-1 ring-primary/20">
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

        <div
          className={cn(
            "card-elevated p-6 sm:p-8",
            "ring-1 ring-black/[0.03] dark:ring-white/[0.06]",
          )}
        >
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
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1 flex-col lg:grid lg:grid-cols-2 min-h-0">
        <AuthHero />
        <AuthFormPanel mode={mode}>{children}</AuthFormPanel>
      </div>
      <Footer compact />
    </div>
  );
}
