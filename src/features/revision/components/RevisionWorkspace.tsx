"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import { ArrowLeft, History, Lightbulb, Sparkles } from "lucide-react";
import { Button } from "@/components/button";
import { Alert } from "@/components/alert";
import { Loading } from "@/components/loading";
import { ROUTES } from "@/constants/routes.constants";
import { toast } from "@/lib/toast";
import { extractAnalysisFeedback, formatDateTime } from "@/utils/helpers";
import {
  useAnalytics,
  useCreateAiAnalytics,
} from "@/features/analysis";
import {
  useWriting,
  useUpdateWriting,
  useRevisionTimeline,
  useCreateWritingRevision,
  useEnsureBaselineRevision,
} from "@/features/writings";
import {
  useSuggestionsByWriting,
  useGenerateSuggestions,
  useGenerateSuggestionsFromAnalysis,
  useApplySuggestion,
} from "@/features/suggestions";
import {
  getOverallAnalysisScore,
  scoreTextColor,
} from "@/features/analysis/utils/score.utils";
import { RevisionStepper } from "./RevisionStepper";
import { TextDiffView } from "./TextDiffView";
import { RevisionEditor } from "./RevisionEditor";
import { SuggestionDrawer } from "./SuggestionDrawer";
import { AiFeedbackPanel } from "./AiFeedbackPanel";
import { cn } from "@/lib/utils";

interface RevisionWorkspaceProps {
  writingId: string;
  analysisId?: string;
}

