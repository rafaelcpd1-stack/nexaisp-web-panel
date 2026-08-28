import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({
  children,
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      {sidebarOpen && (
        <button
          type="button"
          className="mobile-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label="Fechar menu"
        />
      )}

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="main-content">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
        />

        {children}
      </main>
    </div>
  );
}
