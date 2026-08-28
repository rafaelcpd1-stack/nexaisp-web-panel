import {
  Activity,
  BarChart3,
  CircleDollarSign,
  ClipboardList,
  CreditCard,
  Database,
  Gauge,
  Headphones,
  LayoutDashboard,
  Monitor,
  Network,
  Package,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Users,
  Wrench,
  ChevronRight,
  LogOut,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

type NavItem = {
  label: string;
  icon: React.ElementType;
  section?: string;
  path?: string;
};

const navigation: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Clientes", icon: Users, section: "PRINCIPAL", path: "/clientes" },
  { label: "Contratos", icon: ClipboardList, path: "/contratos" },
  { label: "Planos", icon: Package, path: "/planos" },
  { label: "Financeiro", icon: CircleDollarSign, path: "/financeiro" },
  { label: "Atendimentos", icon: Headphones, path: "/atendimentos" },
  { label: "Ordens de Serviço", icon: Wrench, path: "/ordens-servico" },

  { label: "Dispositivos", icon: Monitor, section: "REDE", path: "/dispositivos" },
  { label: "OLT / ONU", icon: Network, path: "/olt-onu" },
  { label: "RADIUS", icon: ShieldCheck, path: "/radius" },
  { label: "IPAM", icon: Database, path: "/ipam" },
  { label: "Monitoramento", icon: Activity, path: "/monitoramento" },

  { label: "Estoque", icon: ShoppingCart, section: "SISTEMA", path: "/estoque" },
  { label: "Fiscal", icon: CreditCard, path: "/fiscal" },
  { label: "Relatórios", icon: BarChart3, path: "/relatorios" },
  { label: "Configurações", icon: Settings, path: "/configuracoes" },
];

type SidebarProps = {
  open?: boolean;
  onClose?: () => void;
};

export function Sidebar({
  open = false,
  onClose,
}: SidebarProps) {
  const { user, logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
      window.location.replace("/login");
    } catch (error) {
      console.error("Erro ao encerrar sessão:", error);
    }
  }

  return (
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <div className="brand">
        <div className="brand-mark">
          <span>N</span>
        </div>

        <div className="brand-copy">
          <strong>NexaISP</strong>
          <small>ERP & BSS</small>
        </div>

        <button
          type="button"
          className="sidebar-close"
          onClick={onClose}
          aria-label="Fechar menu"
        >
          <X size={19} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label}>
              {item.section && (
                <div className="nav-section">{item.section}</div>
              )}

              {item.path ? (
                <NavLink
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? "active" : ""}`
                  }
                  onClick={() => onClose?.()}
                >
                  <Icon size={18} strokeWidth={1.9} />
                  <span>{item.label}</span>

                  {item.label !== "Dashboard" && (
                    <ChevronRight
                      className="nav-chevron"
                      size={15}
                    />
                  )}
                </NavLink>
              ) : null}
            </div>
          );
        })}
      </nav>

      <div className="sidebar-provider">
        <div className="provider-logo">
          <Gauge size={22} />
        </div>

        <div>
          <strong>NexaISP Telecom</strong>
          <span>ID: nexaisp</span>
        </div>

        <i className="online-dot" />
      </div>

      <div className="sidebar-user">
        <div className="avatar">
          {(user?.name ?? "Usuário")
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part.charAt(0).toUpperCase())
            .join("")}
        </div>

        <div className="user-copy">
          <strong>{user?.name ?? "Usuário"}</strong>
          <span>{user?.email ?? "Conta autenticada"}</span>
        </div>

        <button
          type="button"
          className="logout-button"
          onClick={() => void handleLogout()}
          title="Sair"
          aria-label="Sair do NexaISP"
        >
          <LogOut size={17} />
        </button>
      </div>
    </aside>
  );
}