export function RevisionWorkspace({
  writingId,
  analysisId,
}: RevisionWorkspaceProps) {
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
  }, [analysisId, writing?.content, writingId]);

  useEffect(() => {
    if (
      !analysisId ||
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
  }, [analysisId, writingId, isSuggestionsLoading, suggestions.length]);

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
        `Đã cập nhật bài viết · mốc #${revision.revisionNumber} trên hành trình`,
      );
    } catch {
      toast.error("Không thể lưu bài viết");
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
        updateWritingContent ? "Đã áp dụng vào bài viết" : "Đã đánh dấu",
      );
    } catch {
      toast.error("Không thể áp dụng gợi ý");
    } finally {
      setApplyingId(null);
    }
  };

  const handleRegrade = async () => {
    if (!writing) return;
    if (hasUnsavedChanges) {
      toast.error("Hãy lưu bài viết trước khi chấm lại");
      return;
    }
    try {
      const result = await createAiAnalytics.mutateAsync({
        writingId,
        writingType: writing.type,
        previousAnalysisId: analysisId,
      });
      toast.success("Đã chấm lại bài viết");
      router.push(ROUTES.analysis(result.id));
    } catch {
      toast.error("Không thể chấm lại. Vui lòng thử lại.");
    }
  };

  const handleUseSample = () => {
    if (!feedback.sampleWriting) return;
    setDraftContent(feedback.sampleWriting);
    setHasUnsavedChanges(feedback.sampleWriting !== savedContent);
    toast.success("Đã tải bài mẫu vào trình soạn thảo");
  };

  const handleCopySample = async () => {
    if (!feedback.sampleWriting) return;
    await navigator.clipboard.writeText(feedback.sampleWriting);
    toast.success("Đã sao chép bài mẫu");
  };

  const handleGenerateFromAnalysis = async () => {
    if (!analysisId) return;
    try {
      await generateFromAnalysis.mutateAsync({ writingId, analysisId });
      setSuggestionsOpen(true);
      toast.success("Đã tải gợi ý từ báo cáo chấm");
    } catch {
      toast.error("Không thể tải gợi ý");
    }
  };

  const handleGenerateSuggestions = async () => {
    try {
      await generateSuggestions.mutateAsync({ writingId });
      setSuggestionsOpen(true);
      toast.success("Đã tạo gợi ý chi tiết");
    } catch {
      toast.error("Không thể tạo gợi ý");
    }
  };

  const editorBlock = (
    <div className="relative h-full min-h-[320px] overflow-hidden">
      <RevisionEditor
        value={draftContent}
        onChange={handleContentChange}
        onSave={handleSave}
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
        pendingSuggestionCount={pendingSuggestions.length}
        suggestionsOpen={suggestionsOpen}
        onToggleSuggestions={() => setSuggestionsOpen((v) => !v)}
        showDiff={showDiff}
        onToggleDiff={() => setShowDiff((v) => !v)}
        minHeight="min-h-64 lg:min-h-0"
      />
      <SuggestionDrawer
        open={suggestionsOpen}
        onClose={() => setSuggestionsOpen(false)}
        suggestions={suggestions}
        pendingCount={pendingSuggestions.length}
        isLoading={isSuggestionsLoading}
        applyingId={applyingId}
        isApplying={applySuggestion.isPending}
        onApply={handleApplySuggestion}
        onGenerateFromAnalysis={
          analysisId ? handleGenerateFromAnalysis : undefined
        }
        onGenerateAi={handleGenerateSuggestions}
        isGenerating={
          generateFromAnalysis.isPending || generateSuggestions.isPending
        }
        hasAnalysisContext={!!analysisId}
      />
    </div>
  );

  if (isWritingLoading) {
    return <Loading fullScreen text="Đang tải không gian chữa bài..." />;
  }

  if (!writing) return null;

  return (
    <div className="flex flex-col gap-3 min-h-[calc(100dvh-4.5rem)]">
      <section className="panel-glass shrink-0 p-4 sm:p-5">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 min-w-0 flex-1">
            <Link
              href={ROUTES.writing(writingId)}
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg transition-colors shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              Về bài viết
            </Link>
            <div className="hidden sm:block h-4 w-px bg-border shrink-0" />
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-fg tracking-tight truncate">
                Chữa bài: {writing.title}
              </h1>
              <p className="text-xs sm:text-sm text-muted truncate">
                Cùng một bài viết · lưu = ghi mốc hành trình
                {analysis && (
                  <>
                    {" "}
                    · {formatDateTime(analysis.createdAt)}
                    {score != null && (
                      <span
                        className={cn(
                          "font-semibold font-mono",
                          scoreTextColor(score),
                        )}
                      >
                        {" "}
                        · {score}/10
                      </span>
                    )}
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <RevisionStepper currentStep={currentStep} />
            <div className="hidden sm:block h-6 w-px bg-border mx-1" />
            <Button
              size="sm"
              className="gap-1.5 btn-glow-solid"
              onClick={handleRegrade}
              disabled={createAiAnalytics.isPending || hasUnsavedChanges}
              isLoading={createAiAnalytics.isPending}
            >
              <Sparkles className="h-4 w-4" />
              Chấm lại
            </Button>
            <Link href={ROUTES.writingJourney(writingId)}>
              <Button size="sm" variant="outline" className="gap-1.5">
                <History className="h-4 w-4" />
                Hành trình
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="flex flex-1 flex-col gap-3 min-h-0">
        {showDiff && (
          <section className="panel-glass shrink-0 p-4">
            <h3 className="text-sm font-semibold text-fg mb-3">
              So với bản trước khi chữa
            </h3>
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-subtle mb-2">
                  Trước khi chữa
                </p>
                <pre className="max-h-48 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-border bg-surface-2 p-4 text-sm text-muted">
                  {originalContent}
                </pre>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">
                  Bản đang sửa
                </p>
                <div className="max-h-48 overflow-auto rounded-lg border border-primary/20 bg-primary-soft/30 p-4">
                  <TextDiffView
                    original={originalContent}
                    revised={draftContent}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="hidden lg:flex flex-1 min-h-0 h-[calc(100dvh-11rem)]">
            <PanelGroup direction="horizontal" className="h-full gap-1 w-full">
              <Panel defaultSize={36} minSize={26}>
                <aside className="panel-glass h-full flex flex-col overflow-hidden">
                  <div className="p-4 border-b border-border/60 shrink-0 bg-primary/5">
                    <h2 className="text-sm font-semibold text-fg flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-warning" />
                      Gợi ý từ AI
                    </h2>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <AiFeedbackPanel
                      feedback={feedback}
                      hasAnalysis={!!analysisId}
                      onUseSample={handleUseSample}
                      onCopySample={handleCopySample}
                    />
                  </div>
                </aside>
              </Panel>

              <PanelResizeHandle className="w-1.5 rounded-full resize-handle-glow mx-0.5" />

              <Panel defaultSize={64} minSize={40}>
                <div className="panel-glass h-full overflow-hidden ring-1 ring-primary/10">
                  {editorBlock}
                </div>
              </Panel>
            </PanelGroup>
          </div>

          <div className="lg:hidden flex-1 space-y-3">
            <section className="panel-glass p-4">
              <h2 className="text-sm font-semibold text-fg mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-warning" />
                Gợi ý từ AI
              </h2>
              <AiFeedbackPanel
                feedback={feedback}
                hasAnalysis={!!analysisId}
                onUseSample={handleUseSample}
                onCopySample={handleCopySample}
              />
            </section>
            <section className="panel-glass overflow-hidden min-h-[360px] flex-1">
              {editorBlock}
            </section>
          </div>

        {hasUnsavedChanges && (
          <Alert
            type="warning"
            title="Có thay đổi chưa lưu"
            message='Nhấn "Lưu bài viết" (Ctrl+S) để cập nhật cùng bài viết và ghi mốc mới.'
          />
        )}
      </div>
    </div>
  );
}
