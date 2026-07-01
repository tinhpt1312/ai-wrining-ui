"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useCreateWriting,
  useGenerateOutline,
  WritingForm,
  WritingPromptPicker,
  OutlineBuilder,
} from "@/features/writings";
import { BookRecommendPanel, useBook } from "@/features/books";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";
import { toast } from "@/lib/toast";
import { msg } from "@/messages/format";
import { writingsMessages } from "@/messages/writings";
import { booksMessages } from "@/messages/books";
import { ROUTES } from "@/constants/routes.constants";
import type {
  CreateWritingPayload,
  UpdateWritingPayload,
  Writing,
  WritingOutline,
  BookRecommendation,
} from "@/types/api";
import { WritingStatus, WritingType } from "@/types/api";
import type { WritingPrompt } from "@/features/writings/constants/writing-prompts";
import { buildContentFromOutline } from "@/features/writings/utils/outline.utils";

type WizardStep = "prompts" | "outline" | "write";

export default function NewWritingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createWriting = useCreateWriting();
  const generateOutline = useGenerateOutline();
  const defaultTab = searchParams.get("tab") === "prompts"
    ? "prompts"
    : searchParams.get("tab") === "books"
      ? "books"
      : "free";
  const bookId = searchParams.get("bookId") ?? "";
  const { data: sourceBook } = useBook(bookId);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [selectedPrompt, setSelectedPrompt] = useState<WritingPrompt | null>(
    null,
  );
  const [wizardStep, setWizardStep] = useState<WizardStep>("prompts");
  const [outline, setOutline] = useState<WritingOutline | null>(null);
  const [bookRecommendation, setBookRecommendation] =
    useState<BookRecommendation | null>(null);

  useEffect(() => {
    if (bookId) {
      setActiveTab("free");
    }
  }, [bookId]);

  const formInitialData = useMemo(() => {
    if (bookRecommendation) {
      const writingType =
        sourceBook?.writingTypes[0] ?? WritingType.SOCIAL_ESSAY;
      return {
        title: `${booksMessages.writeFromBook.banner}: ${bookRecommendation.title}`,
        content: `${booksMessages.writeFromBook.starterPrefix}${bookRecommendation.suggestedEssayPrompt}`,
        type: writingType,
        status: WritingStatus.DRAFT,
      } as Writing;
    }

    if (sourceBook && bookId) {
      const writingType = sourceBook.writingTypes[0] ?? WritingType.SOCIAL_ESSAY;
      return {
        title: `${booksMessages.writeFromBook.banner}: ${sourceBook.title}`,
        content: `${booksMessages.writeFromBook.bookLabel}: ${sourceBook.title} — ${sourceBook.author}\n\n${sourceBook.description ?? ""}`,
        type: writingType,
        status: WritingStatus.DRAFT,
      } as Writing;
    }

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
  }, [outline, selectedPrompt, sourceBook, bookId, bookRecommendation]);

  const handleSubmit = async (
    payload: CreateWritingPayload | UpdateWritingPayload,
  ) => {
    await createWriting.mutateAsync({
      ...(payload as CreateWritingPayload),
      outlineJson: outline ?? undefined,
    });
    toast.success(writingsMessages.newPage.createSuccess);
    router.push(ROUTES.WRITINGS);
  };

  const handlePromptSelect = (prompt: WritingPrompt) => {
    setSelectedPrompt(prompt);
    setOutline(null);
    setWizardStep("outline");
    setActiveTab("prompts");
    toast.success(msg(writingsMessages.newPage.promptSelected, { title: prompt.title }));
  };

  const handleGenerateOutline = async () => {
    if (!selectedPrompt) return;

    try {
      const result = await generateOutline.mutateAsync({
        title: selectedPrompt.title,
        type: selectedPrompt.type,
        topic: `${selectedPrompt.topic}\n\n${writingsMessages.outline.hintPrefix} ${selectedPrompt.hint}`,
      });
      setOutline(result);
      toast.success(writingsMessages.outline.toastSuccess);
    } catch {
      toast.error(writingsMessages.outline.toastError);
    }
  };

  const handleContinueToWrite = () => {
    if (!outline) return;
    setWizardStep("write");
    setActiveTab("free");
  };

  const handleBookRecommendationSelect = (item: BookRecommendation) => {
    setBookRecommendation(item);
    setSelectedPrompt(null);
    setOutline(null);
    setWizardStep("write");
    setActiveTab("free");
  };

  const formKey = bookRecommendation
    ? `book-rec-${bookRecommendation.bookId}`
    : bookId
      ? `book-${bookId}`
      : outline
        ? `outline-free-${outline.title}`
        : selectedPrompt?.id ?? "free";

  const showBookBanner = !!(sourceBook && bookId) || !!bookRecommendation;

  return (
    <div className="space-y-8">
      <PageHeader
        variant="glass"
        title={writingsMessages.newPage.title}
        description={writingsMessages.newPage.description}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="free">{writingsMessages.newPage.tabFree}</TabsTrigger>
          <TabsTrigger value="prompts">{writingsMessages.newPage.tabPrompts}</TabsTrigger>
          <TabsTrigger value="books">{writingsMessages.newPage.tabBooks}</TabsTrigger>
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
                  {writingsMessages.newPage.writingFromPrompt}{" "}
                  <strong>{selectedPrompt.title}</strong>
                </span>
                <button
                  type="button"
                  className="text-primary text-sm font-medium hover:underline"
                  onClick={() => setWizardStep("outline")}
                >
                  {writingsMessages.newPage.backToOutline}
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

        <TabsContent value="books" className="mt-4">
          <BookRecommendPanel onSelectPrompt={handleBookRecommendationSelect} />
        </TabsContent>

        <TabsContent value="free" className="mt-4 space-y-4">
          {showBookBanner ? (
            <div className="rounded-xl border border-primary/20 bg-primary-soft/30 px-4 py-3 text-sm text-fg">
              {booksMessages.writeFromBook.banner}{" "}
              <strong>
                {bookRecommendation?.title ?? sourceBook?.title}
              </strong>
            </div>
          ) : null}
          {selectedPrompt && wizardStep === "write" ? (
            <div className="rounded-xl border border-primary/20 bg-primary-soft/30 px-4 py-3 text-sm text-fg">
              {writingsMessages.newPage.writingFromPrompt}{" "}
              <strong>{selectedPrompt.title}</strong>
            </div>
          ) : null}
          <WritingForm
            key={formKey}
            initialData={formInitialData}
            isLoading={createWriting.isPending}
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
