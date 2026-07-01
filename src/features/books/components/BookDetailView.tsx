"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Clock, ExternalLink, PenLine, Trash2 } from "lucide-react";
import { useAuth } from "@/features/auth";
import { useBook, useDeleteBook } from "@/features/books";
import { Loading } from "@/components/loading";
import { Error } from "@/components/error-state";
import { Alert } from "@/components/alert";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/button";
import { Badge } from "@/components/badge";
import { useConfirmDialog } from "@/components/confirm-dialog";
import { ROUTES } from "@/constants/routes.constants";
import { getWritingTypeLabel, getErrorMessage } from "@/utils/helpers";
import { booksMessages } from "@/messages/books";
import { commonMessages } from "@/messages/common";
import { msg } from "@/messages/format";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { BookApprovalStatus } from "@/types/api";

export function BookDetailView({ id }: { id: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const { data: book, isLoading, error } = useBook(id);
  const deleteBook = useDeleteBook();
  const { confirm, ConfirmDialog } = useConfirmDialog();

  const canDelete =
    !!user &&
    !!book &&
    (user.role === "admin" || book.uploadedByUserId === user.id);

  const handleDelete = async () => {
    if (!book) return;
    const confirmed = await confirm({
      title: msg(booksMessages.admin.deleteConfirm, { title: book.title }),
      description: booksMessages.admin.deleteConfirmDescription,
      confirmLabel: booksMessages.admin.table.delete,
      cancelLabel: commonMessages.cancel,
      variant: "destructive",
    });
    if (!confirmed) return;

    try {
      await deleteBook.mutateAsync(book.id);
      toast.success(booksMessages.admin.deleteSuccess);
      router.push(
        book.uploadedByUserId === user?.id
          ? ROUTES.BOOKS_UPLOAD
          : ROUTES.BOOKS,
      );
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (isLoading) {
    return <Loading fullScreen text={booksMessages.detail.loading} />;
  }

  if (error || !book) {
    return (
      <Error
        title={booksMessages.detail.errorTitle}
        message={booksMessages.detail.errorMessage}
        retry={() => router.push(ROUTES.BOOKS)}
      />
    );
  }

  const writeFromBookUrl = `${ROUTES.WRITING_NEW}?bookId=${book.id}`;
  const hasOnlineContent = book.totalChapters > 0;

  return (
    <>
      <ConfirmDialog />
      <div className="space-y-8">
        <PageHeader
          variant="glass"
          title={book.title}
          description={book.author}
          actions={
            <div className="flex flex-wrap gap-2">
              {canDelete ? (
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-1.5"
                  onClick={handleDelete}
                  disabled={deleteBook.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                  {booksMessages.admin.table.delete}
                </Button>
              ) : null}
              <Link href={ROUTES.BOOKS}>
                <Button variant="outline" size="sm">
                  {booksMessages.detail.backToLibrary}
                </Button>
              </Link>
            </div>
          }
        />

      {book.approvalStatus === BookApprovalStatus.PENDING ? (
        <Alert type="warning" message={booksMessages.approval.pendingBanner} />
      ) : null}
      {book.approvalStatus === BookApprovalStatus.REJECTED ? (
        <Alert
          type="error"
          message={
            book.rejectionReason
              ? msg(booksMessages.approval.rejectedBanner, {
                  reason: book.rejectionReason,
                })
              : booksMessages.approval.rejectedBannerNoReason
          }
        />
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 panel-glass p-6 space-y-6">
          <div className="flex flex-wrap gap-2">
            <Badge>{booksMessages.category[book.category]}</Badge>
            {book.writingTypes.map((type) => (
              <Badge key={type} variant="neutral">
                {getWritingTypeLabel(type)}
              </Badge>
            ))}
          </div>

          {book.description ? (
            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-fg">
                {booksMessages.detail.descriptionLabel}
              </h2>
              <p className="text-sm text-muted leading-relaxed whitespace-pre-wrap">
                {book.description}
              </p>
            </div>
          ) : null}

          {book.tags.length > 0 ? (
            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-fg">
                {booksMessages.detail.tagsLabel}
              </h2>
              <div className="flex flex-wrap gap-2">
                {book.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-surface-2 px-3 py-1 text-xs text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="panel-glass p-6 space-y-5 h-fit">
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-subtle text-xs uppercase tracking-wide">
                {booksMessages.detail.authorLabel}
              </p>
              <p className="text-fg font-medium">{book.author}</p>
            </div>
            {book.readingTimeMinutes ? (
              <div className="flex items-center gap-2 text-muted">
                <Clock className="h-4 w-4" />
                {msg(booksMessages.detail.readingTimeValue, {
                  minutes: book.readingTimeMinutes,
                })}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 pt-2">
            {hasOnlineContent ? (
              <Link href={ROUTES.bookRead(book.id)}>
                <Button className="w-full gap-2 btn-glow-solid">
                  <BookOpen className="h-4 w-4" />
                  {booksMessages.detail.readOnline}
                </Button>
              </Link>
            ) : null}
            {book.externalUrl ? (
              <a
                href={book.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="w-full gap-2">
                  <ExternalLink className="h-4 w-4" />
                  {booksMessages.detail.externalLink}
                </Button>
              </a>
            ) : null}
            {hasOnlineContent ? (
              <p className="text-xs text-muted text-center">
                {msg(booksMessages.detail.chaptersLabel, {
                  count: book.totalChapters,
                })}
              </p>
            ) : null}
            <Link href={writeFromBookUrl}>
              <Button
                variant={hasOnlineContent ? "outline" : "solid"}
                className={cn(
                  "w-full gap-2",
                  !hasOnlineContent && "btn-glow-solid",
                )}
              >
                <PenLine className="h-4 w-4" />
                {booksMessages.detail.writeEssay}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
