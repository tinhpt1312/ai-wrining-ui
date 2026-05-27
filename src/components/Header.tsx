"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/writings"
          className="text-2xl font-bold text-black dark:text-white hover:opacity-80 transition-opacity"
        >
          AI Writing
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors font-medium"
          >
            Dashboard
          </Link>
          <Link
            href="/writings"
            className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors font-medium"
          >
            Writings
          </Link>
          <Link
            href="/analysis"
            className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors font-medium"
          >
            Analyses
          </Link>
          <Link
            href="/writings/new"
            className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors font-medium"
          >
            New Writing
          </Link>

          <div className="flex items-center gap-4 border-l border-gray-200 dark:border-gray-800 pl-6">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {user?.username}
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
