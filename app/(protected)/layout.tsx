"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth";
import { Loading } from "@/components";
import { AppShell } from "@/layouts";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isAuthenticated && mounted && !isLoading) {
      router.push("/login");
    }
  }, [isAuthenticated, mounted, isLoading, router]);

  if (!mounted || isLoading) {
    return <Loading fullScreen text="Đang tải..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <AppShell>{children}</AppShell>;
}
