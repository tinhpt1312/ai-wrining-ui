"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { useAuth } from "@/features/auth";
import {
  useBooks,
  usePendingBooks,
  useCreateBook,
  useUpdateBook,
  useDeleteBook,
  useApproveBook,
  useRejectBook,
  AdminBookForm,
  BookIngestButton,
} from "@/features/books";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/button";
import { Loading } from "@/components/loading";
import { Error } from "@/components/error-state";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/badge";
import { useConfirmDialog } from "@/components/confirm-dialog";
import { toast } from "@/lib/toast";
import { booksMessages } from "@/messages/books";
import { msg } from "@/messages/format";
import { commonMessages } from "@/messages/common";
import { BookApprovalStatus } from "@/types/api";
import type {
  Book,
  CreateBookPayload,
  UpdateBookPayload,
} from "@/types/api";

type AdminTab = "all" | "pending";

export function AdminBooksView() {
  const { user } = useAuth();
  const { confirm, ConfirmDialog } = useConfirmDialog();
  const [activeTab, setActiveTab] = useState<AdminTab>("all");
  const { data, isLoading, error } = useBooks({
    includePrivate: true,
    limit: 100,
  });
  const { data: pendingData, isLoading: isLoadingPending } = usePendingBooks({
    limit: 100,
  });
  const createBook = useCreateBook();
  const updateBook = useUpdateBook();
  const deleteBook = useDeleteBook();
  const approveBook = useApproveBook();
  const rejectBook = useRejectBook();
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showForm, setShowForm] = useState(false);

  if (user?.role !== "admin") {
    return (
      <Error
        title={booksMessages.admin.accessDenied}
        message={booksMessages.admin.accessDenied}
      />
    );
  }

  const isPendingTab = activeTab === "pending";
  const isListLoading = isPendingTab ? isLoadingPending : isLoading;
  const listError = isPendingTab ? null : error;

  if (isListLoading) {
    return <Loading fullScreen text={booksMessages.loading} />;
  }

  if (listError) {
    return (
      <Error
        title={booksMessages.error.title}
        message={booksMessages.error.message}
        retry={() => window.location.reload()}
      />
    );
  }

  const allBooks = data?.data ?? [];
  const pendingBooks = pendingData?.data ?? [];
  const books = isPendingTab ? pendingBooks : allBooks;

  const handleCreate = async (
    payload: CreateBookPayload | UpdateBookPayload,
  ) => {
    await createBook.mutateAsync(payload as CreateBookPayload);
    toast.success(booksMessages.admin.createSuccess);
    setShowForm(false);
  };

  const handleUpdate = async (
    payload: CreateBookPayload | UpdateBookPayload,
  ) => {
    if (!editingBook) return;
    await updateBook.mutateAsync({
      id: editingBook.id,
      payload: payload as UpdateBookPayload,
    });
    toast.success(booksMessages.admin.updateSuccess);
    setEditingBook(null);
  };

  const handleDelete = async (book: Book) => {
    const confirmed = await confirm({
      title: msg(booksMessages.admin.deleteConfirm, { title: book.title }),
      description: booksMessages.admin.deleteConfirmDescription,
      confirmLabel: booksMessages.admin.table.delete,
      cancelLabel: commonMessages.cancel,
      variant: "destructive",
    });
    if (!confirmed) return;
    await deleteBook.mutateAsync(book.id);
    toast.success(booksMessages.admin.deleteSuccess);
  };

  const handleApprove = async (book: Book) => {
    await approveBook.mutateAsync(book.id);
    toast.success(booksMessages.admin.pending.approveSuccess);
  };

  const handleReject = async (book: Book) => {
    const confirmed = await confirm({
      title: msg(booksMessages.admin.pending.rejectConfirm, {
        title: book.title,
      }),
      description: booksMessages.admin.pending.rejectPrompt,
      confirmLabel: booksMessages.admin.pending.reject,
      cancelLabel: commonMessages.cancel,
      variant: "destructive",
    });
    if (!confirmed) return;
    await rejectBook.mutateAsync({ id: book.id });
    toast.success(booksMessages.admin.pending.rejectSuccess);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        variant="glass"
        title={booksMessages.admin.title}
        description={booksMessages.admin.description}
        actions={
          <Button
            className="gap-2 btn-glow-solid"
            onClick={() => {
              setEditingBook(null);
              setShowForm(true);
            }}
          >
            <Plus className="h-4 w-4" />
            {booksMessages.admin.addBook}
          </Button>
        }
      />

      {(showForm || editingBook) && (
        <div className="space-y-3">
          <AdminBookForm
            key={editingBook?.id ?? "new"}
            initialData={editingBook ?? undefined}
            isLoading={createBook.isPending || updateBook.isPending}
            onSubmit={editingBook ? handleUpdate : handleCreate}
            onCancel={() => {
              setShowForm(false);
              setEditingBook(null);
            }}
          />
          {editingBook ? (
            <div className="panel-glass p-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted">{booksMessages.admin.ingest.hint}</p>
              <BookIngestButton bookId={editingBook.id} />
            </div>
          ) : null}
        </div>
      )}

      <div className="panel-glass overflow-hidden">
        <div className="px-5 py-4 border-b border-border/60 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-fg">
            {booksMessages.admin.table.title}
          </h2>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={activeTab === "all" ? "solid" : "outline"}
              onClick={() => setActiveTab("all")}
            >
              {booksMessages.admin.pending.tabAll}
            </Button>
            <Button
              size="sm"
              variant={activeTab === "pending" ? "solid" : "outline"}
              onClick={() => setActiveTab("pending")}
            >
              {msg(booksMessages.admin.pending.tabPending, {
                count: pendingBooks.length,
              })}
            </Button>
          </div>
        </div>

        {books.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title={booksMessages.empty.title}
              description={
                isPendingTab
                  ? booksMessages.admin.pending.empty
                  : booksMessages.admin.table.empty
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left text-muted">
                  <th className="px-5 py-3 font-medium">
                    {booksMessages.admin.form.titleLabel}
                  </th>
                  <th className="px-5 py-3 font-medium">
                    {booksMessages.admin.form.authorLabel}
                  </th>
                  <th className="px-5 py-3 font-medium">
                    {booksMessages.admin.form.categoryLabel}
                  </th>
                  {isPendingTab ? (
                    <th className="px-5 py-3 font-medium">
                      {booksMessages.admin.pending.fileFormat}
                    </th>
                  ) : (
                    <th className="px-5 py-3 font-medium">
                      {booksMessages.admin.form.isPublicLabel}
                    </th>
                  )}
                  <th className="px-5 py-3 font-medium">
                    {booksMessages.admin.table.chapters}
                  </th>
                  <th className="px-5 py-3 font-medium text-right">
                    {booksMessages.admin.table.actions}
                  </th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id} className="border-b border-border/40">
                    <td className="px-5 py-3 font-medium text-fg">
                      <div className="flex flex-wrap items-center gap-2">
                        {book.title}
                        {book.approvalStatus === BookApprovalStatus.PENDING ? (
                          <Badge variant="warning">
                            {booksMessages.admin.pending.statusPending}
                          </Badge>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted">{book.author}</td>
                    <td className="px-5 py-3 text-muted">
                      {booksMessages.category[book.category]}
                    </td>
                    <td className="px-5 py-3 text-muted">
                      {isPendingTab
                        ? (book.fileFormat?.toUpperCase() ?? "—")
                        : book.isPublic
                          ? booksMessages.admin.table.statusPublic
                          : booksMessages.admin.table.statusHidden}
                    </td>
                    <td className="px-5 py-3 text-muted">
                      {book.totalChapters}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2 flex-wrap">
                        {isPendingTab ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1 text-success"
                              onClick={() => handleApprove(book)}
                              isLoading={approveBook.isPending}
                            >
                              <Check className="h-3.5 w-3.5" />
                              {booksMessages.admin.pending.approve}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="gap-1 text-danger"
                              onClick={() => handleReject(book)}
                              isLoading={rejectBook.isPending}
                            >
                              <X className="h-3.5 w-3.5" />
                              {booksMessages.admin.pending.reject}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="gap-1 text-danger"
                              onClick={() => handleDelete(book)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              {booksMessages.admin.table.delete}
                            </Button>
                          </>
                        ) : (
                          <>
                            <BookIngestButton bookId={book.id} />
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1"
                              onClick={() => {
                                setShowForm(false);
                                setEditingBook(book);
                              }}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              {booksMessages.admin.table.edit}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="gap-1 text-danger"
                              onClick={() => handleDelete(book)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              {booksMessages.admin.table.delete}
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog />
    </div>
  );
}
