"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";
import { ROUTES } from "@/constants/routes.constants";
import { extractAnalysisFeedback } from "@/utils/helpers";
import { useAnalytics, useCreateAiAnalytics } from "@/features/analysis";
import { useWriting, useUpdateWriting } from "@/features/writings";
import {
  useRevisionTimeline,
  useCreateWritingRevision,
  useEnsureBaselineRevision,
} from "@/features/revision";
import {
  useSuggestionsByWriting,
  useGenerateSuggestions,
  useGenerateSuggestionsFromAnalysis,
  useApplySuggestion,
} from "@/features/suggestions";
import { useSelfEditUnlock } from "./useSelfEditUnlock";
import { getOverallAnalysisScore } from "@/features/analysis/utils/score.utils";
import { revisionMessages } from "@/messages/revision";
import { msg } from "@/messages/format";
import type { AnalysisFeedback, Writing, WritingSuggestion } from "@/types/api";

interface UseRevisionWorkspaceOptions {
  writingId: string;
  analysisId?: string;
}

export function useRevisionWorkspace({
  writingId,
  analysisId,
}: UseRevisionWorkspaceOptions) {
  const router = useRouter();
  const { data: writing, isLoading: isWritingLoading } = useWriting(writingId);
  const { data: analysis } = useAnalytics(analysisId || "");
  const { data: suggestionsData, isLoading: isSuggestionsLoading } =
    useSuggestionsByWriting(writingId);
  const { data: timelineData } = useRevisionTimeline(writingId, analysisId);

  const updateWriting = useUpdateWriting();
  const createRevision = useCreateWritingRevision();
  const ensureBaseline = useEnsureBaselineRevision();
  const generateSuggestions = useGenerateSuggestions();
  const generateFromAnalysis = useGenerateSuggestionsFromAnalysis();
  const applySuggestion = useApplySuggestion();
  const createAiAnalytics = useCreateAiAnalytics();

  const [draftContent, setDraftContent] = useState("");
  const [savedContent, setSavedContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const autoLoadedAnalysis = useRef(false);
  const baselineCreated = useRef(false);

  const feedback = useMemo(
    () => extractAnalysisFeedback(analysis?.feedbackJson),
    [analysis?.feedbackJson],
  );

  const score = analysis
    ? getOverallAnalysisScore(analysis.feedbackJson)
    : null;

  const suggestions = suggestionsData?.data || [];
  const pendingSuggestions = suggestions.filter((s) => !s.isApplied);
  const timelineRevisions = timelineData?.data || [];
  const isSaving = updateWriting.isPending || createRevision.isPending;

  const gradingBaseline = useMemo(
    () =>
      timelineRevisions.find((revision) => revision.source === "grading_baseline"),
    [timelineRevisions],
  );

  const selfEditBaseline = useMemo(
    () => gradingBaseline?.content ?? writing?.content ?? "",
    [gradingBaseline?.content, writing?.content],
  );

  const selfEditUnlocked = useSelfEditUnlock(
    writingId,
    analysisId,
    selfEditBaseline,
    draftContent,
  );

  useEffect(() => {
    if (writing?.content == null) return;
    setDraftContent(writing.content);
    setSavedContent(writing.content);
    setHasUnsavedChanges(false);
  }, [writing?.content]);

  useEffect(() => {
    if (gradingBaseline?.content) {
      setOriginalContent(gradingBaseline.content);
      return;
    }
    if (writing?.content) {
      setOriginalContent(writing.content);
    }
  }, [gradingBaseline?.content, writing?.content]);

  useEffect(() => {
    if (
      !analysisId ||
      !writing?.content ||
      baselineCreated.current ||
      ensureBaseline.isPending
    ) {
      return;
    }

    baselineCreated.current = true;
    ensureBaseline
      .mutateAsync({
        writingId,
        payload: { analysisId, content: writing.content },
      })
      .catch(() => {
        baselineCreated.current = false;
      });
  }, [analysisId, writing?.content, writingId, ensureBaseline]);

  useEffect(() => {
    if (
      !analysisId ||
      !selfEditUnlocked ||
      autoLoadedAnalysis.current ||
      isSuggestionsLoading ||
      suggestions.length > 0
    ) {
      return;
    }

    autoLoadedAnalysis.current = true;
    generateFromAnalysis
      .mutateAsync({ writingId, analysisId })
      .catch(() => {
        autoLoadedAnalysis.current = false;
      });
  }, [
    analysisId,
    writingId,
    selfEditUnlocked,
    isSuggestionsLoading,
    suggestions.length,
    generateFromAnalysis,
  ]);

  const currentStep = useMemo(() => {
    if (createAiAnalytics.isPending) return "regrade" as const;
    if (hasUnsavedChanges || pendingSuggestions.length > 0)
      return "revising" as const;
    return "graded" as const;
  }, [createAiAnalytics.isPending, hasUnsavedChanges, pendingSuggestions.length]);

  const handleContentChange = (value: string) => {
    setDraftContent(value);
    setHasUnsavedChanges(value !== savedContent);
  };

  const handleSave = useCallback(async () => {
    if (!writing) return;
    try {
      await updateWriting.mutateAsync({
        id: writingId,
        payload: { content: draftContent },
      });
      const revision = await createRevision.mutateAsync({
        writingId,
        payload: {
          content: draftContent,
          source: "revision_workspace",
          analysisId,
        },
      });
      setSavedContent(draftContent);
      setHasUnsavedChanges(false);
      toast.success(
        msg(revisionMessages.toast.saveSuccess, {
          number: revision.revisionNumber,
        }),
      );
    } catch {
      toast.error(revisionMessages.toast.saveFailed);
    }
  }, [
    writing,
    writingId,
    draftContent,
    updateWriting,
    createRevision,
    analysisId,
  ]);

  const handleApplySuggestion = async (
    suggestionId: string,
    updateWritingContent: boolean,
  ) => {
    setApplyingId(suggestionId);
    try {
      await applySuggestion.mutateAsync({
        suggestionId,
        writingId,
        updateWriting: updateWritingContent,
      });
      if (updateWritingContent) {
        const suggestion = suggestions.find((s) => s.id === suggestionId);
        if (suggestion?.suggestedText && suggestion?.originalText) {
          const next = draftContent.replace(
            suggestion.originalText,
            suggestion.suggestedText,
          );
          setDraftContent(next);
          setHasUnsavedChanges(next !== savedContent);
        }
      }
      toast.success(
        updateWritingContent
          ? revisionMessages.toast.appliedToWriting
          : revisionMessages.toast.marked,
      );
    } catch {
      toast.error(revisionMessages.toast.applyFailed);
    } finally {
      setApplyingId(null);
    }
  };

  const handleRegrade = async () => {
    if (!writing) return;
    if (hasUnsavedChanges) {
      toast.error(revisionMessages.toast.saveBeforeRegrade);
      return;
    }
    try {
      const result = await createAiAnalytics.mutateAsync({
        writingId,
        writingType: writing.type,
        previousAnalysisId: analysisId,
      });
      toast.success(revisionMessages.toast.regradeSuccess);
      router.push(ROUTES.analysis(result.id));
    } catch {
      toast.error(revisionMessages.toast.regradeFailed);
    }
  };

  const handleUseSample = () => {
    if (!selfEditUnlocked) {
      toast.error(revisionMessages.toast.selfEditBeforeSample);
      return;
    }
    if (!feedback.sampleWriting) return;
    setDraftContent(feedback.sampleWriting);
    setHasUnsavedChanges(feedback.sampleWriting !== savedContent);
    toast.success(revisionMessages.toast.sampleLoaded);
  };

  const handleCopySample = async () => {
    if (!selfEditUnlocked) {
      toast.error(revisionMessages.toast.selfEditBeforeViewSample);
      return;
    }
    if (!feedback.sampleWriting) return;
    await navigator.clipboard.writeText(feedback.sampleWriting);
    toast.success(revisionMessages.toast.sampleCopied);
  };

  const handleGenerateFromAnalysis = async () => {
    if (!selfEditUnlocked) {
      toast.error(revisionMessages.toast.selfEditBeforeSuggestions);
      return;
    }
    if (!analysisId) return;
    try {
      await generateFromAnalysis.mutateAsync({ writingId, analysisId });
      setSuggestionsOpen(true);
      toast.success(revisionMessages.toast.suggestionsFromAnalysis);
    } catch {
      toast.error(revisionMessages.toast.loadSuggestionsFailed);
    }
  };

  const handleGenerateSuggestions = async () => {
    if (!selfEditUnlocked) {
      toast.error(revisionMessages.toast.selfEditBeforeSuggestions);
      return;
    }
    try {
      await generateSuggestions.mutateAsync({ writingId });
      setSuggestionsOpen(true);
      toast.success(revisionMessages.toast.suggestionsGenerated);
    } catch {
      toast.error(revisionMessages.toast.generateSuggestionsFailed);
    }
  };

  return {
    writing: writing as Writing | undefined,
    isWritingLoading,
    analysis,
    analysisId,
    writingId,
    feedback: feedback as AnalysisFeedback,
    score,
    suggestions: suggestions as WritingSuggestion[],
    pendingSuggestions,
    draftContent,
    originalContent,
    hasUnsavedChanges,
    showDiff,
    setShowDiff,
    suggestionsOpen,
    setSuggestionsOpen,
    applyingId,
    isSuggestionsLoading,
    isSaving,
    currentStep,
    isRegrading: createAiAnalytics.isPending,
    isGenerating:
      generateFromAnalysis.isPending || generateSuggestions.isPending,
    isApplying: applySuggestion.isPending,
    selfEditUnlocked,
    selfEditBaseline,
    handleContentChange,
    handleSave,
    handleApplySuggestion,
    handleRegrade,
    handleUseSample,
    handleCopySample,
    handleGenerateFromAnalysis,
    handleGenerateSuggestions,
  };
}

export type RevisionWorkspaceState = ReturnType<typeof useRevisionWorkspace>;
