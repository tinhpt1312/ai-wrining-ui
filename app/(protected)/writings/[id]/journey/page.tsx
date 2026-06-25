"use client";

import { use } from "react";
import { WritingJourneyView } from "@/features/writings";

export default function WritingJourneyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: writingId } = use(params);

  return <WritingJourneyView writingId={writingId} />;
}
