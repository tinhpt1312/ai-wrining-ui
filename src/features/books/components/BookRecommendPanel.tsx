"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Loader2, Sparkles } from "lucide-react";
import { useRecommendBooks } from "@/features/books";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Select } from "@/components/select";
import { EmptyState } from "@/components/empty-state";
import { ROUTES } from "@/constants/routes.constants";
import { getWritableTypeOptions } from "@/utils/helpers";
import { toast } from "@/lib/toast";
import { booksMessages } from "@/messages/books";
import { msg } from "@/messages/format";
import { WritingType, type BookRecommendation } from "@/types/api";

interface BookRecommendPanelProps {
  defaultWritingType?: WritingType;
  defaultTopic?: string;
  draftExcerpt?: string;
  onSelectPrompt?: (recommendation: BookRecommendation) => void;
}

export function BookRecommendPanel({
  defaultWritingType = WritingType.SOCIAL_ESSAY,
  defaultTopic = "",
  draftExcerpt,
  onSelectPrompt,
}: BookRecommendPanelProps) {
  const [writingType, setWritingType] = useState(defaultWritingType);
  const [topic, setTopic] = useState(defaultTopic);
  const [recommendations, setRecommendations] = useState<BookRecommendation[]>(
    [],
  );
  const recommendBooks = useRecommendBooks();
  const typeOptions = getWritableTypeOptions();

  const handleRecommend = async () => {
    try {
      const result = await recommendBooks.mutateAsync({
        writingType,
        topic: topic.trim() || undefined,
        draftExcerpt: draftExcerpt?.trim() || undefined,
        count: 3,
      });
      setRecommendations(result);
      toast.success(booksMessages.recommend.toastSuccess);
    } catch {
      toast.error(booksMessages.recommend.toastError);
    }
  };

  return (
    <div className="panel-glass p-5 sm:p-6 space-y-5">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-fg flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          {booksMessages.recommend.title}
        </h2>
        <p className="text-xs text-muted">{booksMessages.recommend.description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label={booksMessages.recommend.writingTypeLabel}
          name="writingType"
          value={writingType}
          onChange={(e) => setWritingType(e.target.value as WritingType)}
          options={typeOptions}
        />
        <Input
          label={booksMessages.recommend.topicLabel}
          name="topic"
          placeholder={booksMessages.recommend.topicPlaceholder}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
      </div>

      <Button
        type="button"
        onClick={handleRecommend}
        disabled={recommendBooks.isPending}
        className="gap-2 btn-glow-solid"
      >
        {recommendBooks.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <BookOpen className="h-4 w-4" />
        )}
        {recommendBooks.isPending
          ? booksMessages.recommend.generating
          : booksMessages.recommend.generateButton}
      </Button>

      {recommendations.length === 0 && !recommendBooks.isPending ? (
        <EmptyState
          icon={<BookOpen className="h-8 w-8" />}
          title={booksMessages.recommend.emptyTitle}
          description={booksMessages.recommend.emptyDescription}
        />
      ) : (
        <div className="space-y-4">
          {recommendations.map((item) => (
            <article
              key={item.bookId}
              className="rounded-xl border border-border/60 bg-surface/50 p-4 space-y-3"
            >
              <div className="space-y-1">
                <h3 className="font-semibold text-fg">{item.title}</h3>
                <p className="text-xs text-muted">{item.author}</p>
                <p className="text-sm text-muted leading-relaxed">{item.reason}</p>
                <p className="text-xs text-primary">
                  {msg(booksMessages.recommend.relevanceScore, {
                    score: item.relevanceScore,
                  })}
                </p>
              </div>
              <p className="text-sm text-fg/90 italic border-l-2 border-primary/40 pl-3">
                {item.suggestedEssayPrompt}
              </p>
              <div className="flex flex-wrap gap-2">
                <Link href={ROUTES.book(item.bookId)}>
                  <Button size="sm" variant="outline">
                    {booksMessages.recommend.viewBook}
                  </Button>
                </Link>
                <Button
                  size="sm"
                  onClick={() => onSelectPrompt?.(item)}
                >
                  {booksMessages.recommend.writeFromBook}
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
