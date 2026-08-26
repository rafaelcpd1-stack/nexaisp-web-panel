function isActive(path: string): boolean {
  const current = window.location.pathname.replace(/\/+$/, '') || '/'
  return current === path || (path !== '/' && current.startsWith(`${path}/`))
}

const navigationClass = (path: string): string =>
  `navigation-item${isActive(path) ? ' active' : ''}`

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">N</div>

        <div>
          <div className="brand-name">NexaISP</div>
          <div className="brand-subtitle">ERP / OSS / BSS</div>
        </div>
      </div>

      <nav className="navigation">
        <div className="navigation-section">
          <span>PRINCIPAL</span>
        </div>

        <a href="/" className={navigationClass('/')}>
          <span className="navigation-icon">⌂</span>
          <span>Dashboard</span>
        </a>

        <div className="navigation-section">
          <span>OPERAÇÃO</span>
        </div>

        <a href="/clientes" className={navigationClass('/clientes')}>
          <span className="navigation-icon">◉</span>
          <span>Clientes</span>
        </a>

        <a href="#" className="navigation-item navigation-item-disabled" aria-disabled="true" onClick={(event) => event.preventDefault()}>
          <span className="navigation-icon">▣</span>
          <span>Contratos</span>
        </a>

        <a href="#" className="navigation-item navigation-item-disabled" aria-disabled="true" onClick={(event) => event.preventDefault()}>
          <span className="navigation-icon">◈</span>
          <span>Serviços</span>
        </a>

        <a href="/rede" className={navigationClass('/rede')}>
          <span className="navigation-icon">⌁</span>
          <span>Rede</span>
        </a>

        <div className="navigation-section">
          <span>FINANCEIRO</span>
        </div>

        <a href="#" className="navigation-item navigation-item-disabled" aria-disabled="true" onClick={(event) => event.preventDefault()}>
          <span className="navigation-icon">R$</span>
          <span>Faturamento</span>
        </a>

        <a href="#" className="navigation-item navigation-item-disabled" aria-disabled="true" onClick={(event) => event.preventDefault()}>
          <span className="navigation-icon">✓</span>
          <span>Pagamentos</span>
        </a>

        <div className="navigation-section">
          <span>SISTEMA</span>
        </div>

        <a href="#" className="navigation-item navigation-item-disabled" aria-disabled="true" onClick={(event) => event.preventDefault()}>
          <span className="navigation-icon">⚙</span>
          <span>Configurações</span>
        </a>
      </nav>

      <div className="sidebar-footer">
        <div className="system-status">
          <span className="status-dot" />
          <span>Sistema operacional</span>
        </div>
      </div>
    </aside>
  )
}
