"use client";

import { Suspense } from "react";
import { WritingsListView } from "@/features/writings";
import { Loading } from "@/components/loading";

export default function WritingsPage() {
  return (
    <Suspense fallback={<Loading fullScreen text="Đang tải..." />}>
      <WritingsListView />
    </Suspense>
  );
}
