export const MIN_SELF_EDIT_CHARS = 50;

export function countSelfEditChars(baseline: string, current: string): number {
  if (!baseline && !current) return 0;
  if (baseline === current) return 0;

  const maxLen = Math.max(baseline.length, current.length);
  let diff = 0;

  for (let index = 0; index < maxLen; index += 1) {
    if (baseline[index] !== current[index]) {
      diff += 1;
    }
  }

  return diff;
}

export function hasMinimumSelfEdit(
  baseline: string,
  current: string,
  minChars = MIN_SELF_EDIT_CHARS,
): boolean {
  return countSelfEditChars(baseline, current) >= minChars;
}

export function getSelfEditStorageKey(
  writingId: string,
  analysisId?: string,
): string {
  return `self-edit-unlocked:${writingId}:${analysisId ?? "general"}`;
}

export function isSelfEditUnlocked(
  writingId: string,
  analysisId?: string,
): boolean {
  if (typeof window === "undefined") return false;
  return (
    localStorage.getItem(getSelfEditStorageKey(writingId, analysisId)) ===
    "1"
  );
}

export function markSelfEditUnlocked(
  writingId: string,
  analysisId?: string,
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(getSelfEditStorageKey(writingId, analysisId), "1");
}

export function getSelfEditProgress(
  baseline: string,
  current: string,
  minChars = MIN_SELF_EDIT_CHARS,
): number {
  if (minChars <= 0) return 100;
  return Math.min(
    100,
    Math.round((countSelfEditChars(baseline, current) / minChars) * 100),
  );
}
