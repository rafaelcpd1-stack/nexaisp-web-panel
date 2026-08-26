import { useEffect, useState } from 'react'
import { logout } from '../../api/auth'
import { getSessionUser, type SessionUser } from '../../api/session'

interface TopbarProps {
  userName?: string
  userEmail?: string
}

export default function Topbar({
  userName,
  userEmail,
}: TopbarProps) {
  const [user, setUser] = useState<SessionUser | null>(null)

  useEffect(() => {
    let mounted = true

    void getSessionUser()
      .then((sessionUser) => {
        if (mounted) {
          setUser(sessionUser)
        }
      })
      .catch(() => {
        // Mantém a interface estável caso a sessão ainda não esteja disponível.
      })

    return () => {
      mounted = false
    }
  }, [])

  const displayName = user?.name ?? userName ?? 'NexaISP'
  const displayEmail = user?.email ?? userEmail ?? ''
  const initial = displayName.trim().charAt(0).toUpperCase() || 'N'

  return (
    <header className="topbar">
      <div>
        <div className="topbar-kicker">NEXAISP</div>
        <div className="topbar-title">Painel de Gestão</div>
      </div>

      <div className="topbar-user">
        <div className="user-avatar">
          {initial}
        </div>

        <div>
          <div className="user-name">{displayName}</div>
          <div className="user-role">{displayEmail}</div>
        </div>

        <button
          className="logout-button"
          type="button"
          onClick={() => {
            void logout().catch(() => {
              // Mantém a interface estável se o logout falhar.
            })
          }}
        >
          Sair
        </button>
      </div>
    </header>
  )
}
