export type UserRole = "user" | "admin";

export interface User {
  id: string;
  username: string;
  email?: string;
  fullName?: string;
  isActive?: boolean;
  role?: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface WritingAuthor {
  username: string;
  fullName?: string | null;
}

export interface UpdateProfilePayload {
  username?: string;
  email?: string;
  fullName?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface PublicUserProfile {
  username: string;
  fullName?: string | null;
  createdAt: string;
  publicWritingsCount: number;
}
