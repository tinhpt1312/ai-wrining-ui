"use client";

import { use, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { RevisionWorkspace } from "@/features/revision";
import { Loading } from "@/components/loading";
import { commonMessages } from "@/messages/common";

function RevisePageContent({ writingId }: { writingId: string }) {
  const searchParams = useSearchParams();
  const analysisId = searchParams.get("analysisId") || undefined;

  return (
    <RevisionWorkspace writingId={writingId} analysisId={analysisId} />
  );
}

export default function WritingRevisePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: writingId } = use(params);

  return (
    <Suspense fallback={<Loading fullScreen text={commonMessages.loading} />}>
      <RevisePageContent writingId={writingId} />
    </Suspense>
  );
}
