"use client";

import { useAuth, useUser } from "@/features/auth";
import {
  ProfilePageHeader,
  ProfileSettingsTabs,
} from "@/features/profile";
import { Loading } from "@/components/loading";
import { Error } from "@/components/error-state";
import { PageHeader } from "@/components/page-header";

export default function ProfilePage() {
  const { data: user, isLoading, error } = useUser();
  const { setUser } = useAuth();

  if (isLoading) {
    return <Loading fullScreen text="Đang tải hồ sơ..." />;
  }

  if (error || !user) {
    return (
      <Error
        title="Không tải được hồ sơ"
        message="Không thể lấy thông tin tài khoản."
        retry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        variant="glass"
        title="Hồ sơ cá nhân"
        description="Quản lý thông tin tài khoản và bảo mật"
      />
      <ProfilePageHeader user={user} />
      <ProfileSettingsTabs user={user} onUpdated={setUser} />
    </div>
  );
}
