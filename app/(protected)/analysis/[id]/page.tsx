"use client";

import { use } from "react";
import { AnalysisDetailView } from "@/features/analysis";

interface AnalyticsViewPageProps {
  params: Promise<{ id: string }>;
}

export default function AnalyticsViewPage({ params }: AnalyticsViewPageProps) {
  const { id } = use(params);
  return <AnalysisDetailView id={id} />;
}
