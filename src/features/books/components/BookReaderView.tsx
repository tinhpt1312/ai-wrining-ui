"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  List,
  PenLine,
} from "lucide-react";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import {
  useBook,
  useBookChapter,
  useBookChapters,
  useBookProgress,
  useUpdateBookProgress,
} from "../hooks/useBooksApi";
import { Loading } from "@/components/loading";
import { Error } from "@/components/error-state";
import { Button } from "@/components/button";
import { ROUTES } from "@/constants/routes.constants";
import { booksMessages } from "@/messages/books";
import { msg } from "@/messages/format";
import { cn } from "@/lib/utils";

export function BookReaderView({ bookId }: { bookId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contentRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: book, isLoading: bookLoading, error: bookError } = useBook(bookId);
  const {
    data: chapters,
    isLoading: chaptersLoading,
    error: chaptersError,
  } = useBookChapters(bookId);
  const { data: progress } = useBookProgress(bookId);
  const updateProgress = useUpdateBookProgress();

  const chapterParam = searchParams.get("chapter");
  const activeChapterId = useMemo(() => {
    if (!chapters?.length) return "";
    if (chapterParam && chapters.some((c) => c.id === chapterParam)) {
      return chapterParam;
    }
    if (progress?.currentChapterId) {
      return progress.currentChapterId;
    }
    return chapters[0].id;
  }, [chapters, chapterParam, progress?.currentChapterId]);

  const {
    data: chapter,
    isLoading: chapterLoading,
    error: chapterError,
  } = useBookChapter(bookId, activeChapterId);

  const activeIndex = chapters?.findIndex((c) => c.id === activeChapterId) ?? -1;
  const prevChapter = activeIndex > 0 ? chapters?.[activeIndex - 1] : null;
  const nextChapter =
    chapters && activeIndex >= 0 && activeIndex < chapters.length - 1
      ? chapters[activeIndex + 1]
      : null;

  const saveProgress = useCallback(
    (chapterId: string, scrollOffset = 0) => {
      if (!chapters?.length) return;
      const index = chapters.findIndex((c) => c.id === chapterId);
      const percent = Math.round(((index + 1) / chapters.length) * 100);
      updateProgress.mutate({
        bookId,
        payload: { chapterId, scrollOffset, percentComplete: percent },
      });
    },
    [bookId, chapters, updateProgress],
  );

  const navigateToChapter = (chapterId: string) => {
    router.replace(ROUTES.bookRead(bookId, chapterId));
    saveProgress(chapterId, 0);
  };

  useEffect(() => {
    if (!progress?.scrollOffset || !contentRef.current || chapterLoading) {
      return;
    }
    contentRef.current.scrollTop = progress.scrollOffset;
  }, [chapter?.id, progress?.scrollOffset, chapterLoading]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el || !activeChapterId) return;

    const handleScroll = () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        saveProgress(activeChapterId, el.scrollTop);
      }, 800);
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", handleScroll);
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [activeChapterId, saveProgress]);

  if (bookLoading || chaptersLoading) {
    return <Loading fullScreen text={booksMessages.reader.loading} />;
  }

  if (bookError || chaptersError || !book || !chapters?.length) {
    return (
      <Error
        title={booksMessages.reader.errorTitle}
        message={booksMessages.reader.errorMessage}
        retry={() => router.push(ROUTES.book(bookId))}
      />
    );
  }

  const writeUrl = `${ROUTES.WRITING_NEW}?bookId=${bookId}&chapterId=${activeChapterId}`;

  const sidebar = (
    <aside className="panel-glass h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-border/60 shrink-0">
        <h2 className="text-sm font-semibold text-fg flex items-center gap-2">
          <List className="h-4 w-4 text-primary" />
          {booksMessages.reader.tableOfContents}
        </h2>
        <p className="text-xs text-muted mt-1 truncate">{book.title}</p>
      </div>
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {chapters.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => navigateToChapter(item.id)}
            className={cn(
              "w-full text-left rounded-lg px-3 py-2 text-sm transition-colors",
              item.id === activeChapterId
                ? "bg-primary/15 text-primary font-medium"
                : "text-muted hover:bg-surface-2 hover:text-fg",
            )}
          >
            <span className="line-clamp-2">{item.title}</span>
          </button>
        ))}
      </nav>
    </aside>
  );

  const contentPanel = (
    <div className="panel-glass h-full flex flex-col overflow-hidden">
      <div className="shrink-0 border-b border-border/60 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-fg truncate">
            {chapter?.title ?? booksMessages.reader.chapterLoading}
          </h1>
          {progress?.percentComplete ? (
            <p className="text-xs text-muted">
              {msg(booksMessages.detail.progressLabel, {
                percent: Math.round(Number(progress.percentComplete)),
              })}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={ROUTES.book(bookId)}>
            <Button variant="outline" size="sm">
              {booksMessages.reader.backToDetail}
            </Button>
          </Link>
          <Link href={writeUrl}>
            <Button size="sm" className="gap-1.5">
              <PenLine className="h-3.5 w-3.5" />
              {booksMessages.reader.writeFromChapter}
            </Button>
          </Link>
        </div>
      </div>

      <div ref={contentRef} className="flex-1 overflow-y-auto p-6 lg:p-10">
        {chapterLoading ? (
          <Loading text={booksMessages.reader.chapterLoading} />
        ) : chapterError || !chapter ? (
          <Error
            title={booksMessages.reader.errorTitle}
            message={booksMessages.reader.errorMessage}
          />
        ) : (
          <article
            className="prose prose-neutral dark:prose-invert max-w-3xl mx-auto prose-p:leading-relaxed prose-headings:text-fg"
            dangerouslySetInnerHTML={{ __html: chapter.content }}
          />
        )}
      </div>

      <div className="shrink-0 border-t border-border/60 px-4 py-3 flex justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          disabled={!prevChapter}
          onClick={() => prevChapter && navigateToChapter(prevChapter.id)}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {booksMessages.reader.previousChapter}
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!nextChapter}
          onClick={() => nextChapter && navigateToChapter(nextChapter.id)}
          className="gap-1"
        >
          {booksMessages.reader.nextChapter}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100dvh-5rem)] min-h-[480px]">
      <div className="hidden lg:block h-full">
        <PanelGroup direction="horizontal" className="h-full gap-1">
          <Panel defaultSize={28} minSize={20} maxSize={40}>
            {sidebar}
          </Panel>
          <PanelResizeHandle className="w-1.5 rounded-full resize-handle-glow mx-0.5" />
          <Panel defaultSize={72} minSize={50}>
            {contentPanel}
          </Panel>
        </PanelGroup>
      </div>

      <div className="lg:hidden h-full flex flex-col gap-3">
        <details className="panel-glass shrink-0">
          <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-fg">
            {booksMessages.reader.tableOfContents}
          </summary>
          <div className="max-h-48 overflow-y-auto p-2 border-t border-border/60">
            {chapters.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigateToChapter(item.id)}
                className={cn(
                  "w-full text-left rounded-lg px-3 py-2 text-sm",
                  item.id === activeChapterId
                    ? "bg-primary/15 text-primary"
                    : "text-muted",
                )}
              >
                {item.title}
              </button>
            ))}
          </div>
        </details>
        <div className="flex-1 min-h-0">{contentPanel}</div>
      </div>
    </div>
  );
}
