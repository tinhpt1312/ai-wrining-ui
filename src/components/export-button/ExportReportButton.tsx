"use client";

import { useState } from "react";
import { ChevronDown, FileDown, FileText } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/button";
import { analyticsService } from "@/api/analytics.service";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { exportMessages } from "@/messages/export";

export interface ExportReportButtonProps {
  analysisId: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ExportReportButton({
  analysisId,
  size = "sm",
  className,
}: ExportReportButtonProps) {
  const [exportingFormat, setExportingFormat] = useState<"docx" | "pdf" | null>(
    null,
  );

  const handleExport = async (format: "docx" | "pdf") => {
    setExportingFormat(format);
    try {
      await analyticsService.downloadExport(analysisId, format);
      toast.success(
        format === "docx"
          ? exportMessages.report.toast.docx
          : exportMessages.report.toast.pdf,
      );
    } catch {
      toast.error(exportMessages.report.toast.failed);
    } finally {
      setExportingFormat(null);
    }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          type="button"
          variant="outline"
          size={size}
          className={cn("gap-1.5 w-full sm:w-auto", className)}
          disabled={!!exportingFormat}
          isLoading={!!exportingFormat}
        >
          <FileDown className="h-4 w-4" />
          {exportMessages.report.button}
          <ChevronDown className="h-3.5 w-3.5 opacity-60" />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className={cn(
            "z-50 min-w-[11rem] overflow-hidden rounded-xl border border-border",
            "bg-surface p-1 shadow-lg animate-in fade-in-0 zoom-in-95",
          )}
        >
          <DropdownMenu.Item
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none",
              "text-fg hover:bg-surface-2 focus:bg-surface-2",
              exportingFormat === "docx" && "opacity-50 pointer-events-none",
            )}
            onSelect={() => handleExport("docx")}
          >
            <FileText className="h-4 w-4 shrink-0" />
            {exportMessages.writing.docx}
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none",
              "text-fg hover:bg-surface-2 focus:bg-surface-2",
              exportingFormat === "pdf" && "opacity-50 pointer-events-none",
            )}
            onSelect={() => handleExport("pdf")}
          >
            <FileDown className="h-4 w-4 shrink-0" />
            {exportMessages.writing.pdf}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
