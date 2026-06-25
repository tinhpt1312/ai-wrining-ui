"use client";

import { useEffect, useState } from "react";
import {
  hasMinimumSelfEdit,
  isSelfEditUnlocked,
  markSelfEditUnlocked,
} from "@/features/revision/utils/self-edit.utils";

export function useSelfEditUnlock(
  writingId?: string,
  analysisId?: string,
  baseline?: string,
  current?: string,
) {
  const [storageUnlocked, setStorageUnlocked] = useState(false);

  useEffect(() => {
    if (!writingId) return;
    setStorageUnlocked(isSelfEditUnlocked(writingId, analysisId));
  }, [writingId, analysisId]);

  const editUnlocked =
    storageUnlocked ||
    (!!baseline && !!current && hasMinimumSelfEdit(baseline, current));

  useEffect(() => {
    if (!writingId || !editUnlocked || storageUnlocked) return;
    markSelfEditUnlocked(writingId, analysisId);
    setStorageUnlocked(true);
  }, [writingId, analysisId, editUnlocked, storageUnlocked]);

  return editUnlocked;
}
