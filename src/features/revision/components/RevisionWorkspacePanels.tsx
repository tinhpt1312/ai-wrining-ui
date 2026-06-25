import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import { Lightbulb } from "lucide-react";
import { AiFeedbackPanel } from "./AiFeedbackPanel";
import type { AnalysisFeedback } from "@/types/api";
import type { ReactNode } from "react";

interface RevisionWorkspacePanelsProps {
  feedback: AnalysisFeedback;
  hasAnalysis: boolean;
  onUseSample: () => void;
  onCopySample: () => void;
  editor: ReactNode;
}

function FeedbackSidebar({
  feedback,
  hasAnalysis,
  onUseSample,
  onCopySample,
}: Omit<RevisionWorkspacePanelsProps, "editor">) {
  return (
    <AiFeedbackPanel
      feedback={feedback}
      hasAnalysis={hasAnalysis}
      onUseSample={onUseSample}
      onCopySample={onCopySample}
    />
  );
}

export function RevisionWorkspacePanels({
  feedback,
  hasAnalysis,
  onUseSample,
  onCopySample,
  editor,
}: RevisionWorkspacePanelsProps) {
  return (
    <>
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
                <FeedbackSidebar
                  feedback={feedback}
                  hasAnalysis={hasAnalysis}
                  onUseSample={onUseSample}
                  onCopySample={onCopySample}
                />
              </div>
            </aside>
          </Panel>

          <PanelResizeHandle className="w-1.5 rounded-full resize-handle-glow mx-0.5" />

          <Panel defaultSize={64} minSize={40}>
            <div className="panel-glass h-full overflow-hidden ring-1 ring-primary/10">
              {editor}
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
          <FeedbackSidebar
            feedback={feedback}
            hasAnalysis={hasAnalysis}
            onUseSample={onUseSample}
            onCopySample={onCopySample}
          />
        </section>
        <section className="panel-glass overflow-hidden min-h-[360px] flex-1">
          {editor}
        </section>
      </div>
    </>
  );
}
