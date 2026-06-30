"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/loading";
import { authMessages } from "@/messages/auth";
import { commonMessages } from "@/messages/common";
import { useAuth } from "../context/AuthContext";
import { AuthForm } from "./AuthForm";
import { AuthShell } from "./AuthShell";

interface AuthPageProps {
  mode: "login" | "register";
}

export function AuthPage({ mode }: AuthPageProps) {
  const router = useRouter();
  const { isAuthenticated, isInitializing } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated && mounted) {
      router.push("/writings");
    }
  }, [isAuthenticated, mounted, router]);

  if (!mounted || isInitializing) {
    return <Loading fullScreen text={commonMessages.loading} />;
  }

  const isLogin = mode === "login";

  return (
    <AuthShell mode={mode}>
      <AuthForm
        mode={mode}
        onSuccess={() => router.push("/writings")}
      />

      <p className="mt-6 text-center text-sm text-muted">
        {isLogin ? authMessages.switch.noAccount : authMessages.switch.hasAccount}{" "}
        <Link
          href={isLogin ? "/register" : "/login"}
          className="font-semibold text-primary hover:underline"
        >
          {isLogin ? authMessages.switch.register : authMessages.switch.login}
        </Link>
      </p>
    </AuthShell>
  );
}
