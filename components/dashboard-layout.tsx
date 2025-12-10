import type React from "react";
import { TopNavbar } from "./top-navbar";
import { SidebarNav } from "./sidebar-nav";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <TopNavbar />
      <div className="flex">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-border bg-sidebar md:block">
          <SidebarNav />
        </aside>
        <main className="flex-1 w-full">
          <div className="w-full px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
