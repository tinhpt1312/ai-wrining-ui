import { TextDiffView } from "./TextDiffView";
import { revisionMessages } from "@/messages/revision";

interface RevisionDiffPanelProps {
  originalContent: string;
  draftContent: string;
}

export function RevisionDiffPanel({
  originalContent,
  draftContent,
}: RevisionDiffPanelProps) {
  return (
    <section className="panel-glass shrink-0 p-4">
      <h3 className="text-sm font-semibold text-fg mb-3">
        {revisionMessages.diff.panelTitle}
      </h3>
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-subtle mb-2">
            {revisionMessages.diff.before}
          </p>
          <pre className="max-h-48 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-border bg-surface-2 p-4 text-sm text-muted">
            {originalContent}
          </pre>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">
            {revisionMessages.diff.current}
          </p>
          <div className="max-h-48 overflow-auto rounded-lg border border-primary/20 bg-primary-soft/30 p-4">
            <TextDiffView original={originalContent} revised={draftContent} />
          </div>
        </div>
      </div>
    </section>
  );
}
