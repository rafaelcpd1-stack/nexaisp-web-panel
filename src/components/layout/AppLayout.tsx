import type { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="nexaisp-app">
      <Sidebar />

      <main className="main-content">
        <Topbar />

        <section className="page-content">
          {children}
        </section>
      </main>
    </div>
  )
}
