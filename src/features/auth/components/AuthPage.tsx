"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/loading";
import { useAuth } from "../context/AuthContext";
import { AuthForm } from "./AuthForm";
import { AuthShell } from "./AuthShell";

interface AuthPageProps {
  mode: "login" | "register";
}

export function AuthPage({ mode }: AuthPageProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated && mounted) {
      router.push("/writings");
    }
  }, [isAuthenticated, mounted, router]);

  if (!mounted || isLoading) {
    return <Loading fullScreen text="Đang tải..." />;
  }

  const isLogin = mode === "login";

  return (
    <AuthShell mode={mode}>
      <AuthForm
        mode={mode}
        onSuccess={() => router.push("/writings")}
      />

      <p className="mt-6 text-center text-sm text-muted">
        {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
        <Link
          href={isLogin ? "/register" : "/login"}
          className="font-semibold text-primary hover:underline"
        >
          {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
        </Link>
      </p>
    </AuthShell>
  );
}
