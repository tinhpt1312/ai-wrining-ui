import type { WritingOutline } from "@/types/api";

export function buildContentFromOutline(outline: WritingOutline): string {
  return outline.sections
    .map((section) => {
      const points = section.keyPoints.map((point) => `- ${point}`).join("\n");
      return `## ${section.label}\n\n${points}`;
    })
    .join("\n\n");
}

export function updateOutlineSection(
  outline: WritingOutline,
  sectionId: string,
  updates: Partial<WritingOutline["sections"][number]>,
): WritingOutline {
  return {
    ...outline,
    sections: outline.sections.map((section) =>
      section.id === sectionId ? { ...section, ...updates } : section,
    ),
  };
}

export function updateOutlineKeyPoint(
  outline: WritingOutline,
  sectionId: string,
  pointIndex: number,
  value: string,
): WritingOutline {
  return {
    ...outline,
    sections: outline.sections.map((section) => {
      if (section.id !== sectionId) return section;
      const keyPoints = [...section.keyPoints];
      keyPoints[pointIndex] = value;
      return { ...section, keyPoints };
    }),
  };
}
