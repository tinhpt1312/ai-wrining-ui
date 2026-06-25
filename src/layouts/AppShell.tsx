"use client";

import { motion } from "framer-motion";
import { GridBackground } from "@/components/ui/grid-background";
import { LayoutProvider, LayoutMain } from "./LayoutProvider";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProvider>
      <div className="relative flex min-h-screen">
        <GridBackground />
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <main className="app-main flex flex-1 flex-col">
            <LayoutMain>
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                {children}
              </motion.div>
            </LayoutMain>
          </main>
        </div>
      </div>
    </LayoutProvider>
  );
}
