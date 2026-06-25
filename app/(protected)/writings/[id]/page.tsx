"use client";

import { use } from "react";
import { WritingDetailView } from "@/features/writings";

interface WritingViewPageProps {
  params: Promise<{ id: string }>;
}

export default function WritingViewPage({ params }: WritingViewPageProps) {
  const { id } = use(params);
  return <WritingDetailView id={id} />;
}
