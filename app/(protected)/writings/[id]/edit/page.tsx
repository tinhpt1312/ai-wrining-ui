"use client";

import { useRouter } from "next/navigation";
import { useWriting, useUpdateWriting } from "@/hooks/useApi";
import { WritingForm } from "@/components/WritingForm";
import { Loading, Error, Alert } from "@/components/ui/States";
import { useState, use } from "react";

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
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (payload: any) => {
    try {
      await updateWriting.mutateAsync({ id, payload });
      setSuccess(true);
      setTimeout(() => {
        router.push(`/writings/${id}`);
      }, 1500);
    } catch (error) {
      throw error;
    }
  };

  if (isLoading) {
    return <Loading fullScreen text="Loading writing..." />;
  }

  if (error) {
    return (
      <Error
        title="Failed to Load Writing"
        message="Could not fetch this writing. Please try again."
        retry={() => router.back()}
      />
    );
  }

  if (!writing) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-fg tracking-tight">
          Edit Writing
        </h1>
        <p className="text-sm text-muted mt-1">
          Update your writing details and content
        </p>
      </div>

      {success && (
        <Alert
          type="success"
          title="Success"
          message="Your writing has been updated successfully!"
        />
      )}

      <WritingForm
        initialData={writing}
        isLoading={updateWriting.isPending}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
      />
    </div>
  );
}
