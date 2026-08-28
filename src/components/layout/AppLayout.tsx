import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

type AppLayoutProps = {
  children?: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-content">
        <Topbar />

        {children ?? <Outlet />}
      </main>
    </div>
  );
}
