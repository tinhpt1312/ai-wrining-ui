"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, History, PenLine } from "lucide-react";
import { Button } from "@/components/button";
import { Loading } from "@/components/loading";
import { msg } from "@/messages/format";
import { writingsMessages } from "@/messages/writings";
import { ROUTES } from "@/constants/routes.constants";
import { toast } from "@/lib/toast";
import { useWriting } from "@/features/writings";
import { useAnalysesByWriting } from "@/features/analysis";
import {
  useRevisionTimeline,
  useRestoreWritingRevision,
  ScoreProgress,
  RevisionTimeline,
} from "@/features/revision";
import { AnalysisResultCard } from "@/features/analysis";
import type { RevisionTimelineItem } from "@/features/revision";

interface WritingJourneyViewProps {
  writingId: string;
}

export function WritingJourneyView({ writingId }: WritingJourneyViewProps) {
  const { data: writing, isLoading: isWritingLoading } = useWriting(writingId);
  const { data: analysesData, isLoading: isAnalysesLoading } =
    useAnalysesByWriting(writingId, true);
  const { data: timelineData, isLoading: isTimelineLoading } =
    useRevisionTimeline(writingId);
  const restoreRevision = useRestoreWritingRevision();

  const [restoringRevisionId, setRestoringRevisionId] = useState<string | null>(
    null,
  );
  const [selectedRevisionId, setSelectedRevisionId] = useState<string | null>(
    null,
  );

  const analyses = analysesData?.data || [];
  const timelineRevisions = timelineData?.data || [];
  const latestAnalysisId = analyses[0]?.id;
  const sortedAnalyses = [...analyses].sort(
    (a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  const handleRestoreRevision = async (revision: RevisionTimelineItem) => {
    setRestoringRevisionId(revision.id);
    try {
      await restoreRevision.mutateAsync({
        writingId,
        revisionId: revision.id,
      });
      setSelectedRevisionId(revision.id);
      toast.success(writingsMessages.journey.restoreSuccess);
    } catch {
      toast.error(writingsMessages.journey.restoreError);
    } finally {
      setRestoringRevisionId(null);
    }
  };

  if (isWritingLoading) {
    return <Loading fullScreen text={writingsMessages.journey.loading} />;
  }

  if (!writing) return null;

  const isLoading = isAnalysesLoading || isTimelineLoading;

  return (
    <div className="space-y-6">
      <section className="card-elevated p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2 min-w-0">
            <Link
              href={ROUTES.writing(writingId)}
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {writingsMessages.journey.backToWriting}
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-fg tracking-tight flex items-center gap-2">
              <History className="h-6 w-6 text-primary shrink-0" />
              {msg(writingsMessages.journey.title, { title: writing.title })}
            </h1>
            <p className="text-sm text-muted">
              {writingsMessages.journey.description}
            </p>
          </div>

          {latestAnalysisId && (
            <Link href={ROUTES.writingRevise(writingId, latestAnalysisId)}>
              <Button className="gap-1.5 w-full sm:w-auto">
                <PenLine className="h-4 w-4" />
                {writingsMessages.journey.reviseButton}
              </Button>
            </Link>
          )}
        </div>
      </section>

      {isLoading ? (
        <Loading text={writingsMessages.journey.dataLoading} />
      ) : (
        <>
          {sortedAnalyses.length >= 2 && (
            <ScoreProgress analyses={sortedAnalyses} />
          )}

          {sortedAnalyses.length > 0 && (
            <section className="space-y-4">
              <div>
                <h2 className="text-sm font-semibold text-fg">
                  {writingsMessages.journey.analysisHistoryTitle}
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  {msg(writingsMessages.journey.analysisHistoryCount, {
                    count: sortedAnalyses.length,
                  })}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {sortedAnalyses.map((analysis) => (
                  <AnalysisResultCard
                    key={analysis.id}
                    analysis={analysis}
                    isPublic={writing.status === "public"}
                  />
                ))}
              </div>
            </section>
          )}

          <RevisionTimeline
            revisions={timelineRevisions}
            selectedRevisionId={selectedRevisionId}
            onSelect={(revision) => setSelectedRevisionId(revision.id)}
            onRestore={handleRestoreRevision}
            restoringRevisionId={restoringRevisionId}
          />
        </>
      )}
    </div>
  );
}
