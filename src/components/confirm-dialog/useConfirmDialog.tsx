"use client";

import { useCallback, useRef, useState } from "react";
import {
  ConfirmDialogView,
  type ConfirmDialogOptions,
} from "./ConfirmDialog";

export function useConfirmDialog() {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmDialogOptions | null>(null);
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmDialogOptions) => {
    return new Promise<boolean>((resolve) => {
      setOptions(opts);
      resolveRef.current = resolve;
      setOpen(true);
    });
  }, []);

  const finish = useCallback((result: boolean) => {
    setOpen(false);
    resolveRef.current?.(result);
    resolveRef.current = null;
  }, []);

  const ConfirmDialog = useCallback(() => {
    if (!options) return null;

    return (
      <ConfirmDialogView
        open={open}
        onOpenChange={(next) => {
          if (!next) finish(false);
        }}
        title={options.title}
        description={options.description}
        confirmLabel={options.confirmLabel}
        cancelLabel={options.cancelLabel}
        variant={options.variant}
        onConfirm={() => finish(true)}
        onCancel={() => finish(false)}
      />
    );
  }, [open, options, finish]);

  return { confirm, ConfirmDialog };
}
