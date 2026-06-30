import type { Metadata } from "next";
import { LandingView } from "@/features/landing";
import { appMessages } from "@/messages/app";

export const metadata: Metadata = {
  title: appMessages.landingMeta.title,
  description: appMessages.landingMeta.description,
  openGraph: {
    title: appMessages.landingMeta.ogTitle,
    description: appMessages.landingMeta.ogDescription,
    locale: "vi_VN",
    type: "website",
  },
};

export default function HomePage() {
  return <LandingView />;
}
