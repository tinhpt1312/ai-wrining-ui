"use client";

import { Suspense } from "react";
import { WritingsListView } from "@/features/writings";
import { Loading } from "@/components/loading";
import { commonMessages } from "@/messages/common";

export default function WritingsPage() {
  return (
    <Suspense fallback={<Loading fullScreen text={commonMessages.loading} />}>
      <WritingsListView />
    </Suspense>
  );
}
