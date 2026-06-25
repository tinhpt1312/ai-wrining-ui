import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes.constants";

interface SuggestionsRedirectPageProps {
  params: Promise<{ id: string }>;
}

/** @deprecated Use `/writings/[id]/revise` — suggestions live in the revise workspace drawer. */
export default async function SuggestionsRedirectPage({
  params,
}: SuggestionsRedirectPageProps) {
  const { id } = await params;
  redirect(ROUTES.writingRevise(id));
}
