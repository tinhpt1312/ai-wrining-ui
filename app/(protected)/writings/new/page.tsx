"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useCreateWriting,
  useGenerateOutline,
  WritingForm,
  WritingPromptPicker,
  OutlineBuilder,
} from "@/features/writings";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";
import { toast } from "@/lib/toast";
import { ROUTES } from "@/constants/routes.constants";
import type {
  CreateWritingPayload,
  UpdateWritingPayload,
  Writing,
  WritingOutline,
} from "@/types/api";
import { WritingStatus } from "@/types/api";
import type { WritingPrompt } from "@/features/writings/constants/writing-prompts";
import { buildContentFromOutline } from "@/features/writings/utils/outline.utils";

type WizardStep = "prompts" | "outline" | "write";

export default function NewWritingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createWriting = useCreateWriting();
  const generateOutline = useGenerateOutline();
  const defaultTab = searchParams.get("tab") === "prompts" ? "prompts" : "free";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [selectedPrompt, setSelectedPrompt] = useState<WritingPrompt | null>(
    null,
  );
  const [wizardStep, setWizardStep] = useState<WizardStep>("prompts");
  const [outline, setOutline] = useState<WritingOutline | null>(null);

  const formInitialData = useMemo(() => {
    if (outline && selectedPrompt) {
      return {
        title: outline.title,
        content: buildContentFromOutline(outline),
        type: selectedPrompt.type,
        status: WritingStatus.DRAFT,
      } as Writing;
    }

    if (!selectedPrompt) return undefined;

    return {
      title: selectedPrompt.title,
      content: selectedPrompt.starterContent,
      type: selectedPrompt.type,
      status: WritingStatus.DRAFT,
    } as Writing;
  }, [outline, selectedPrompt]);

  const handleSubmit = async (
    payload: CreateWritingPayload | UpdateWritingPayload,
  ) => {
    await createWriting.mutateAsync({
      ...(payload as CreateWritingPayload),
      outlineJson: outline ?? undefined,
    });
    toast.success("Đã tạo bài viết");
    router.push(ROUTES.WRITINGS);
  };

  const handlePromptSelect = (prompt: WritingPrompt) => {
    setSelectedPrompt(prompt);
    setOutline(null);
    setWizardStep("outline");
    setActiveTab("prompts");
    toast.success(`Đã chọn đề: ${prompt.title}`);
  };

  const handleGenerateOutline = async () => {
    if (!selectedPrompt) return;

    try {
      const result = await generateOutline.mutateAsync({
        title: selectedPrompt.title,
        type: selectedPrompt.type,
        topic: `${selectedPrompt.topic}\n\nGợi ý: ${selectedPrompt.hint}`,
      });
      setOutline(result);
      toast.success("Đã tạo dàn ý — bạn có thể chỉnh sửa trước khi viết");
    } catch {
      toast.error("Không thể tạo dàn ý. Vui lòng thử lại.");
    }
  };

  const handleContinueToWrite = () => {
    if (!outline) return;
    setWizardStep("write");
    setActiveTab("free");
  };

  return (
    <div className="space-y-8">
      <PageHeader
        variant="glass"
        title="Viết bài mới"
        description="Chọn đề → lập dàn ý → viết bài theo khung có chủ đích"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="free">Viết tự do</TabsTrigger>
          <TabsTrigger value="prompts">Chọn đề & dàn ý</TabsTrigger>
        </TabsList>

        <TabsContent value="prompts" className="mt-4 space-y-6">
          {wizardStep === "prompts" && (
            <WritingPromptPicker
              selectedId={selectedPrompt?.id}
              onSelect={handlePromptSelect}
            />
          )}

          {selectedPrompt && wizardStep === "outline" && (
            <OutlineBuilder
              prompt={selectedPrompt}
              outline={outline}
              isGenerating={generateOutline.isPending}
              onGenerate={handleGenerateOutline}
              onOutlineChange={setOutline}
              onContinue={handleContinueToWrite}
            />
          )}

          {selectedPrompt && wizardStep === "write" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-primary/20 bg-primary-soft/30 px-4 py-3 text-sm text-fg flex flex-wrap items-center justify-between gap-3">
                <span>
                  Đang viết theo đề: <strong>{selectedPrompt.title}</strong>
                </span>
                <button
                  type="button"
                  className="text-primary text-sm font-medium hover:underline"
                  onClick={() => setWizardStep("outline")}
                >
                  Quay lại dàn ý
                </button>
              </div>
              <WritingForm
                key={outline ? `outline-${outline.title}` : selectedPrompt.id}
                initialData={formInitialData}
                isLoading={createWriting.isPending}
                onSubmit={handleSubmit}
                onCancel={() => router.back()}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="free" className="mt-4">
          {selectedPrompt && wizardStep === "write" && (
            <div className="mb-4 rounded-xl border border-primary/20 bg-primary-soft/30 px-4 py-3 text-sm text-fg">
              Đang viết theo đề: <strong>{selectedPrompt.title}</strong>
            </div>
          )}
          <WritingForm
            key={
              outline
                ? `outline-free-${outline.title}`
                : selectedPrompt?.id ?? "free"
            }
            initialData={
              wizardStep === "write" ? formInitialData : undefined
            }
            isLoading={createWriting.isPending}
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
