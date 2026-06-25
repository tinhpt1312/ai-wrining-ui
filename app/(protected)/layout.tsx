"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth";
import { Loading } from "@/components/loading";
import { AppShell } from "@/layouts/AppShell";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isInitializing } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isAuthenticated && mounted && !isInitializing) {
      router.push("/login");
    }
  }, [isAuthenticated, mounted, isInitializing, router]);

  if (!mounted || isInitializing) {
    return <Loading fullScreen text="Đang tải..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <AppShell>{children}</AppShell>;
}
