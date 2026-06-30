"use client";

import { Alert } from "@/components/alert";
import { Loading } from "@/components/loading";
import { RevisionEditor } from "./RevisionEditor";
import { SuggestionDrawer } from "./SuggestionDrawer";
import { RevisionWorkspaceHeader } from "./RevisionWorkspaceHeader";
import { RevisionDiffPanel } from "./RevisionDiffPanel";
import { RevisionWorkspacePanels } from "./RevisionWorkspacePanels";
import { useRevisionWorkspace } from "../hooks/useRevisionWorkspace";
import { revisionMessages } from "@/messages/revision";

interface RevisionWorkspaceProps {
  writingId: string;
  analysisId?: string;
}

export function RevisionWorkspace({
  writingId,
  analysisId,
}: RevisionWorkspaceProps) {
  const workspace = useRevisionWorkspace({ writingId, analysisId });

  const editorBlock = (
    <div className="relative h-full min-h-[320px] overflow-hidden">
      <RevisionEditor
        value={workspace.draftContent}
        onChange={workspace.handleContentChange}
        onSave={workspace.handleSave}
        hasUnsavedChanges={workspace.hasUnsavedChanges}
        isSaving={workspace.isSaving}
        pendingSuggestionCount={workspace.pendingSuggestions.length}
        suggestionsOpen={workspace.suggestionsOpen}
        onToggleSuggestions={() =>
          workspace.setSuggestionsOpen((v) => !v)
        }
        showDiff={workspace.showDiff}
        onToggleDiff={() => workspace.setShowDiff((v) => !v)}
        minHeight="min-h-64 lg:min-h-0"
      />
      <SuggestionDrawer
        open={workspace.suggestionsOpen}
        onClose={() => workspace.setSuggestionsOpen(false)}
        suggestions={workspace.suggestions}
        pendingCount={workspace.pendingSuggestions.length}
        isLoading={workspace.isSuggestionsLoading}
        applyingId={workspace.applyingId}
        isApplying={workspace.isApplying}
        onApply={workspace.handleApplySuggestion}
        onGenerateFromAnalysis={
          workspace.analysisId
            ? workspace.handleGenerateFromAnalysis
            : undefined
        }
        onGenerateAi={workspace.handleGenerateSuggestions}
        isGenerating={workspace.isGenerating}
        hasAnalysisContext={!!workspace.analysisId}
        suggestionsLocked={!workspace.selfEditUnlocked}
        selfEditBaseline={workspace.selfEditBaseline}
        selfEditCurrent={workspace.draftContent}
        writingId={writingId}
        analysisId={analysisId}
      />
    </div>
  );

  if (workspace.isWritingLoading) {
    return <Loading fullScreen text={revisionMessages.loading} />;
  }

  if (!workspace.writing) return null;

  return (
    <div className="flex flex-col gap-3 min-h-[calc(100dvh-4.5rem)]">
      <RevisionWorkspaceHeader
        writing={workspace.writing}
        writingId={writingId}
        analysis={workspace.analysis}
        score={workspace.score}
        currentStep={workspace.currentStep}
        hasUnsavedChanges={workspace.hasUnsavedChanges}
        isRegrading={workspace.isRegrading}
        onRegrade={workspace.handleRegrade}
      />

      <div className="flex flex-1 flex-col gap-3 min-h-0">
        {workspace.showDiff && (
          <RevisionDiffPanel
            originalContent={workspace.originalContent}
            draftContent={workspace.draftContent}
          />
        )}

        <RevisionWorkspacePanels
          feedback={workspace.feedback}
          hasAnalysis={!!workspace.analysisId}
          onUseSample={workspace.handleUseSample}
          onCopySample={workspace.handleCopySample}
          selfEditUnlocked={workspace.selfEditUnlocked}
          selfEditBaseline={workspace.selfEditBaseline}
          selfEditCurrent={workspace.draftContent}
          writingId={writingId}
          analysisId={analysisId}
          editor={editorBlock}
        />

        {workspace.hasUnsavedChanges && (
          <Alert
            type="warning"
            title={revisionMessages.unsaved.title}
            message={revisionMessages.unsaved.message}
          />
        )}
      </div>
    </div>
  );
}
