"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AuthForm } from "@/components/AuthForm";
import { Loading } from "@/components/ui/States";

export default function RegisterPage() {
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
    return <Loading fullScreen text="Loading..." />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-fg mb-1.5">AI Writing</h1>
          <p className="text-sm text-muted">Create your account to get started</p>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
          <AuthForm mode="register" onSuccess={() => router.push("/writings")} />
        </div>

        <p className="text-center text-sm text-muted mt-6">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-primary font-medium hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
