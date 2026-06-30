"use client";

import { useRouter } from "next/navigation";
import { use } from "react";
import {
  useWriting,
  useUpdateWriting,
  WritingForm,
} from "@/features/writings";
import { Loading } from "@/components/loading";
import { Error } from "@/components/error-state";
import { PageHeader } from "@/components/page-header";
import { toast } from "@/lib/toast";
import { writingsMessages } from "@/messages/writings";
import { ROUTES } from "@/constants/routes.constants";
import type * as types from "@/types/api";

interface EditWritingPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditWritingPage({ params }: EditWritingPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { data: writing, isLoading, error } = useWriting(id);
  const updateWriting = useUpdateWriting();

  const handleSubmit = async (
    payload: types.CreateWritingPayload | types.UpdateWritingPayload,
  ) => {
    await updateWriting.mutateAsync({ id, payload });
    toast.success(writingsMessages.editPage.updateSuccess);
    router.push(ROUTES.writing(id));
  };

  if (isLoading) {
    return <Loading fullScreen text={writingsMessages.editPage.loading} />;
  }

  if (error) {
    return (
      <Error
        title={writingsMessages.editPage.errorTitle}
        message={writingsMessages.editPage.errorMessage}
        retry={() => router.back()}
      />
    );
  }

  if (!writing) {
    return null;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        variant="glass"
        title={writingsMessages.editPage.title}
        description={writing.title}
      />

      <WritingForm
        initialData={writing}
        isLoading={updateWriting.isPending}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
      />
    </div>
  );
}
