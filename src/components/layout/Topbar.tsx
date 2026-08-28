import {
  Bell,
  CalendarDays,
  Menu,
  MessageSquare,
} from "lucide-react";

type TopbarProps = {
  onMenuClick?: () => void;
};

export function Topbar({
  onMenuClick,
}: TopbarProps) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="icon-button menu-button"
          onClick={onMenuClick}
          aria-label="Abrir menu"
        >
          <Menu size={20} />
        </button>

        <div className="global-search">
          <span aria-hidden="true">⌕</span>
          <input
            type="text"
            placeholder="Pesquisar clientes, contratos, dispositivos..."
            aria-label="Pesquisar"
          />
          <kbd>CTRL + K</kbd>
        </div>
      </div>

      <div className="topbar-actions">
        <button
          type="button"
          className="period-selector"
        >
          <span>
            <small>Período</small>
            <strong>Este mês</strong>
          </span>
          <CalendarDays size={17} />
        </button>

        <button
          type="button"
          className="top-icon"
          aria-label="Notificações"
        >
          <Bell size={19} />
          <b>8</b>
        </button>

        <button
          type="button"
          className="top-icon"
          aria-label="Mensagens"
        >
          <MessageSquare size={19} />
          <b>3</b>
        </button>

        <button
          type="button"
          className="top-avatar"
          aria-label="Perfil"
        >
          RS
          <i />
        </button>
      </div>
    </header>
  );
}
