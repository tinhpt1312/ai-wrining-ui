"use client";

import { GridBackground } from "@/components/grid-background";
import { Loading } from "@/components/loading";
import { useAuth } from "@/features/auth";
import { LandingNavbar } from "./LandingNavbar";
import { LandingHero } from "./LandingHero";
import { LandingFeatures } from "./LandingFeatures";
import { LandingSteps } from "./LandingSteps";
import { LandingCta } from "./LandingCta";
import { LandingFooter } from "./LandingFooter";

export function LandingView() {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return <Loading fullScreen text="Đang tải..." />;
  }

  return (
    <div className="relative min-h-screen flex flex-col app-bg">
      <GridBackground />
      <LandingNavbar isAuthenticated={isAuthenticated} />
      <main className="relative flex-1">
        <LandingHero isAuthenticated={isAuthenticated} />
        <LandingFeatures />
        <LandingSteps />
        <LandingCta isAuthenticated={isAuthenticated} />
      </main>
      <LandingFooter />
    </div>
  );
}
