import type { ReactNode } from 'react'

import Sidebar from './Sidebar'
import Topbar from './Topbar'

interface AppLayoutProps {
  children: ReactNode
  onNavigate: (to: string) => void
}

export default function AppLayout({
  children,
  onNavigate,
}: AppLayoutProps) {
  return (
    <div className="nexaisp-app">
      <Sidebar onNavigate={onNavigate} />

      <main className="main-content">
        <Topbar />

        <section className="page-content">
          {children}
        </section>
      </main>
    </div>
  )
}
