"use client";

import { use } from "react";
import { UserProfileView } from "@/features/explore";

interface UserProfilePageProps {
  params: Promise<{ username: string }>;
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const { username } = use(params);
  return <UserProfileView username={username} />;
}
