"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Copy, PenLine } from "lucide-react";
import type { AnalysisFeedback, FeedbackCriterion } from "@/types/api";
import { extractAnalysisFeedback } from "@/features/analysis/utils/feedback.utils";
import { SelfEditGate } from "@/features/revision/components/SelfEditGate";
import { useSelfEditUnlock } from "@/features/revision/hooks/useSelfEditUnlock";
import { Button } from "@/components/button";
import { ROUTES } from "@/constants/routes.constants";
import { toast } from "@/lib/toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";
import { isCriterion } from "../utils/score.utils";
import { CriterionCard } from "./feedback/CriterionCard";
import { FeedbackListCard } from "./feedback/FeedbackListCard";
import { SampleComparisonView } from "./SampleComparisonView";
import { analysisMessages } from "@/messages/analysis";
import { revisionMessages } from "@/messages/revision";

const CRITERIA: { key: keyof AnalysisFeedback; label: string }[] = [
  { key: "structure", label: analysisMessages.feedback.criteria.structure },
  { key: "clarity", label: analysisMessages.feedback.criteria.clarity },
  { key: "tone", label: analysisMessages.feedback.criteria.tone },
  { key: "coherence", label: analysisMessages.feedback.criteria.coherence },
];

export default function AnalysisFeedbackView({
  feedback,
  writingId,
  analysisId,
  writingContent,
}: {
  feedback: Record<string, unknown> | null | undefined;
  writingId?: string;
  analysisId?: string;
  writingContent?: string;
}) {
  const data = useMemo(() => extractAnalysisFeedback(feedback), [feedback]);
  const selfEditUnlocked = useSelfEditUnlock(writingId, analysisId);

  const criteria = useMemo(
    () =>
      CRITERIA.map(({ key, label }) => ({
        label,
        criterion: data[key],
      })).filter((c) => isCriterion(c.criterion)) as {
        label: string;
        criterion: FeedbackCriterion;
      }[],
    [data],
  );

  const hasStructuredData =
    criteria.length > 0 ||
    !!data.overallFeedback ||
    (data.strengths?.length ?? 0) > 0 ||
    (data.areasForImprovement?.length ?? 0) > 0 ||
    (data.actionItems?.length ?? 0) > 0 ||
    !!data.sampleWriting;

  if (!hasStructuredData) {
    return (
      <div className="panel-glass p-8 text-center">
        <p className="text-fg font-medium">
          {analysisMessages.feedback.reportUnavailable}
        </p>
        <p className="text-sm text-muted mt-2 max-w-md mx-auto leading-relaxed">
          {analysisMessages.feedback.reportUnavailableDescription}
        </p>
      </div>
    );
  }

  const hasOverview =
    !!data.overallFeedback ||
    (data.strengths?.length ?? 0) > 0 ||
    (data.areasForImprovement?.length ?? 0) > 0 ||
    (data.actionItems?.length ?? 0) > 0;

  const defaultTab = hasOverview
    ? "overview"
    : criteria.length > 0
      ? "criteria"
      : "sample";

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList>
        {hasOverview && (
          <TabsTrigger value="overview">
            {analysisMessages.feedback.tabs.overview}
          </TabsTrigger>
        )}
        {criteria.length > 0 && (
          <TabsTrigger value="criteria">
            {analysisMessages.feedback.tabs.criteria}
          </TabsTrigger>
        )}
        {data.sampleWriting && (
          <TabsTrigger value="sample">
            {analysisMessages.feedback.tabs.sample}
          </TabsTrigger>
        )}
        {data.sampleWriting && writingContent && (
          <TabsTrigger value="compare">
            {analysisMessages.feedback.tabs.compare}
          </TabsTrigger>
        )}
      </TabsList>

      {hasOverview && (
        <TabsContent value="overview" className="space-y-4 mt-2">
          {data.overallFeedback && (
            <div className="panel-glass p-6">
              <h2 className="text-sm font-semibold text-fg mb-2">
                {analysisMessages.feedback.overallFeedback}
              </h2>
              <p className="text-sm text-muted leading-relaxed prose-content">
                {data.overallFeedback}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FeedbackListCard
              title={analysisMessages.feedback.strengths}
              items={data.strengths || []}
              marker="✓"
              markerClass="text-success"
            />
            <FeedbackListCard
              title={analysisMessages.feedback.areasForImprovement}
              items={data.areasForImprovement || []}
              marker="!"
              markerClass="text-warning"
            />
          </div>

          <FeedbackListCard
            title={analysisMessages.feedback.actionItems}
            items={data.actionItems || []}
            marker="→"
            markerClass="text-primary"
          />

          {writingId && (data.actionItems?.length ?? 0) > 0 && (
            <div className="flex justify-center pt-2">
              <Link href={ROUTES.writingRevise(writingId, analysisId)}>
                <Button className="gap-1.5 btn-glow-solid">
                  <PenLine className="h-4 w-4" />
                  {analysisMessages.feedback.startRevision}
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>
      )}

      {criteria.length > 0 && (
        <TabsContent value="criteria" className="mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {criteria.map((c) => (
              <CriterionCard
                key={c.label}
                label={c.label}
                criterion={c.criterion}
              />
            ))}
          </div>
        </TabsContent>
      )}

      {data.sampleWriting && (
        <TabsContent value="sample" className="mt-2">
          <SelfEditGate
            unlocked={selfEditUnlocked}
            baseline=""
            current=""
            writingId={writingId}
            analysisId={analysisId}
            title={analysisMessages.feedback.sample.gateTitle}
            description={analysisMessages.feedback.sample.gateDescription}
          >
          <div className="panel-glass border-primary/20 p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-fg tracking-tight mb-1">
                  {analysisMessages.feedback.sample.title}
                </h2>
                <p className="text-sm text-muted">
                  {analysisMessages.feedback.sample.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5"
                  onClick={async () => {
                    await navigator.clipboard.writeText(data.sampleWriting!);
                    toast.success(revisionMessages.toast.sampleCopied);
                  }}
                >
                  <Copy className="h-4 w-4" />
                  {analysisMessages.feedback.sample.copy}
                </Button>
                {writingId && (
                  <Link href={ROUTES.writingRevise(writingId, analysisId)}>
                    <Button size="sm" className="gap-1.5 btn-glow-solid">
                      <PenLine className="h-4 w-4" />
                      {analysisMessages.feedback.sample.reviseWithSample}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            <div className="bg-primary-soft/50 border border-primary/10 rounded-lg p-5">
              <div className="prose-content whitespace-pre-wrap">
                {data.sampleWriting}
              </div>
            </div>
          </div>
          </SelfEditGate>
        </TabsContent>
      )}

      {data.sampleWriting && writingContent && (
        <TabsContent value="compare" className="mt-2">
          <SelfEditGate
            unlocked={selfEditUnlocked}
            baseline=""
            current=""
            writingId={writingId}
            analysisId={analysisId}
            title={analysisMessages.feedback.compare.gateTitle}
            description={analysisMessages.feedback.compare.gateDescription}
          >
            <SampleComparisonView
              userContent={writingContent}
              sampleWriting={data.sampleWriting}
              feedback={data}
            />
          </SelfEditGate>
        </TabsContent>
      )}
    </Tabs>
  );
}
