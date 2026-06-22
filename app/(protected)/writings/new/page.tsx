"use client";

import { useRouter } from "next/navigation";
import { useCreateWriting } from "@/hooks/useApi";
import { WritingForm } from "@/components/WritingForm";
import { Alert } from "@/components/ui/States";
import { useState } from "react";

export default function NewWritingPage() {
  const router = useRouter();
  const createWriting = useCreateWriting();
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (payload: any) => {
    try {
      await createWriting.mutateAsync(payload);
      setSuccess(true);
      setTimeout(() => {
        router.push("/writings");
      }, 1500);
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-fg tracking-tight">
          Create New Writing
        </h1>
        <p className="text-sm text-muted mt-1">
          Write your thoughts, ideas, or stories
        </p>
      </div>

      {success && (
        <Alert
          type="success"
          title="Success"
          message="Your writing has been created successfully!"
        />
      )}

      <WritingForm
        isLoading={createWriting.isPending}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
      />
    </div>
  );
}
