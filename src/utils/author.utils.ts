export function getAuthorInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";

  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }

  return trimmed.slice(0, 2).toUpperCase();
}

export function getAuthorDisplayName(
  author?: { username: string; fullName?: string | null },
): string {
  if (!author) return "Ẩn danh";
  return author.fullName?.trim() || author.username;
}
