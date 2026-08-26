interface SidebarProps {
  onNavigate: (to: string) => void
}

export default function Sidebar({
  onNavigate,
}: SidebarProps) {
  function handleNavigation(
    event: React.MouseEvent<HTMLAnchorElement>,
    to: string,
  ) {
    event.preventDefault()
    onNavigate(to)
  }

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">N</div>

        <div>
          <div className="brand-name">
            NexaISP
          </div>

          <div className="brand-subtitle">
            ERP / OSS / BSS
          </div>
        </div>
      </div>

      <nav className="navigation">
        <div className="navigation-section">
          <span>PRINCIPAL</span>
        </div>

        <a
          href="/"
          className="navigation-item"
          onClick={(event) =>
            handleNavigation(event, '/')
          }
        >
          <span className="navigation-icon">
            ⌂
          </span>

          <span>Dashboard</span>
        </a>

        <div className="navigation-section">
          <span>OPERAÇÃO</span>
        </div>

        <a
          href="/clientes"
          className="navigation-item"
          onClick={(event) =>
            handleNavigation(event, '/clientes')
          }
        >
          <span className="navigation-icon">
            ◉
          </span>

          <span>Clientes</span>
        </a>

        <a
          href="/contratos"
          className="navigation-item"
          onClick={(event) =>
            handleNavigation(event, '/contratos')
          }
        >
          <span className="navigation-icon">
            ▣
          </span>

          <span>Contratos</span>
        </a>

        <a
          href="#"
          className="navigation-item"
          onClick={(event) =>
            event.preventDefault()
          }
        >
          <span className="navigation-icon">
            ◈
          </span>

          <span>Serviços</span>
        </a>

        <a
          href="#"
          className="navigation-item"
          onClick={(event) =>
            event.preventDefault()
          }
        >
          <span className="navigation-icon">
            ⌁
          </span>

          <span>Rede</span>
        </a>

        <div className="navigation-section">
          <span>FINANCEIRO</span>
        </div>

        <a
          href="#"
          className="navigation-item"
          onClick={(event) =>
            event.preventDefault()
          }
        >
          <span className="navigation-icon">
            R$
          </span>

          <span>Faturamento</span>
        </a>

        <a
          href="#"
          className="navigation-item"
          onClick={(event) =>
            event.preventDefault()
          }
        >
          <span className="navigation-icon">
            ✓
          </span>

          <span>Pagamentos</span>
        </a>

        <div className="navigation-section">
          <span>SISTEMA</span>
        </div>

        <a
          href="#"
          className="navigation-item"
          onClick={(event) =>
            event.preventDefault()
          }
        >
          <span className="navigation-icon">
            ⚙
          </span>

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
