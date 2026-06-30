"use client";

import { useAuth, useUser } from "@/features/auth";
import {
  ProfilePageHeader,
  ProfileSettingsTabs,
} from "@/features/profile";
import { Loading } from "@/components/loading";
import { Error } from "@/components/error-state";
import { PageHeader } from "@/components/page-header";
import { navMessages } from "@/messages/nav";
import { profileMessages } from "@/messages/profile";

export default function ProfilePage() {
  const { data: user, isLoading, error } = useUser();
  const { setUser } = useAuth();

  if (isLoading) {
    return <Loading fullScreen text={profileMessages.loading} />;
  }

  if (error || !user) {
    return (
      <Error
        title={profileMessages.error.title}
        message={profileMessages.error.message}
        retry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        variant="glass"
        title={navMessages.profileTitle}
        description={profileMessages.page.description}
      />
      <ProfilePageHeader user={user} />
      <ProfileSettingsTabs user={user} onUpdated={setUser} />
    </div>
  );
}
